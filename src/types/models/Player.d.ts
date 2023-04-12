type LibraryItemPlayer = Pick<LibraryItem, '_id'> & {
    state: Pick<LibraryItemState, 'timeOffset' | 'video_id'>,
};

type VideoPlayer = Video & {
    upcomming: boolean,
    watched: boolean,
    progress: boolean | null,
    scheduled: boolean,
    deepLinks: VideoDeepLinks,
};

type MetaItemPlayer = MetaItemPreview & {
    videos: VideoPlayer[],
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
    metaItem: Loadable<MetaItemPlayer> | null,
    nextVideo: VideoPlayer | null,
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