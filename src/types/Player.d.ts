type Player = {
    addon: Addon | null,
    libraryItem: LibraryItem | null,
    metaItem: Loadable<MetaItem> | null,
    nextVideo: Video | null,
    selected: {
        stream: Stream,
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