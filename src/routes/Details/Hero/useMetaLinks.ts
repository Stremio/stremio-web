// Copyright (C) 2017-2026 Smart code 203358507

import { useMemo } from 'react';
import { CONSTANTS, routesRegexp } from 'stremio/common';

export type MetaLink = {
    label: string,
    href?: string,
};

export type MetaLinkGroup = {
    category: string,
    links: MetaLink[],
};

type MetaLinks = {
    groups: MetaLinkGroup[],
    imdb: MetaLink | null,
    share: MetaLink | null,
};

const ALLOWED_REDIRECTS: RegExp[] = [
    routesRegexp.search.regexp,
    routesRegexp.discover.regexp,
    routesRegexp.metadetails.regexp,
];

const toWarningHref = (url: string) => `https://www.stremio.com/warning#${encodeURIComponent(url)}`;

const parseUrl = (value: string): URL | null => {
    try {
        return new URL(value);
    } catch {
        return null;
    }
};

const useMetaLinks = (links: Link[] | null | undefined): MetaLinks => {
    return useMemo(() => {
        const groups = new Map<string, MetaLink[]>();
        let imdb: MetaLink | null = null;
        let share: MetaLink | null = null;

        const push = (category: string, link: MetaLink) => {
            const group = groups.get(category) ?? [];
            group.push(link);
            groups.set(category, group);
        };

        (links ?? []).forEach((link) => {
            if (!link || typeof link.category !== 'string' || typeof link.url !== 'string') {
                return;
            }

            const url = parseUrl(link.url);
            if (url === null) {
                return;
            }

            if (link.category === CONSTANTS.IMDB_LINK_CATEGORY) {
                if (url.hostname === 'imdb.com') {
                    imdb = { label: link.name, href: toWarningHref(link.url) };
                }
            } else if (link.category === CONSTANTS.SHARE_LINK_CATEGORY) {
                share = { label: link.name, href: link.url };
            } else if (url.protocol === CONSTANTS.PROTOCOL) {
                if (ALLOWED_REDIRECTS.some((regexp) => regexp.test(url.pathname))) {
                    push(link.category, { label: link.name, href: `#${url.pathname}${url.search}` });
                }
            } else if (url.hostname.length > 0) {
                push(link.category, { label: link.name, href: toWarningHref(link.url) });
            }
        });

        return {
            groups: Array.from(groups, ([category, links]) => ({ category, links }))
                .filter(({ category }) => category !== CONSTANTS.WRITERS_LINK_CATEGORY),
            imdb,
            share,
        };
    }, [links]);
};

export default useMetaLinks;
