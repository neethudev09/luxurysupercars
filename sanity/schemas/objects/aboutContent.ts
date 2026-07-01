import { defineField, defineType } from "sanity";

/**
 * About-page editorial content — every heading, paragraph, venture card and
 * video embed the team can edit without a code deploy. Embedded as a single
 * `aboutContent` field on the About `page` document, shown ONLY on
 * page-about-us.
 *
 * Render-side: scripts/sanity/export-to-json.ts writes this block verbatim to
 * lib/generated/about.json, and lib/content.ts reads each field with a
 * fallback to the verbatim live copy — so an empty field never blanks the
 * page and an un-migrated doc renders exactly the current wording.
 *
 * Video fields accept a full YouTube link (or a bare video ID) — paste the
 * normal share/watch URL and the site extracts the ID automatically
 * ([lib/youtube.ts](lib/youtube.ts)). All three embed rails (TikTok, YouTube,
 * Podcasts) are YouTube-hosted. Emptying a rail's list hides that rail.
 */

const VIDEO_DESC = "Paste the full YouTube link (or just the video ID). Leave the list empty to hide this section.";

/** A heading + an editable list of YouTube links — one embed rail. */
const embedRail = (title: string) =>
  defineField({
    name: title.toLowerCase(),
    title: `${title} rail`,
    type: "object",
    options: { collapsible: true, collapsed: true },
    fields: [
      defineField({ name: "heading", title: "Heading", type: "string" }),
      defineField({
        name: "videos",
        title: "Videos (YouTube links)",
        type: "array",
        of: [{ type: "string" }],
        description: VIDEO_DESC,
      }),
    ],
  });

export const aboutContent = defineType({
  name: "aboutContent",
  title: "About page content",
  type: "object",
  options: { collapsible: true, collapsed: false },
  fields: [
    /* ------------------------------ Hero ----------------------------- */
    defineField({
      name: "hero",
      title: "Hero (video banner)",
      type: "object",
      options: { collapsible: true, collapsed: false },
      fields: [
        defineField({
          name: "heading",
          title: "Heading",
          type: "string",
          description: "Wrap words in **double asterisks** to gold-emphasise them.",
        }),
        defineField({ name: "paragraph", title: "Paragraph", type: "text", rows: 3 }),
        defineField({
          name: "backgroundVideo",
          title: "Background video",
          type: "file",
          options: { accept: "video/mp4,video/*" },
          description: "Looping muted clip behind the hero text. Leave empty to keep the current video.",
        }),
      ],
    }),

    /* --------------------------- Founder video ----------------------- */
    defineField({
      name: "founder",
      title: "Founder video section",
      type: "object",
      options: { collapsible: true, collapsed: true },
      fields: [
        defineField({ name: "heading", title: "Heading", type: "string" }),
        defineField({ name: "paragraph", title: "Paragraph", type: "text", rows: 4 }),
        defineField({
          name: "videoUrl",
          title: "Video (YouTube or Vimeo link)",
          type: "string",
          description: "Paste the full YouTube or Vimeo link.",
        }),
        defineField({
          name: "signature",
          title: "Signature image",
          type: "image",
          options: { hotspot: true },
          description: "The handwritten signature shown above the video.",
        }),
      ],
    }),

    /* ----------------------------- About me -------------------------- */
    defineField({
      name: "aboutMe",
      title: "“About me” section",
      type: "object",
      options: { collapsible: true, collapsed: true },
      fields: [
        defineField({ name: "heading", title: "Heading", type: "string" }),
        defineField({
          name: "paragraphs",
          title: "Paragraphs",
          type: "array",
          of: [{ type: "text", rows: 4 }],
        }),
        defineField({
          name: "portrait",
          title: "Portrait photo",
          type: "image",
          options: { hotspot: true },
        }),
      ],
    }),

    /* ----------------------------- Ventures -------------------------- */
    defineField({
      name: "ventures",
      title: "“CEO of” ventures",
      type: "object",
      options: { collapsible: true, collapsed: true },
      description: "The group-company cards. Edit the names, descriptions and logos here.",
      fields: [
        defineField({ name: "eyebrow", title: "Eyebrow (small label)", type: "string" }),
        defineField({
          name: "items",
          title: "Ventures",
          type: "array",
          of: [
            {
              type: "object",
              name: "venture",
              fields: [
                defineField({ name: "title", title: "Name", type: "string" }),
                defineField({ name: "body", title: "Description", type: "text", rows: 3 }),
                defineField({
                  name: "logo",
                  title: "Logo",
                  type: "image",
                  options: { hotspot: true },
                  description: "Leave empty to show the company initials.",
                }),
                defineField({
                  name: "bordered",
                  title: "Show logo in a white circle",
                  type: "boolean",
                  description: "On for photo-style logos; off for transparent gold marks.",
                  initialValue: false,
                }),
              ],
              preview: { select: { title: "title", subtitle: "body", media: "logo" } },
            },
          ],
        }),
      ],
    }),

    /* --------------------------- Press / awards reel ----------------- */
    defineField({
      name: "pressReel",
      title: "Press / awards / Instagram reel",
      type: "object",
      options: { collapsible: true, collapsed: true },
      description: "The scrolling tile strip. Add, remove or reorder tiles; empty the list to hide the strip.",
      fields: [
        defineField({
          name: "items",
          title: "Tiles",
          type: "array",
          of: [
            {
              type: "object",
              name: "pressTile",
              fields: [
                defineField({
                  name: "category",
                  title: "Label",
                  type: "string",
                  options: {
                    list: [
                      { title: "Award", value: "Award" },
                      { title: "Press", value: "Press" },
                      { title: "Instagram", value: "Instagram" },
                    ],
                    layout: "radio",
                  },
                  initialValue: "Press",
                }),
                defineField({ name: "caption", title: "Caption", type: "string" }),
                defineField({ name: "image", title: "Image", type: "image", options: { hotspot: true } }),
              ],
              preview: { select: { title: "caption", subtitle: "category", media: "image" } },
            },
          ],
        }),
      ],
    }),

    /* --------------------------- Video embeds ------------------------ */
    defineField({
      name: "embeds",
      title: "Video rails (TikTok · YouTube · Podcasts)",
      type: "object",
      options: { collapsible: true, collapsed: false },
      description: "Choose which videos appear in each rail by editing its list of YouTube links.",
      fields: [embedRail("TikTok"), embedRail("YouTube"), embedRail("Podcasts")],
    }),
  ],
});
