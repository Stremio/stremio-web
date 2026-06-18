type LibraryItemPlayer = Pick<LibraryItem, '_id'> & {
    state: Pick<LibraryItemState, 'timeOffset' | 'video_id'>,
};

type VideoPlayer = Video & {
    upcoming: boolean,
    watched: boolean,
    scheduled: boolean,
    deepLinks: VideoDeepLinks,
};

type MetaItemPlayer = MetaItemPreview & {
    videos: VideoPlayer[],
};

type SelectedStream = Stream & {
    deepLinks: StreamDeepLinks,
    subtitles?: Subtitle[],
};

type Subtitle = {
    id: string,
    lang: string,
    origin?: string,
    url?: string | null,
    fallbackUrl?: string | null,
    label?: string | null,
};

type SeriesInfo = {
    episode: number,
    season: number,
};

type SubtitlesTrackState = {
    id: string,
    embedded: boolean,
    lang?: string,
};

type AudioTrackState = {
    id: string,
};

type StreamState = {
    subtitleTrack?: SubtitlesTrackState | null,
    subtitleDelay?: number,
    subtitleSize?: number,
    subtitleOffset?: number,
    audioTrack?: AudioTrackState,
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
    seriesInfo: SeriesInfo | null,
    streamState: StreamState | null,
    subtitles: Subtitle[],
    title: string | null,
};
