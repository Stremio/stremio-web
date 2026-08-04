// Copyright (C) 2017-2026 Smart code 203358507

type DeepLinks = {
    metaDetailsVideos?: string | null,
    metaDetailsStreams?: string | null,
};

const getMetaDetailsHref = (deepLinks?: DeepLinks | null, videosFirst = false): string | null => {
    if (!deepLinks) {
        return null;
    }

    const primaryHref = videosFirst ? deepLinks.metaDetailsVideos : deepLinks.metaDetailsStreams;
    const fallbackHref = videosFirst ? deepLinks.metaDetailsStreams : deepLinks.metaDetailsVideos;

    return typeof primaryHref === 'string' ? primaryHref : typeof fallbackHref === 'string' ? fallbackHref : null;
};

export default getMetaDetailsHref;
