import { CONTACT, SOCIAL, FOOTER } from "@/lib/content";
import { client } from "./lib";

/**
 * Site settings singleton — phone numbers, email, addresses, social
 * URLs, footer description. Verbatim from lib/content.ts.
 */
async function main() {
  const doc = {
    _id: "siteSettings",
    _type: "siteSettings",
    title: "Luxury Supercars Dubai",
    description:
      "Dubai's Most Trusted Supercar Rentals. Premium Services with 24/7 Support and Free Delivery Across Dubai.",
    contact: {
      primaryPhone: CONTACT.primaryPhone,
      secondaryPhone: CONTACT.secondaryPhone,
      landline: CONTACT.landline,
      email: CONTACT.email,
      address: CONTACT.address,
      altAddress: CONTACT.altAddress,
      operationHours: "9 am – 9 pm (Monday–Sunday)",
    },
    social: {
      facebook: SOCIAL.facebook,
      instagram: SOCIAL.instagram,
      twitter: SOCIAL.twitter,
      youtube: SOCIAL.youtube,
      tiktok: SOCIAL.tiktok,
    },
    footerDescription: FOOTER.description,
  };

  await client.createOrReplace(doc);
  console.log("✓ siteSettings");
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
