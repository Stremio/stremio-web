// Copyright (C) 2017-2023 Smart code 203358507

const React = require('react');
const magnet = require('magnet-uri');
const { useServices } = require('stremio/services');
const useToast = require('stremio/common/Toast/useToast');
const useStreamingServer = require('stremio/common/useStreamingServer');

const useTorrent = () => {
    const { core } = useServices();
    const streamingServer = useStreamingServer();
    const toast = useToast();
    const createTorrentTimeout = React.useRef(null);
    const createTorrentFromMagnet = React.useCallback((text) => {
        const parsed = magnet.decode(text);
        if (parsed && typeof parsed.infoHash === 'string') {
            core.transport.dispatch({
                action: 'StreamingServer',
                args: {
                    action: 'CreateTorrent',
                    args: text
                }
            });
            clearTimeout(createTorrentTimeout.current);
            createTorrentTimeout.current = setTimeout(() => {
                toast.show({
                    type: 'error',
                    title: 'It\'s taking a long time to get metadata from the torrent.',
                    timeout: 10000
                });
            }, 10000);
        }
    }, []);
    React.useEffect(() => {
        if (streamingServer.torrent !== null) {
            const [, { type }] = streamingServer.torrent;
            if (type === 'Ready') {
                clearTimeout(createTorrentTimeout.current);
            }
        }
    }, [streamingServer.torrent]);
    React.useEffect(() => {
        return () => clearTimeout(createTorrentTimeout.current);
    }, []);
    return {
        createTorrentFromMagnet
    };
};

module.exports = useTorrent;
