type LibraryItemState = {
    lastWatched: string,
    timeWatched: number,
    timesWatched: number,
    flaggedWatched: number,
    overallTimeWatched: number,
    timeOffset: number,
    duration: number,
    video_id: string,
    watched: string,
    lastVidReleased: string,
    noNotif: boolean,
};

type LibraryItem = {
    _id: string,
    name: string,
    type: string,
    poster: string,
    posterShape: PosterShape,
    removed: number,
    temp: number,
    _ctime: string,
    _mtime: number,
    state: LibraryItemState,
    behaviorHints: BehaviorHints,
};

type LibraryItemDeepLinks = {
    metaDetailsVideos: string | null,
    metaDetailsStreams: string | null,
    player: string | null,
    externalPlayer: ExternalPlayerLinks | null,
};