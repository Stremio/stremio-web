// Copyright (C) 2017-2023 Smart code 203358507

const React = require('react');
const { withCoreSuspender, useStreamingServer } = require('stremio/common');

const DeepLinkHandler = () => {
    const streamingServer = useStreamingServer();
    React.useEffect(() => {
        if (streamingServer.torrent !== null) {
            const [, { type, content }] = streamingServer.torrent;
            if (type === 'Ready') {
                const [, deepLinks] = content;
                if (typeof deepLinks.metaDetailsVideos === 'string') {
                    window.location = deepLinks.metaDetailsVideos;
                }
            }
        }
    }, [streamingServer.torrent]);
    return null;
};

module.exports = withCoreSuspender(DeepLinkHandler);
