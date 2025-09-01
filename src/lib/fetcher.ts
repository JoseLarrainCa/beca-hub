export async function fetchJson(url: string) {
  const r = await fetch(url);
  const text = await r.text();
  if (!r.ok) {
    let message = text;
    try { message = JSON.parse(text)?.error || message; } catch {}
    throw new Error(`HTTP ${r.status} - ${message}`);
  }
  return JSON.parse(text);
}
