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

type FounderVideoEmbed = {
  provider: "youtube" | "vimeo" | "file";
  id: string;
  src: string;
};

const YOUTUBE_ID_RE = /^[a-zA-Z0-9_-]{11}$/;

function vimeoParts(input: string): { id: string; hash?: string } | null {
  const s = input.trim();
  if (/^\d+$/.test(s)) return { id: s };

  const match = s.match(/vimeo\.com\/(?:video\/)?(\d+)(?:\/([a-zA-Z0-9]+))?/);
  if (!match) return null;

  let hash = match[2];
  try {
    const url = new URL(s);
    hash = url.searchParams.get("h") || hash;
  } catch {
    // Plain IDs or partial URLs are handled by the regex above.
  }

  return { id: match[1], hash };
}

function youtubeEmbed(id: string): FounderVideoEmbed {
  const params = new URLSearchParams({
    autoplay: "1",
    mute: "1",
    loop: "1",
    playlist: id,
    playsinline: "1",
    controls: "0",
    modestbranding: "1",
    rel: "0",
  });

  return {
    provider: "youtube",
    id,
    src: `https://www.youtube-nocookie.com/embed/${id}?${params.toString()}`,
  };
}

function vimeoEmbed(id: string, hash?: string): FounderVideoEmbed {
  const params = new URLSearchParams({
    autoplay: "1",
    muted: "1",
    loop: "1",
    background: "1",
    autopause: "0",
    playsinline: "1",
    title: "0",
    byline: "0",
    portrait: "0",
  });
  if (hash) params.set("h", hash);

  return {
    provider: "vimeo",
    id,
    src: `https://player.vimeo.com/video/${id}?${params.toString()}`,
  };
}

function fileVideo(src: string): FounderVideoEmbed {
  return {
    provider: "file",
    id: src,
    src,
  };
}

export function founderVideoEmbed(
  input: string | undefined | null,
  fallbackYoutubeId = "TjB258kdQFc",
): FounderVideoEmbed {
  const raw = String(input || "").trim();
  const source = raw || fallbackYoutubeId;
  const youtubeId = youTubeId(source);

  if (YOUTUBE_ID_RE.test(youtubeId)) return youtubeEmbed(youtubeId);

  const vimeo = vimeoParts(source);
  if (vimeo) return vimeoEmbed(vimeo.id, vimeo.hash);

  return youtubeEmbed(fallbackYoutubeId);
}

export function backgroundVideoEmbed(input: string): FounderVideoEmbed {
  const source = input.trim();
  const youtubeId = youTubeId(source);

  if (YOUTUBE_ID_RE.test(youtubeId)) return youtubeEmbed(youtubeId);

  const vimeo = vimeoParts(source);
  if (vimeo) return vimeoEmbed(vimeo.id, vimeo.hash);

  if (source) return fileVideo(source);

  return fileVideo("/ahmed-trim.mp4");
}
