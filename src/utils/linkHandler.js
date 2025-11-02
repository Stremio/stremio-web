// src/utils/linkHandler.js
// Utilities for handling meta.link objects and link actions.

export function openExternal(url) {
  try {
    // open in new tab with security flags
    window.open(url, '_blank', 'noopener,noreferrer');
  } catch (e) {
    // fallback: navigate current window
    window.location.href = url;
  }
}

export function copyToClipboard(text) {
  if (!navigator.clipboard) {
    const el = document.createElement('textarea');
    el.value = text;
    el.style.position = 'fixed';
    el.style.left = '-9999px';
    document.body.appendChild(el);
    el.select();
    try { document.execCommand('copy'); } catch (err) {}
    document.body.removeChild(el);
    return Promise.resolve();
  }
  return navigator.clipboard.writeText(text);
}

/**
 * Try to play the url in-app via the host bridge.
 * - If window.Stremio.play exists, call it.
 * - Otherwise dispatch a custom event 'stremio-play-link' (repo may listen for it).
 * - Fallback: open externally after a short delay.
 */
export async function playInApp(url, meta = {}) {
  try {
    if (window.Stremio && typeof window.Stremio.play === 'function') {
      return window.Stremio.play(url, meta);
    }
    // dispatch event for hosting wrapper to pick up
    const ev = new CustomEvent('stremio-play-link', { detail: { url, meta }});
    window.dispatchEvent(ev);
    // fallback to open externally after 350ms if nothing else happens
    setTimeout(() => openExternal(url), 350);
  } catch (err) {
    openExternal(url);
  }
}

/**
 * Decide how to handle a meta.link object.
 * link = { name, type, url, img, info }
 */
export async function handleMetaLink(link, meta = {}) {
  if (!link || !link.url) return;

  const url = String(link.url);
  const type = String(link.type || '').toLowerCase();

  // treat magnet and torrent files as playable
  if (url.startsWith('magnet:') || url.endsWith('.torrent')) {
    return playInApp(url, meta);
  }

  // If type clearly indicates playable stream
  const playableTypes = ['stream', 'video', 'play', 'http', 'https', 'magnet', 'torrent', 'm3u8', 'mp4'];
  if (playableTypes.includes(type)) {
    return playInApp(url, meta);
  }

  // types that are clearly external info links
  const externalTypes = ['imdb', 'website', 'external', 'trailer', 'info', 'purchase'];
  if (externalTypes.includes(type)) {
    return openExternal(url);
  }

  // stremio protocol deep link -> in-app first
  if (url.startsWith('stremio://')) {
    return playInApp(url, meta);
  }

  // default fallback: open externally
  return openExternal(url);
}
