// Copyright (C) 2017-2026 Smart code 203358507

import { useMemo } from 'react';
import { usePlatform } from 'stremio/common';

type StreamHref = {
    href: string | null,
    target: '_blank' | undefined,
    download: string | undefined,
    external: boolean,
};

const useStreamHref = (deepLinks: StreamDeepLinks | undefined): StreamHref => {
    const platform = usePlatform();

    return useMemo(() => {
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
};

export default useStreamHref;
