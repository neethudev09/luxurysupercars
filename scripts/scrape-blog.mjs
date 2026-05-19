#!/usr/bin/env node
/**
 * Scrapes every blog post from luxurysupercarsdubai.com and writes a
 * JSON registry to lib/blog-data.json. Re-run any time the live blog
 * changes; existing entries are overwritten.
 *
 * The redesign mirrors live SEO verbatim — title, meta description, OG
 * tags, hero image, headings, and body HTML are all preserved.
 */
import { writeFileSync, readFileSync, existsSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import * as cheerio from "cheerio";

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(__dirname, "..");
const OUT = resolve(ROOT, "lib/blog-data.json");
const SITEMAP_URL = "https://luxurysupercarsdubai.com/blogs-sitemap.xml";
const CONCURRENCY = 6;

async function getSitemapUrls() {
  const res = await fetch(SITEMAP_URL, { redirect: "follow" });
  const xml = await res.text();
  return [...xml.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1]).filter((u) => u.includes("/blogs/"));
}

function slugFromUrl(url) {
  const m = url.match(/\/blogs\/([^/]+)\/?$/);
  return m ? m[1] : null;
}

function extractDate($) {
  // Elementor "post-info" widget renders publish date as plain text.
  const txt = $(".elementor-widget-post-info").first().text().trim();
  if (!txt) return null;
  // First line / first chunk is usually the date, e.g. "January 25, 2026"
  const m = txt.match(/[A-Z][a-z]+\s+\d{1,2},\s*\d{4}/);
  return m ? m[0] : null;
}

async function scrapeOne(url) {
  const res = await fetch(url, { redirect: "follow" });
  if (!res.ok) throw new Error(`HTTP ${res.status} for ${url}`);
  const html = await res.text();
  const $ = cheerio.load(html);

  const slug = slugFromUrl(url);
  const title = $("title").first().text().trim();
  const metaDescription = $('meta[name="description"]').attr("content") || "";
  const ogTitle = $('meta[property="og:title"]').attr("content") || title;
  const ogDescription = $('meta[property="og:description"]').attr("content") || metaDescription;
  const ogImage = $('meta[property="og:image"]').attr("content") || "";
  const ogImageWidth = Number($('meta[property="og:image:width"]').attr("content")) || undefined;
  const ogImageHeight = Number($('meta[property="og:image:height"]').attr("content")) || undefined;
  const canonical = $('link[rel="canonical"]').attr("href") || url;

  const h1 = $(".elementor-widget-theme-post-title h1").first().text().trim()
    || $("h1.elementor-heading-title").first().text().trim();

  const date = extractDate($);

  // Body lives directly inside .elementor-widget-theme-post-content
  // (the live site renders content as direct children, no .elementor-widget-container wrapper).
  let bodyEl = $(".elementor-widget-theme-post-content").first();
  if (bodyEl.find(".elementor-widget-container").length) {
    bodyEl = bodyEl.find(".elementor-widget-container").first();
  }
  let bodyHtml = bodyEl.html() || "";
  // Strip <style> and <script> defensively
  bodyHtml = bodyHtml.replace(/<style[\s\S]*?<\/style>/gi, "").replace(/<script[\s\S]*?<\/script>/gi, "");
  bodyHtml = bodyHtml.trim();

  // Excerpt: first non-empty paragraph text, truncated to ~180 chars.
  const firstP = bodyEl.find("p").first().text().trim();
  const excerpt = firstP ? (firstP.length > 200 ? firstP.slice(0, 197) + "…" : firstP) : (ogDescription || metaDescription).slice(0, 200);

  return {
    slug,
    url,
    canonical,
    title,
    metaDescription,
    ogTitle,
    ogDescription,
    ogImage,
    ogImageWidth,
    ogImageHeight,
    h1,
    date,
    excerpt,
    bodyHtml,
  };
}

async function runWithConcurrency(items, limit, worker) {
  const results = new Array(items.length);
  let idx = 0;
  async function next() {
    while (true) {
      const i = idx++;
      if (i >= items.length) return;
      try {
        results[i] = await worker(items[i], i);
        process.stdout.write(`  [${i + 1}/${items.length}] ${items[i]}\n`);
      } catch (e) {
        process.stderr.write(`  ! [${i + 1}/${items.length}] ${items[i]}: ${e.message}\n`);
        results[i] = { error: e.message, url: items[i] };
      }
    }
  }
  await Promise.all(Array.from({ length: limit }, () => next()));
  return results;
}

(async () => {
  console.log(`Fetching sitemap: ${SITEMAP_URL}`);
  const urls = await getSitemapUrls();
  console.log(`Found ${urls.length} blog posts. Scraping with concurrency=${CONCURRENCY}...`);

  const posts = await runWithConcurrency(urls, CONCURRENCY, scrapeOne);
  const ok = posts.filter((p) => p && !p.error && p.slug);
  console.log(`Scraped ${ok.length} / ${urls.length} successfully.`);

  // Sort newest first by parsed date when available.
  ok.sort((a, b) => {
    const da = a.date ? Date.parse(a.date) : 0;
    const db = b.date ? Date.parse(b.date) : 0;
    return db - da;
  });

  writeFileSync(OUT, JSON.stringify(ok, null, 2) + "\n");
  const sizeKb = (readFileSync(OUT).length / 1024).toFixed(1);
  console.log(`Wrote ${OUT} (${sizeKb} KB)`);
})();
