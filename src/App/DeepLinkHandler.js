const React = require('react');
const { withCoreSuspender, useStreamingServer } = require('stremio/common');

const DeepLinkHandler = () => {
    const streamingServer = useStreamingServer();
    React.useEffect(() => {
        if (streamingServer.torrent && streamingServer.torrent[1].type === 'Ready') {
            const [_, deepLinks] = streamingServer.torrent[1].content;
            if (typeof deepLinks.metaDetailsVideos === 'string') {
                window.location = deepLinks.metaDetailsVideos;
            }
        }
    }, [streamingServer.torrent]);
    return null;
};

module.exports = withCoreSuspender(DeepLinkHandler);
