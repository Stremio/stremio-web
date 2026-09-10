// Copyright (C) 2017-2023 Smart code 203358507

const React = require('react');
const magnet = require('magnet-uri');
const { useCore } = require('stremio/core');
const useToast = require('stremio/common/Toast/useToast');
const useStreamingServer = require('stremio/common/useStreamingServer');

const CREATE_TORRENT_TIMEOUT = 20000;

const useTorrent = () => {
    const core = useCore();
    const streamingServer = useStreamingServer();
    const toast = useToast();
    const createTorrentTimeout = React.useRef(null);
    const parsingToastId = React.useRef(null);
    const createTorrent = React.useCallback((torrent) => {
        const isMagnet = typeof torrent === 'string';
        toast.remove(parsingToastId.current);
        parsingToastId.current = toast.show({
            type: 'success',
            title: isMagnet ? 'Loading magnet link…' : 'Loading torrent file…',
            timeout: CREATE_TORRENT_TIMEOUT
        });
        core.transport.dispatch({
            action: 'StreamingServer',
            args: {
                action: 'CreateTorrent',
                args: torrent
            }
        });
        clearTimeout(createTorrentTimeout.current);
        createTorrentTimeout.current = setTimeout(() => {
            toast.remove(parsingToastId.current);
            toast.show({
                type: 'error',
                title: isMagnet ? 'Failed to parse magnet link.' : 'Failed to parse torrent file.',
                timeout: 8000
            });
        }, CREATE_TORRENT_TIMEOUT);
    }, [core.transport, toast]);
    const createTorrentFromMagnet = React.useCallback((text) => {
        const parsed = magnet.decode(text);
        if (parsed && typeof parsed.infoHash === 'string') {
            createTorrent(text);
        }
    }, [createTorrent]);
    React.useEffect(() => {
        if (streamingServer.torrent !== null) {
            const [, { type }] = streamingServer.torrent;
            if (type === 'Ready' || type === 'Err') {
                clearTimeout(createTorrentTimeout.current);
                toast.remove(parsingToastId.current);
            }
        }
    }, [streamingServer.torrent, toast]);
    React.useEffect(() => {
        return () => clearTimeout(createTorrentTimeout.current);
    }, []);
    return {
        createTorrent,
        createTorrentFromMagnet
    };
};

module.exports = useTorrent;
