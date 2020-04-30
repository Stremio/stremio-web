// Copyright (C) 2017-2020 Smart code 203358507

const { HTMLVideo, YouTubeVideo, MPVVideo, withStreamingServer, withHTMLSubtitles } = require('stremio-video');

const selectVideoImplementation = (shell, stream) => {
    // TODO handle stream.behaviorHints
    // TODO handle IFrameVideo
    // TODO handle ChromecastVideo

    if (shell) {
        return withHTMLSubtitles(withStreamingServer(MPVVideo));
    }

    if (stream) {
        if (typeof stream.ytId === 'string') {
            return withHTMLSubtitles(YouTubeVideo);
        } else if (typeof stream.url === 'string' || typeof stream.infoHash === 'string') {
            return withHTMLSubtitles(withStreamingServer(HTMLVideo));
        }
    }

    return null;
};

module.exports = selectVideoImplementation;
