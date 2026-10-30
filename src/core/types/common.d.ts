// Copyright (C) 2017-2026 Smart code 203358507

type UrlParams = Record<string, string> & {
    path: string,
};

type LoadableError = string | {
    type: string,
    content: {
        code: number,
        message: string,
    }
};

type Loadable<T> = {
    type: 'Loading',
} | {
    type: 'Ready',
    content: T,
} | {
    type: 'Err',
    content: LoadableError,
};

type ResourceRequestPath = {
    id: string,
    type: string,
    resource: string,
    extra: [string, string][]
};

type ResourceRequest = {
    base: string,
    path: ResourceRequestPath,
};

type OpenPlayerLinks = {
    ios: string | null,
    android: string | null,
    windows: string | null,
    macos: string | null,
    linux: string | null,
    tizen: string | null,
    webos: string | null,
    chromeos: string | null,
    roku: string | null,
    visionos?: string | null,
};

type ExternalPlayerLinks = {
    download: string | null,
    magnet: string | null,
    streaming: string | null,
    playlist: string | null,
    fileName: string | null,
    openPlayer: OpenPlayerLinks | null,
    web: string | null,
    androidTv: string | null,
    tizen: string | null,
    webos: string | null,
};

type TrailerStream = {
    ytId: string,
    description: string,
    deepLinks: {
        player: string,
        externalPlayer: ExternalPlayerLinks,
    },
};

type BehaviorHints = {
    defaultVideoId: string | null,
    featuredVideoId: string | null,
    hasScheduledVideos: boolean,
    isLive?: boolean,
};

type PosterShape = 'square' | 'landscape' | 'poster' | null;

type Catalog<T, D = any> = {
    label?: string,
    name?: string,
    type?: string,
    content: T,
    installed?: boolean,
    deepLinks?: D,
};

type AudioTrack = {
    id: string,
    label: string,
    lang: string,
    origin: string,
};

type Rating = 'liked' | 'loved' | null;

type RatingInfo = {
    metaId: string,
    status: Rating,
};
