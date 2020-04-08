// Copyright (C) 2017-2020 Smart code 203358507

const { HTMLVideo, YouTubeVideo, MPVVideo, withStreamingServer } = require('stremio-video');

const selectVideoImplementation = (shell, stream) => {
    if (shell) {
        return MPVVideo;
    }

    if (stream) {
        if (typeof stream.url === 'string') {
            return HTMLVideo;
        } else if (typeof stream.ytId === 'string') {
            return YouTubeVideo;
        } else if (typeof stream.infoHash === 'string') {
            return withStreamingServer(HTMLVideo);
        }
    }

    return null;
};

module.exports = selectVideoImplementation;
