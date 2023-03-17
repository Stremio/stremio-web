type DiscoverDeepLinks = {
    discover: string,
};

interface MetaItemPreviewDiscover extends MetaItemPreview {
    inLibrary: boolean,
    deepLinks: MetaItemDeepLinks,
}

interface DiscoverCatalogOption<T> extends SelectableCatalog<T> {
    id: string,
    addon: Addon,
}

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