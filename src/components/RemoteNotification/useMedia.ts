// Copyright (C) 2017-2026 Smart code 203358507

import { useEffect, useMemo, useState } from 'react';
import useTranslate from 'stremio/common/useTranslate';

type Catalogs = CatalogsWithExtra['catalogs'];

type Watching = { poster?: string | null }[];

type Shelf = {
    title: string | null,
    posters: string[],
};

type PeekContent = {
    background: string,
    logo: string | null,
    name: string,
    facts: string[],
    shelves: Shelf[],
};

type Media = {
    peek: PeekContent | null,
    image: string | null,
};

const SHELVES = 2;
const SHELF_SIZE = 8;
const FACTS = 3;
const PATIENCE = 2500;
const GENRES = 'Genres';

const filled = (value: unknown): value is string => typeof value === 'string' && value.length > 0;

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

const useMedia = (notification: RemoteNotification | null, catalogs: Catalogs, watching: Watching, live: boolean): Media | null => {
    const { catalogTitle, string } = useTranslate();
    const prompted = notification !== null;
    const [late, setLate] = useState(false);

    const peek = useMemo((): PeekContent | null | undefined => {
        if (!prompted || !live) {
            return null;
        }

        const loaded = (catalogs ?? []).filter(({ content }) => content?.type !== 'Err');
        const source = loaded[0]?.content;
        if (loaded.length === 0 || source?.type !== 'Ready') {
            return catalogs !== null && catalogs.length > 0 && loaded.length === 0 ? null : undefined;
        }

        const hero = source.content.find(({ background }) => filled(background));
        if (hero === undefined || !filled(hero.background)) {
            return null;
        }

        const resumed = watching.map(({ poster }) => poster).filter(filled);
        const rows = loaded.flatMap((catalog) => catalog.content?.type === 'Ready' ? [{
            title: catalogTitle(catalog) as string | null,
            posters: catalog.content.content.filter(({ id }) => id !== hero.id).map(({ poster }) => poster).filter(filled),
        }] : []);
        return {
            background: hero.background,
            logo: hero.logo,
            name: hero.name,
            facts: [hero.releaseInfo, hero.runtime, hero.links.find(({ category }) => category === GENRES)?.name].filter(filled).slice(0, FACTS),
            shelves: [
                ...(resumed.length > 0 ? [{ title: string('BOARD_CONTINUE_WATCHING') as string | null, posters: resumed }] : []),
                ...rows,
            ].slice(0, SHELVES).map(({ title, posters }) => ({ title, posters: posters.slice(0, SHELF_SIZE) })),
        };
    }, [prompted, live, catalogs, watching, catalogTitle, string]);

    const background = useLoaded(peek?.background ?? null);
    const image = useLoaded(notification?.image ?? null);

    useEffect(() => {
        if (!prompted) {
            return;
        }

        const timeout = window.setTimeout(() => setLate(true), PATIENCE);
        return () => {
            window.clearTimeout(timeout);
            setLate(false);
        };
    }, [prompted]);

    return useMemo(() => {
        const pending = image === null || (live && (peek === undefined || background === null));
        if (notification === null || (pending && !late)) {
            return null;
        }

        return {
            peek: background === true && peek ? peek : null,
            image: image === true ? notification.image : null,
        };
    }, [notification, live, late, peek, background, image]);
};

export type { Catalogs, Watching, Shelf, PeekContent, Media };

export default useMedia;
