// Copyright (C) 2017-2026 Smart code 203358507

type LiveTvGuideDeepLinks = {
    liveTvGuide: string,
};

type LiveTvGuideShow = {
    id: string,
    title: string,
    released: string | null,
    overview: string | null,
    thumbnail: string | null,
    startTime?: string,
    endTime?: string,
    runtime?: string | null,
    releaseInfo?: string | null,
    genres?: string[],
    cast?: string[],
    directors?: string[],
    links?: Link[],
    deepLinks: VideoDeepLinks,
};

type LiveTvGuideChannel = {
    channel: MetaItemPreview,
    deepLinks: MetaItemDeepLinks,
    shows: LiveTvGuideShow[],
};

type LiveTvGuideSelectableCatalog = {
    catalog: string,
    addonName: string,
    selected: boolean,
    deepLinks: LiveTvGuideDeepLinks,
};

type LiveTvGuideSelectableDate = {
    date: string,
    deepLinks: LiveTvGuideDeepLinks,
};

type LiveTvGuide = {
    selected: {
        request: ResourceRequest | null,
        date: string | null,
        utcOffset: number,
    } | null,
    selectable: {
        catalogs: LiveTvGuideSelectableCatalog[],
        prevDate: LiveTvGuideSelectableDate | null,
        nextDate: LiveTvGuideSelectableDate | null,
        today: string | null,
        nextPage: {
            request: ResourceRequest,
        } | null,
    },
    catalog: Loadable<void>[],
    channels: LiveTvGuideChannel[],
};
