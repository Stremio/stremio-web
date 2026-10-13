// Copyright (C) 2017-2026 Smart code 203358507

import { useCallback, useMemo } from 'react';
import { useCore } from 'stremio/core';
import { usePlatform, useProfile } from 'stremio/common';
import useToast from 'stremio/common/Toast/useToast';

type StreamHref = {
    href: string | null,
    target: '_blank' | undefined,
    download: string | undefined,
    external: boolean,
};

type Options = {
    videoId?: string | null,
    videoReleased?: string | null,
    canMarkWatched?: boolean,
    onPlay?: (stream: Stream) => void,
};

const useStreamPlay = (stream: Stream | null, { videoId, videoReleased, canMarkWatched, onPlay }: Options = {}) => {
    const core = useCore();
    const profile = useProfile();
    const platform = usePlatform();
    const toast = useToast();
    const deepLinks = stream?.deepLinks;

    const streamHref = useMemo((): StreamHref => {
        const externalPlayer = deepLinks?.externalPlayer;
        if (!deepLinks || !externalPlayer) {
            return { href: deepLinks?.player ?? null, target: undefined, download: undefined, external: false };
        }

        if (externalPlayer.web) {
            return { href: externalPlayer.web, target: '_blank', download: undefined, external: true };
        }

        if (externalPlayer.openPlayer) {
            const href = externalPlayer.openPlayer[platform.name as keyof OpenPlayerLinks] || externalPlayer.playlist;
            return {
                href: href ?? null,
                target: undefined,
                download: href !== null && href === externalPlayer.playlist ? externalPlayer.fileName ?? undefined : undefined,
                external: false,
            };
        }

        return { href: deepLinks.player, target: undefined, download: undefined, external: false };
    }, [deepLinks, platform.name]);

    const play = useCallback(() => {
        if (stream === null) {
            return;
        }

        if (profile.settings.playerType !== null) {
            if (profile.settings.playerType !== 'infuse' || !platform.shell.active || !canMarkWatched) {
                if (typeof videoId === 'string') {
                    core.transport.dispatch({
                        action: 'MetaDetails',
                        args: {
                            action: 'MarkVideoAsWatched',
                            args: [{ id: videoId, released: videoReleased }, true],
                        },
                    });
                }
            }

            core.transport.dispatch({
                action: 'MetaDetails',
                args: {
                    action: 'ExternalPlayerStreamOpened',
                    args: stream,
                },
            });
            toast.show({
                type: 'success',
                title: 'Stream opened in external player',
                timeout: 4000,
            });
        }

        core.transport.analytics({
            event: 'StreamClicked',
            args: { stream },
        });
        onPlay?.(stream);
    }, [core, profile.settings.playerType, platform.shell.active, canMarkWatched, videoId, videoReleased, stream, toast, onPlay]);

    return { ...streamHref, play };
};

export default useStreamPlay;
