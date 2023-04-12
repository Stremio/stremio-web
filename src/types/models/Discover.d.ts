type DiscoverDeepLinks = {
    discover: string,
};

type MetaItemPreviewDiscover = MetaItemPreview & {
    inLibrary: boolean,
    deepLinks: MetaItemDeepLinks,
};

type DiscoverCatalogOption<T> = SelectableCatalog<T> & {
    id: string,
    addon: Addon,
};

type Discover = {
    catalog: Catalog<Loadable<MetaItemPreviewDiscover[]>> | null,
    selectable: {
        catalogs: DiscoverCatalogOption<DiscoverDeepLinks>,
        extra: SelectableExtra<DiscoverDeepLinks>[],
        types: SelectableType<DiscoverDeepLinks>[],
        nextPage: boolean,
    },
    selected: {
        request: ResourceRequest,
    } | null,
};