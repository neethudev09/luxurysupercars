import { SERVICES_PAGE } from "@/lib/content";
import { batchCreateOrReplace, paragraphsToPortableText } from "./lib";

/**
 * 4 service detail pages. Verbatim metaTitle/metaDescription/h1/paragraphs
 * from lib/content.ts (which is in turn verbatim from the live
 * /service/{slug}/ pages).
 */
async function main() {
  const docs = SERVICES_PAGE.items.map((it, idx) => ({
    _id: `service-${it.slug}`,
    _type: "service",
    title: it.title,
    slug: { _type: "slug", current: it.slug },
    summary: it.summary,
    h1: it.h1,
    body: paragraphsToPortableText(it.paragraphs.join("\n\n")),
    order: idx,
    seo: {
      title: it.metaTitle,
      description: it.metaDescription,
      noIndex: false,
    },
  }));

  await batchCreateOrReplace(docs, { label: "services" });
  console.log(`✓ ${docs.length} services`);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
