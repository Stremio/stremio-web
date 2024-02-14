type LibraryItemPlayer = Pick<LibraryItem, '_id'> & {
    state: Pick<LibraryItemState, 'timeOffset' | 'video_id'>,
};

type PlayerVideo = Video & {
    upcomming: boolean,
    watched: boolean,
    progress: boolean | null,
    scheduled: boolean,
    deepLinks: VideoDeepLinks,
};

type PlayerMetaItem = MetaItemPreview & {
    videos: PlayerVideo[],
};

type SelectedStream = Stream & {
    deepLinks: StreamDeepLinks,
};

type Subtitle = {
    id: string,
    lang: string,
    origin: string,
    url: string,
};

type Player = {
    addon: Addon | null,
    libraryItem: LibraryItemPlayer | null,
    metaItem: Loadable<PlayerMetaItem> | null,
    nextVideo: PlayerVideo | null,
    selected: {
        stream: SelectedStream,
        metaRequest: ResourceRequest,
        streamRequest: ResourceRequest,
        subtitlesPath: ResourceRequestPath,
    } | null,
    seriesInfo: {
        season: number,
        episode: number,
    } | null,
    subtitles: Subtitle[],
    title: string | null,
};