import { client } from "./lib";

/**
 * One-off: discard the stale empty Home-page draft left over from before the
 * content existed. Lists all current drafts first (so we can flag any others),
 * then deletes only drafts.page-home. Published content is untouched.
 */
async function main() {
  const drafts: { _id: string }[] = await client.fetch(`*[_id in path("drafts.**")]{ _id }`);
  console.log(
    "Drafts currently in Sanity:",
    drafts.length ? drafts.map((d) => d._id).join(", ") : "(none)",
  );

  if (drafts.some((d) => d._id === "drafts.page-home")) {
    await client.delete("drafts.page-home");
    console.log("✓ Discarded the stale Home-page draft. Published content is unchanged.");
  } else {
    console.log("• No Home-page draft to discard.");
  }
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
