/**
 * Sanity Studio config — drives the embedded /studio route.
 *
 * Studio is mounted at /studio via app/studio/[[...tool]]/page.tsx;
 * editors log in at luxurysupercarsdubai.com/studio with their Sanity
 * account (invited via Project Settings → Members in sanity.io).
 */
import { defineConfig } from "sanity";
import { structureTool } from "sanity/structure";
import { visionTool } from "@sanity/vision";
import { schemaTypes } from "./sanity/schemas";
import { structure } from "./sanity/structure";
import { projectId, dataset, apiVersion } from "./sanity/env";

export default defineConfig({
  name: "default",
  title: "Luxury Supercars Dubai",
  projectId,
  dataset,
  basePath: "/studio",
  plugins: [
    structureTool({ structure }),
    // Vision: ad-hoc GROQ playground at /studio/vision — handy for testing queries.
    visionTool({ defaultApiVersion: apiVersion }),
  ],
  schema: {
    types: schemaTypes,
  },
  document: {
    // Hide "Create new" for our singletons (siteSettings + page) from
    // the global "+ Create" menu. Editors edit them via the desk only.
    newDocumentOptions: (prev, { creationContext }) =>
      creationContext.type === "global"
        ? prev.filter(
            (t) => !["siteSettings", "page"].includes(t.templateId ?? ""),
          )
        : prev,
    // Block "Duplicate" + "Delete" on singletons — editors should only
    // edit the canonical instance.
    actions: (prev, { schemaType }) =>
      ["siteSettings", "page"].includes(schemaType)
        ? prev.filter((a) => !["duplicate", "delete"].includes(a.action ?? ""))
        : prev,
  },
});
