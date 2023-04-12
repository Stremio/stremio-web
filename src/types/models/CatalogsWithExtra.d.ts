type MetaItemPreviewCatalogsWithExtra = MetaItemPreview & {
    deepLinks: MetaItemDeepLinks,
};

type CatalogsWithExtra = {
    catalogs: Catalog<Loadable<MetaItemPreviewCatalogsWithExtra[]>, DiscoverDeepLinks>[] | null,
    selected: {
        type: string | null,
        extra: [string, string][]
    } | null,
};