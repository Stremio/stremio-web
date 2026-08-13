import { useCallback } from 'react';
import { useNavigate } from 'react-router';
import magnet from 'magnet-uri';
import { useCore } from 'stremio/core';
import useToast from 'stremio/common/Toast/useToast';
import useTorrent from 'stremio/common/useTorrent';
import useStreamingServer from 'stremio/common/useStreamingServer';

const HTTP_REGEX = /^https?:\/\/.+/i;

const usePlayUrl = () => {
    const navigate = useNavigate();
    const core = useCore();
    const toast = useToast();
    const { createTorrentFromMagnet } = useTorrent();
    const streamingServer = useStreamingServer();

    const handlePlayUrl = useCallback(async (text: string): Promise<boolean> => {
        if (!text || !text.trim()) return false;
        const trimmed = text.trim();

        if (HTTP_REGEX.test(trimmed)) {
            toast.show({
                type: 'success',
                title: 'Loading HTTP stream…',
                timeout: 3000
            });
            try {
                const encoded = await core.transport.encodeStream({
                    name: '',
                    description: '',
                    url: trimmed,
                });
                if (typeof encoded === 'string') {
                    navigate(`/player/${encodeURIComponent(encoded)}`);
                    return true;
                }
            } catch (e) {
                console.error('Failed to encode stream:', e);
            }
            toast.show({
                type: 'error',
                title: 'Failed to load HTTP stream.',
                timeout: 5000
            });
            return false;
        }

        const parsed = magnet.decode(trimmed);
        if (parsed && typeof parsed.infoHash === 'string') {
            const serverReady = streamingServer.settings !== null
                && streamingServer.settings.type === 'Ready';
            if (!serverReady) {
                toast.show({
                    type: 'error',
                    title: 'Streaming server is not available. Cannot play magnet links.',
                    timeout: 5000
                });
                return false;
            }
            createTorrentFromMagnet(trimmed);
            return true;
        }

        return false;
    }, [streamingServer.settings, createTorrentFromMagnet]);

    return { handlePlayUrl };
};

export default usePlayUrl;
