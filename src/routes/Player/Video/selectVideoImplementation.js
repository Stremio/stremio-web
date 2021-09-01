// Copyright (C) 2017-2020 Smart code 203358507

const { ChromecastSenderVideo, HTMLVideo, YouTubeVideo, withStreamingServer, withHTMLSubtitles } = require('@stremio/stremio-video');

const selectVideoImplementation = (args) => {
    if (!args.stream || typeof args.stream.externalUrl === 'string') {
        return null;
    }

    if (args.chromecastTransport && args.chromecastTransport.getCastState() === cast.framework.CastState.CONNECTED) {
        return ChromecastSenderVideo;
    }

    if (typeof args.stream.ytId === 'string') {
        return withHTMLSubtitles(YouTubeVideo);
    }

    if (typeof args.stream.playerFrameUrl === 'string') {
        // TODO return IFrameVideo;
        return null;
    }

    if (typeof args.streamingServerURL === 'string') {
        return withStreamingServer(withHTMLSubtitles(HTMLVideo));
    }

    if (typeof args.stream.url === 'string') {
        return withHTMLSubtitles(HTMLVideo);
    }

    return null;
};

module.exports = selectVideoImplementation;
