/**
 * Sanity schema registry. New types are added here and immediately
 * appear in the Studio.
 *
 * The current set covers everything migrated from the on-disk JSON +
 * the editorially-managed content blocks the owner wanted to control
 * without code commits.
 */
import type { SchemaTypeDefinition } from "sanity";

// Shared objects
import { seo } from "./objects/seo";

// Document types
import { siteSettings } from "./documents/siteSettings";
import { page } from "./documents/page";
import { faq } from "./documents/faq";
import { testimonial } from "./documents/testimonial";
import { service } from "./documents/service";
import { brand } from "./documents/brand";
import { car } from "./documents/car";
import { blogPost } from "./documents/blogPost";

export const schemaTypes: SchemaTypeDefinition[] = [
  // shared
  seo,
  // singletons + documents
  siteSettings,
  page,
  brand,
  car,
  blogPost,
  faq,
  testimonial,
  service,
];
