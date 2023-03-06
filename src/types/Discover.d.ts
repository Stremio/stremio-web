type DiscoverDeepLinks = {
    discover: string,
};

type Discover = {
    catalog: Catalog<Loadable<MetaItem[]>> | null,
    selectable: {
        catalogs: DiscoverCatalogOption<DiscoverDeepLinks>,
        extra: ExtraOption<DiscoverDeepLinks>[],
        types: TypeOption<DiscoverDeepLinks>[],
        nextPage: boolean,
    },
    selected: {
        request: ResourceRequest,
    } | null,
};