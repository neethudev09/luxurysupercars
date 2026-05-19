import { defineField, defineType } from "sanity";

export const faq = defineType({
  name: "faq",
  title: "FAQ",
  type: "document",
  fields: [
    defineField({
      name: "question",
      title: "Question",
      type: "string",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "answer",
      title: "Answer",
      type: "text",
      rows: 4,
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "category",
      title: "Category",
      type: "string",
      options: {
        list: [
          { title: "Booking", value: "booking" },
          { title: "Documents", value: "documents" },
          { title: "Payment", value: "payment" },
          { title: "Delivery", value: "delivery" },
          { title: "Other", value: "other" },
        ],
        layout: "dropdown",
      },
      initialValue: "other",
    }),
    defineField({
      name: "showOnHomepage",
      title: "Show in homepage FAQ teaser",
      type: "boolean",
      description: "Homepage shows the top 4 ticked entries (the dedicated /faq page lists everything).",
      initialValue: false,
    }),
    defineField({
      name: "order",
      title: "Manual sort order",
      type: "number",
      description: "Lower numbers appear first. Leave blank to sort alphabetically by question.",
    }),
  ],
  orderings: [
    {
      title: "Manual order, then question",
      name: "orderAsc",
      by: [
        { field: "order", direction: "asc" },
        { field: "question", direction: "asc" },
      ],
    },
  ],
  preview: {
    select: { title: "question", subtitle: "category" },
    prepare: ({ title, subtitle }) => ({
      title,
      subtitle: subtitle ? `${subtitle}` : undefined,
    }),
  },
});
