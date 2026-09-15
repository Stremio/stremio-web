// Copyright (C) 2017-2023 Smart code 203358507

const React = require('react');
const { useLocation, useNavigate } = require('react-router');
const { withCoreSuspender, useStreamingServer } = require('stremio/common');
const { navigateToRoute, toPath } = require('stremio-router');

const DeepLinkHandler = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const streamingServer = useStreamingServer();
    const locationRef = React.useRef(location);
    locationRef.current = location;
    const previousTorrentRef = React.useRef(null);
    React.useEffect(() => {
        if (previousTorrentRef.current === streamingServer.torrent) {
            return;
        }
        previousTorrentRef.current = streamingServer.torrent;
        if (streamingServer.torrent !== null) {
            const [, { type, content }] = streamingServer.torrent;
            if (type === 'Ready') {
                const [, deepLinks] = content;
                if (typeof deepLinks.metaDetailsVideos === 'string') {
                    const path = toPath(deepLinks.metaDetailsVideos);
                    navigateToRoute(navigate, locationRef.current, path);
                }
            }
        }
    }, [streamingServer.torrent, navigate]);
    return null;
};

module.exports = withCoreSuspender(DeepLinkHandler);
