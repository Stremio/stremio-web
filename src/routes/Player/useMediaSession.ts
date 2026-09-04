import { useEffect } from 'react';
import { usePlatform } from 'stremio/common';

const useMediaSession = (
    videoState: VideoState,
    player: Player,
    fullscreen: boolean,
    onPlayRequested: () => void,
    onPauseRequested: () => void,
    onNextVideoRequested: () => void,
) => {
    const { shell } = usePlatform();

    useEffect(() => {
        if (!('audioSession' in navigator)) return;
        const audioSession = (navigator as any).audioSession;
        audioSession.type = fullscreen ? 'ambient' : 'playback';
        return () => {
            audioSession.type = 'playback';
        };
    }, [fullscreen]);

    // Playback state
    useEffect(() => {
        if (navigator.mediaSession) {
            const playbackState = videoState.paused === null ? 'none' : videoState.paused ? 'paused' : 'playing';
            navigator.mediaSession.playbackState = playbackState;
        }

        if (shell.active) {
            shell.send('media.status', {
                paused: !!videoState.paused,
            });
        }

        return () => {
            if (navigator.mediaSession) {
                navigator.mediaSession.playbackState = 'none';
            }
        };
    }, [videoState.paused]);

    // Metadata
    useEffect(() => {
        const metaItem = player.metaItem && player.metaItem?.type === 'Ready' ? player.metaItem.content as MetaItemPlayer : null;
        const videoId = player.selected ? player.selected?.streamRequest?.path?.id : null;
        const video = metaItem?.videos.find(({ id }) => id === videoId);

        const videoInfo = video?.season && video?.episode ? ` (${video.season}x${video.episode})` : null;
        const videoTitle = video ? `${video.title}${videoInfo}` : null;
        const metaTitle = metaItem ? metaItem.name : null;
        const imageUrl = metaItem ? metaItem.logo : null;

        const title = videoTitle ?? metaTitle;
        const artist = (videoTitle && metaTitle) ?? undefined;
        const artwork = imageUrl ? [{ src: imageUrl }] : undefined;

        if (title) {
            if (navigator.mediaSession) {
                navigator.mediaSession.metadata = new MediaMetadata({
                    title,
                    artist,
                    artwork,
                });
            }

            if (shell.active) {
                shell.send('media.metadata', {
                    title,
                    artist,
                    artUrl: imageUrl,
                });
            }
        }
    }, [player.metaItem, player.selected]);

    // Callbacks
    useEffect(() => {
        const mediaSession = navigator.mediaSession;
        if (!mediaSession) return;

        mediaSession.setActionHandler('play', onPlayRequested);
        mediaSession.setActionHandler('pause', onPauseRequested);
        mediaSession.setActionHandler('nexttrack', player.nextVideo ? onNextVideoRequested : null);

        return () => {
            mediaSession.setActionHandler('play', null);
            mediaSession.setActionHandler('pause', null);
            mediaSession.setActionHandler('nexttrack', null);
        };
    }, [player.nextVideo, onPlayRequested, onPauseRequested, onNextVideoRequested]);

    useEffect(() => {
        const onMediaStatus = ({ paused }: MediaStatus) => {
            paused ? onPauseRequested() : onPlayRequested();
        };

        shell.on('media.status', onMediaStatus);

        return () => {
            shell.off('media.status', onMediaStatus);
        };
    }, [shell, onPlayRequested, onPauseRequested]);
};

export default useMediaSession;
