// Copyright (C) 2017-2026 Smart code 203358507

import { useEffect, useMemo, useState } from 'react';

type Catalogs = CatalogsWithExtra['catalogs'];

type PeekContent = {
    background: string,
    logo: string | null,
    rows: string[][],
};

type Media = {
    peek: PeekContent | null,
    image: string | null,
};

const ROWS = 2;
const ROW_SIZE = 7;

const peekOf = (catalogs: Catalogs): PeekContent | null | undefined => {
    const loaded = (catalogs ?? []).filter(({ content }) => content?.type !== 'Err');
    const source = loaded[0]?.content;
    if (loaded.length === 0 || source?.type !== 'Ready') {
        return catalogs !== null && catalogs.length > 0 && loaded.length === 0 ? null : undefined;
    }

    const hero = source.content.find(({ background }) => typeof background === 'string' && background.length > 0);
    if (hero === undefined || typeof hero.background !== 'string') {
        return null;
    }

    return {
        background: hero.background,
        logo: hero.logo,
        rows: loaded.slice(0, ROWS).flatMap(({ content }) => content?.type === 'Ready' ? [
            content.content.flatMap(({ poster }) => typeof poster === 'string' && poster.length > 0 ? [poster] : []).slice(0, ROW_SIZE),
        ] : []),
    };
};

const useLoaded = (src: string | null) => {
    const [loaded, setLoaded] = useState<Record<string, boolean>>({});

    useEffect(() => {
        if (src === null) {
            return;
        }

        let active = true;
        const image = new Image();
        const settle = (ok: boolean) => () => {
            if (active) {
                setLoaded((loaded) => ({ ...loaded, [src]: ok }));
            }
        };
        image.src = src;
        image.decode().then(settle(true), settle(false));
        return () => {
            active = false;
        };
    }, [src]);

    return src !== null ? loaded[src] ?? null : false;
};

const useMedia = (notification: RemoteNotification | null, catalogs: Catalogs, live: boolean): Media | null => {
    const prompted = notification !== null;
    const peek = useMemo(() => prompted ? peekOf(catalogs) : null, [prompted, catalogs]);
    const background = useLoaded(peek?.background ?? null);
    const image = useLoaded(notification?.image ?? null);

    return useMemo(() => {
        if (notification === null || image === null || (live && (peek === undefined || background === null))) {
            return null;
        }

        return {
            peek: live && background && peek ? peek : null,
            image: image ? notification.image : null,
        };
    }, [notification, live, peek, background, image]);
};

export type { Catalogs, PeekContent, Media };

export default useMedia;
