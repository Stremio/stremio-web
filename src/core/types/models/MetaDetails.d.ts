type MetaItemMetaDetails = MetaItem & {
    inLibrary: boolean,
    watched: boolean,
    deepLinks: MetaItemDeepLinks,
};

type MetaDetails = {
    metaItem: {
        addon: Addon,
        content: Loadable<MetaItemMetaDetails>,
    } | null,
    libraryItem: LibraryItem | null,
    selected: {
        metaPath: ResourceRequestPath,
        streamPath: ResourceRequestPath,
    } | null,
    streams: {
        addon: Addon,
        content: Loadable<Stream[]>
    }[],
    title: string | null,
    ratingInfo: Loadable<RatingInfo> | null,
};
