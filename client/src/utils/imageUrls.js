/**
 * Normalize user-pasted image URLs for display (trim, protocol, arrays vs strings).
 * Matches backend postController normalization.
 */
export function normalizeImageUrl(url) {
  if (url == null || typeof url !== "string") return "";
  let u = url.trim();
  if (!u) return "";

  if (/^data:image\//i.test(u)) return u;

  // People often copy a link with trailing punctuation (e.g. ")" or ",")
  u = u.replace(/^["'(<[]+/, "").replace(/["')>\\\],.]+$/, "");

  if (u.startsWith("//")) u = `https:${u}`;

  // Convert common share links to direct "image" URLs
  // so <img src="..."> actually renders.
  if (/drive\.google\.com/i.test(u)) {
    // Examples:
    // - https://drive.google.com/file/d/<id>/view?usp=sharing
    // - https://drive.google.com/thumbnail?id=<id>&sz=...
    // - https://drive.google.com/uc?export=view&id=<id>
    const idMatch =
      u.match(/\/file\/d\/([a-zA-Z0-9_-]+)/i) ||
      u.match(/\/thumbnail\?id=([a-zA-Z0-9_-]+)/i) ||
      u.match(/[?&]id=([a-zA-Z0-9_-]+)/i);
    if (idMatch?.[1]) {
      return `https://drive.google.com/uc?export=view&id=${idMatch[1]}`;
    }
  }

  if (/dropbox\.com/i.test(u)) {
    // Dropbox often needs `?raw=1` (or already has it).
    if (!/([?&](raw|dl)=)/i.test(u)) {
      const sep = u.includes("?") ? "&" : "?";
      u = `${u}${sep}raw=1`;
    }
  }

  if (!/^https?:\/\//i.test(u)) {
    u = u.replace(/^\/+/, "");
    u = `https://${u}`;
  }
  return u;
}

export function normalizePhotoList(raw) {
  if (raw == null) return [];
  let list = [];
  if (Array.isArray(raw)) {
    list = raw;
  } else if (typeof raw === "string") {
    const s = raw.trim();
    if (!s) return [];
    try {
      const parsed = JSON.parse(s);
      if (Array.isArray(parsed)) list = parsed;
      else list = s.split(/[\n,]/).map((x) => x.trim()).filter(Boolean);
    } catch {
      list = s.split(/[\n,]/).map((x) => x.trim()).filter(Boolean);
    }
  }
  const out = [];
  const seen = new Set();
  for (const item of list) {
    const n = normalizeImageUrl(typeof item === "string" ? item : String(item ?? ""));
    if (n && !seen.has(n)) {
      seen.add(n);
      out.push(n);
    }
  }
  return out;
}

export function getPostDisplayImages(post) {
  if (!post || typeof post !== "object") return [];
  const room = normalizePhotoList(post.roomPhotos);
  const profile = normalizeImageUrl(post.profileImage);
  if (room.length > 0) return room;
  if (profile) return [profile];
  return [];
}
