// Copyright (C) 2017-2026 Smart code 203358507

import { useEffect, useState } from 'react';

export type CatalogPreview = {
    background: string,
    logo: string | null,
    name: string,
    count: number,
};

type Meta = {
    id?: unknown,
    name?: unknown,
    logo?: unknown,
    background?: unknown,
};

const MANIFEST_PATH = '/manifest.json';
const PREVIEW_ITEMS_COUNT = 6;

const previews = new Map<string, Promise<CatalogPreview | null>>();

const toCatalogUrl = ({ base, path }: ResourceRequest): string | null => {
    if (!base.endsWith(MANIFEST_PATH)) {
        return null;
    }

    const resource = [path.resource, path.type, path.id].map(encodeURIComponent).join('/');
    return `${base.slice(0, -MANIFEST_PATH.length)}/${resource}.json`;
};

const toPreview = (metas: Meta[]): CatalogPreview | null => {
    const seen = new Set<unknown>();
    const withBackground = metas.filter((meta) => {
        if (typeof meta?.background !== 'string' || meta.background.length === 0 || seen.has(meta.id)) {
            return false;
        }

        seen.add(meta.id);
        return true;
    });
    const [first] = withBackground;
    if (!first) {
        return null;
    }

    return {
        background: first.background as string,
        logo: typeof first.logo === 'string' && first.logo.length > 0 ? first.logo : null,
        name: typeof first.name === 'string' ? first.name : '',
        count: Math.min(PREVIEW_ITEMS_COUNT, withBackground.length),
    };
};

const loadPreview = (url: string): Promise<CatalogPreview | null> => {
    const cached = previews.get(url);
    if (cached) {
        return cached;
    }

    const preview = fetch(url)
        .then((response) => response.ok ? response.json() : null)
        .then((body) => toPreview(Array.isArray(body?.metas) ? body.metas : []))
        .catch(() => null);
    previews.set(url, preview);
    return preview;
};

const useCatalogPreview = (request: ResourceRequest | null): CatalogPreview | null | undefined => {
    const url = request !== null ? toCatalogUrl(request) : null;
    const [preview, setPreview] = useState<CatalogPreview | null | undefined>(undefined);

    useEffect(() => {
        if (url === null) {
            setPreview(null);
            return;
        }

        let cancelled = false;
        setPreview(undefined);
        loadPreview(url).then((preview) => {
            if (!cancelled) {
                setPreview(preview);
            }
        });
        return () => {
            cancelled = true;
        };
    }, [url]);

    return preview;
};

export default useCatalogPreview;
