interface UrlParams extends Record<string, string> {
    path: string,
}

type LoadableError = string | {
    type: string,
    content: {
        code: number,
        message: string,
    }
};

type Loadable<T> = {
    type: 'Ready' | 'Loading' | 'Err',
    content: T | LoadableError,
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

type ExternalPlayerDeepLinks = {
    androidTv: string | null,
    download: string | null,
    fileName: string | null,
    href: string | null,
    tizen: string | null,
    webos: string | null,
};

type AddonsDeepLinks = {
    addons: string,
};

type Torrent = [
    {
        extra: any[],
        id: string,
        resource: string,
        type: string,
    },
    {
        metaDetailsStreams: string | null,
        metaDetailsVideos: string | null,
        player: string | null,
    }
];

type Subtitle = {
    id: string,
    lang: string,
    origin: string,
    url: string,
};

type Addon = {
    installed: boolean,
    manifest: {
        id: string,
        types: string[],
        name: string,
        description: string,
        version: string,
        logo: string | null,
        background: string | null,
    },
    transportUrl: string,
};

type Stream = {
    ytId?: string,
    name: string,
    description: string,
    infoHash?: string,
    fileIdx?: string,
    externalUrl?: string,
    deepLinks: {
        player: string,
        externalPlayer: ExternalPlayerDeepLinks,
    },
};

type TrailerStream = {
    ytId: string,
    description: string,
    deepLinks: {
        player: string,
        externalPlayer: ExternalPlayerDeepLinks,
    },
};

type Video = {
    id: string,
    title: string,
    overview: string,
    released: string,
    thumbnail: string,
    season?: number,
    episode?: number,
    watched: boolean,
    deepLinks: {
        externalPlayer: ExternalPlayerDeepLinks | null,
        metaDetailsStreams: string | null,
        player: string | null,
    }
};

type Link = {
    name: string,
    category: string,
    url: string,
};

type Item = {
    type: string,
    name: string,
    poster: string,
    posterShape: string,
};

interface LibraryItem extends Item {
    _id: string,
    progress: number,
    state: {
        timeOffset: number,
        video_id: string,
    },
}

interface MetaItem extends Item {
    id: string,
    description: string,
    logo: string,
    background: string,
    releaseInfo: string,
    released: string,
    runtime: string,
    videos: Video[],
    trailerStreams: TrailerStream[],
    links: Link[],
    inLibrary: boolean,
    watched: boolean,
    deepLinks: {
        metaDetailsStreams: string | null,
        metaDetailsVideos: string | null,
        player: string | null,
    }
}

type Catalog<T, D = any> = {
    title?: string,
    content: T,
    installed?: boolean,
    deepLinks?: D,
};

type TypeOption<T> = {
    type: string,
    selected: boolean,
    deepLinks: T
};

type SortOption<T> = {
    sort: string,
    selected: boolean,
    deepLinks: T
};

type ExtraOption<T> = {
    isRequired: boolean,
    name: string,
    options: {
        deepLinks: T,
        selected: boolean,
        value: string | null,
    }
};

type CatalogOption<T> = {
    name: string,
    selected: boolean,
    deepLinks: T,
};

interface DiscoverCatalogOption<T> extends CatalogOption<T> {
    id: string,
    addon: Addon,
}

interface AddonCatalogOption<T> extends CatalogOption<T> {
    id?: string,
}