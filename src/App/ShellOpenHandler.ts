import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router';
import { CONSTANTS, onFileDrop, usePlatform, withCoreSuspender } from 'stremio/common';
import useStreamingServer from 'stremio/common/useStreamingServer';
import useToast from 'stremio/common/Toast/useToast';
import useTorrent from 'stremio/common/useTorrent';

const MAX_TORRENT_SIZE = 16 * 1024 * 1024;
const MAX_ENCODED_TORRENT_SIZE = 4 * Math.ceil(MAX_TORRENT_SIZE / 3);

type TorrentFile = {
    name: string;
    data: string;
};

const ShellOpenHandler = () => {
    const { shell } = usePlatform();
    const { on, off, send, state: { initialized } } = shell;
    const navigate = useNavigate();
    const toast = useToast();
    const streamingServer = useStreamingServer();
    const { createTorrent } = useTorrent();
    const [pendingTorrent, setPendingTorrent] = useState<string | number[] | null>(null);

    onFileDrop(['application/x-bittorrent'], (_file: File, buffer: ArrayBuffer) => {
        if (buffer.byteLength === 0 || buffer.byteLength > MAX_TORRENT_SIZE) {
            toast.show({ type: 'error', title: 'Torrent file must be between 1 byte and 16 MiB.', timeout: 5000 });
            return;
        }
        setPendingTorrent(Array.from(new Uint8Array(buffer)));
    });

    useEffect(() => {
        const onOpenError = (message: string) => {
            toast.show({ type: 'error', title: message, timeout: 5000 });
        };
        const onOpenMedia = (input: string) => {
            try {
                const { protocol, hostname, pathname, searchParams } = new URL(input);
                if (protocol === CONSTANTS.PROTOCOL) {
                    setPendingTorrent(null);
                    if (hostname.length) {
                        const transportUrl = `https://${hostname}${pathname}`;
                        navigate(`/addons?addon=${encodeURIComponent(transportUrl)}`);
                    } else {
                        navigate(`${pathname}?${searchParams.toString()}`);
                    }
                } else if (protocol === 'magnet:') {
                    setPendingTorrent(input);
                } else {
                    onOpenError('Unsupported media link.');
                }
            } catch (_) {
                onOpenError('Invalid media link.');
            }
        };
        const onOpenTorrent = (file: TorrentFile) => {
            try {
                if (typeof file?.name !== 'string' || !file.name.toLowerCase().endsWith('.torrent')
                    || typeof file.data !== 'string' || file.data.length > MAX_ENCODED_TORRENT_SIZE) {
                    throw new Error('Invalid torrent file.');
                }
                const data = atob(file.data);
                if (data.length === 0 || data.length > MAX_TORRENT_SIZE) {
                    throw new Error('Invalid torrent file size.');
                }
                setPendingTorrent(Array.from(data, (byte) => byte.charCodeAt(0)));
            } catch (_) {
                onOpenError('Failed to open torrent file.');
            }
        };

        on('open-media', onOpenMedia);
        on('open-torrent', onOpenTorrent);
        on('open-error', onOpenError);
        return () => {
            off('open-media', onOpenMedia);
            off('open-torrent', onOpenTorrent);
            off('open-error', onOpenError);
        };
    }, [on, off, navigate, toast]);

    useEffect(() => {
        if (initialized) {
            send('app-ready');
        }
    }, [initialized, send]);

    useEffect(() => {
        if (pendingTorrent === null || streamingServer.settings === null
            || streamingServer.settings.type === 'Loading') {
            return;
        }
        setPendingTorrent(null);
        if (streamingServer.settings.type === 'Ready') {
            createTorrent(pendingTorrent);
        } else {
            toast.show({
                type: 'error',
                title: 'Streaming server is not available. Cannot open torrent.',
                timeout: 5000,
            });
        }
    }, [pendingTorrent, streamingServer.settings, createTorrent, toast]);

    return null;
};

export default withCoreSuspender(ShellOpenHandler);
