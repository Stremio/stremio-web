// Copyright (C) 2017-2023 Smart code 203358507
// URL schemes aligned with stremio-core deep_links/mod.rs

const STREMIO_PLAYER_SUCCESS = 'stremio%3A%2F%2F%2Fplayer%3FexternalPlayerSuccess%3D1';
const STREMIO_PLAYER_ERROR = 'stremio%3A%2F%2F%2Fplayer%3FexternalPlayerSuccess%3D0';

/**
 * @param {string | null | undefined} streamingUrl HTTP stream from streaming server
 * @param {string} playerId
 * @param {{ playlist?: string | null }} [options]
 * @returns {string | null}
 */
const buildIosPlayerUrl = (streamingUrl, playerId, options = {}) => {
    if (playerId === 'stremio') {
        return null;
    }

    if (!streamingUrl || typeof streamingUrl !== 'string') {
        return playerId === 'm3u' && options.playlist ? options.playlist : null;
    }

    const urlEncoded = encodeURIComponent(streamingUrl);

    switch (playerId) {
        case 'vlc':
            return `vlc-x-callback://x-callback-url/stream?url=${urlEncoded}`;
        case 'outplayer':
            return streamingUrl.replace(/^https?:\/\//i, 'outplayer://');
        case 'infuse':
            return `infuse://x-callback-url/play?x-success=${STREMIO_PLAYER_SUCCESS}&x-error=${STREMIO_PLAYER_ERROR}&url=${urlEncoded}`;
        case 'vidhub':
            return `open-vidhub://x-callback-url/open?on-success=${STREMIO_PLAYER_SUCCESS}&on-failed=${STREMIO_PLAYER_ERROR}&url=${urlEncoded}`;
        case 'm3u':
            return options.playlist ?? null;
        default:
            return null;
    }
};

module.exports = buildIosPlayerUrl;
