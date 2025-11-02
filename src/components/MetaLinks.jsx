// src/components/MetaLinks.jsx
import React from 'react';
import PropTypes from 'prop-types';
import { handleMetaLink, copyToClipboard } from '../utils/linkHandler';

/**
 * MetaLinks component
 * Props:
 * - links: array of meta.link objects
 * - meta: the meta object (passed to playInApp as context)
 */
export default function MetaLinks({ links = [], meta = {} }) {
  if (!links || !links.length) return null;

  const onPrimaryClick = async (link) => {
    await handleMetaLink(link, meta);
  };

  const onCopyClick = async (e, link) => {
    e.stopPropagation();
    try {
      await copyToClipboard(link.url);
      showTemporaryToast('Link copied');
    } catch (err) {
      showTemporaryToast('Copy failed');
    }
  };

  const showTemporaryToast = (text) => {
    const toast = document.createElement('div');
    toast.innerText = text;
    toast.style.position = 'fixed';
    toast.style.bottom = '20px';
    toast.style.right = '20px';
    toast.style.padding = '8px 12px';
    toast.style.background = 'rgba(0,0,0,0.8)';
    toast.style.color = 'white';
    toast.style.borderRadius = '6px';
    toast.style.zIndex = 9999;
    document.body.appendChild(toast);
    setTimeout(() => {
      try { document.body.removeChild(toast); } catch (e) {}
    }, 1400);
  };

  const renderLabel = (link) => {
    if (link.name) return link.name;
    if (link.type) return link.type;
    try {
      return new URL(link.url).hostname;
    } catch (e) {
      return link.url;
    }
  };

  return (
    <div className="meta-links" style={{ display: 'flex', gap: 10, flexWrap: 'wrap', marginTop: 14 }}>
      {links.map((link, idx) => (
        <div
          key={`${link.url}-${idx}`}
          className="meta-link"
          role="button"
          tabIndex={0}
          onClick={() => onPrimaryClick(link)}
          onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') onPrimaryClick(link); }}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 8,
            padding: '8px 12px',
            borderRadius: 8,
            border: '1px solid rgba(0,0,0,0.08)',
            cursor: 'pointer',
            minWidth: 140,
            background: 'var(--card-bg, #fff)',
            boxShadow: 'var(--card-shadow, 0 1px 2px rgba(0,0,0,0.04))',
          }}
          aria-label={`Meta link ${renderLabel(link)}`}
        >
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 14, fontWeight: 600 }}>{renderLabel(link)}</div>
            {link.info ? (
              <div style={{ fontSize: 12, color: 'rgba(0,0,0,0.6)' }}>{link.info}</div>
            ) : null}
          </div>

          <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
            <button
              type="button"
              aria-label={`Copy link ${renderLabel(link)}`}
              onClick={(e) => onCopyClick(e, link)}
              style={{ border: 'none', background: 'transparent', cursor: 'pointer', fontSize: 16 }}
            >
              📋
            </button>
            <button
              type="button"
              aria-label={`Open ${renderLabel(link)}`}
              onClick={(e) => { e.stopPropagation(); onPrimaryClick(link); }}
              style={{ border: 'none', background: 'transparent', cursor: 'pointer', fontSize: 16 }}
            >
              ↗
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}

MetaLinks.propTypes = {
  links: PropTypes.arrayOf(PropTypes.object),
  meta: PropTypes.object,
};
