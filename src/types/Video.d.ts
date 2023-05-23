type VideoDeepLinks = {
    metaDetailsStreams: string,
    player: string | null,
    externalPlayer: ExternalPlayerLinks | null,
};

type Video = {
    id: string,
    title: string,
    overview: string | null,
    released: string | null,
    thumbnail: string | null,
    season?: number,
    episode?: number,
    streams: Stream[],
    trailerStreams: TrailerStream[],
};