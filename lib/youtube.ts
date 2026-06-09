/**
 * Normalise whatever an editor pastes for a video into a bare YouTube ID.
 *
 * The About page embeds are YouTube-hosted (incl. the TikTok/podcast reels),
 * and the player/thumbnail URLs are built from the 11-char video ID. A
 * non-technical editor will paste a full link, so accept every common form
 * — watch?v=, youtu.be/, /shorts/, /embed/, /live/ — or a bare ID, and
 * fall back to returning the input untouched if nothing matches.
 */
export function youTubeId(input: string | undefined | null): string {
  if (!input) return "";
  const s = String(input).trim();
  if (/^[a-zA-Z0-9_-]{11}$/.test(s)) return s; // already an ID
  const patterns = [
    /[?&]v=([a-zA-Z0-9_-]{11})/, // …/watch?v=ID
    /youtu\.be\/([a-zA-Z0-9_-]{11})/, // youtu.be/ID
    /\/shorts\/([a-zA-Z0-9_-]{11})/, // …/shorts/ID
    /\/embed\/([a-zA-Z0-9_-]{11})/, // …/embed/ID
    /\/live\/([a-zA-Z0-9_-]{11})/, // …/live/ID
  ];
  for (const re of patterns) {
    const m = s.match(re);
    if (m) return m[1];
  }
  return s;
}

/** Map a list of pasted links/IDs to clean IDs, dropping blanks. */
export function youTubeIds(list: readonly (string | undefined | null)[] | undefined): string[] {
  return (list ?? []).map(youTubeId).filter(Boolean);
}
