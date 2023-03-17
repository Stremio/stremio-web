interface MetaItemMetaDetails extends MetaItem {
    inLibrary: boolean,
    watched: boolean,
    deepLinks: MetaItemDeepLinks,
}

type MetaDetails = {
    metaExtensions: {
        url: string,
        name: string,
        addon: Addon,
    }[],
    metaItem: {
        addon: Addon,
        content: Loadable<MetaItemMetaDetails>,
    } | null,
    selected: {
        metaPath: ResourceRequestPath,
        streamPath: ResourceRequestPath,
    } | null,
    streams: {
        addon: Addon,
        content: Loadable<Stream[]>
    }[],
    title: string | null,
};