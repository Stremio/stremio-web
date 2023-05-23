type Link = {
    name: string,
    category: string,
    url: string,
};

type MetaItemPreview = {
    id: string,
    type: string,
    name: string,
    description: string | null,
    logo: string | null,
    background: string | null,
    poster: string | null,
    posterShape: PosterShape,
    releaseInfo: string | null,
    runtime: string | null,
    released: string | null,
    trailerStreams: TrailerStream[],
    links: Link[],
    behaviorHints: BehaviorHints,
};

type MetaItem = MetaItemPreview & {
    videos: Video[],
}

type MetaItemDeepLinks = {
    metaDetailsVideos: string | null,
    metaDetailsStreams: string | null,
    player: string | null,
};