export interface GFile { url: string; name: string }

export const isGmailUrl = (url?: string) => !!url && /^https:\/\/mail\.google\.com\//.test(url);

/**
 * Runs INSIDE the Gmail tab (chrome.scripting.executeScript) — must stay self-contained, no imports.
 * Returns attachments visible on the open page: Gmail marks each attachment card with
 * `download_url="mime:name:https://mail.google.com/…"`. Fallback: visible attachment links (view=att)
 * when a conversation is open.
 */
export function scanGmail(): GFile[] {
  const out: GFile[] = [];
  const seen = new Set<string>();
  const visible = (el: Element) => el.getClientRects().length > 0;
  const keyOf = (url: string) => {
    const q = (k: string) => new RegExp(`[?&]${k}=([^&#]+)`).exec(url)?.[1] ?? '';
    const att = q('realattid') || q('attid');
    return att ? `${q('permmsgid') || q('th')}|${att}` : url;
  };
  const add = (url: string, name: string) => {
    if (!/^https:\/\/mail\.google\.com\//.test(url)) return;
    const k = keyOf(url);
    if (seen.has(k)) return;
    seen.add(k);
    out.push({ url, name: name.trim() });
  };
  document.querySelectorAll('[download_url]').forEach((el) => {
    if (!visible(el)) return;
    const v = el.getAttribute('download_url') ?? '';
    const at = v.indexOf(':https://');
    if (at < 0) return;
    const name = v.slice(v.indexOf(':') + 1, at);
    add(v.slice(at + 1), name);
  });
  const openThread = /\/[A-Za-z0-9_-]{16,}$/.test(location.hash);
  if (!out.length && openThread) {
    document.querySelectorAll<HTMLAnchorElement>('a[href*="view=att"]').forEach((a) => {
      if (!visible(a) || !/[?&](real)?attid=/.test(a.href)) return;
      add(a.href, a.getAttribute('aria-label') ?? a.textContent ?? '');
    });
  }
  return out;
}
