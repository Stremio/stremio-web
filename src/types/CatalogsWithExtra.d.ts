type CatalogsWithExtra = {
    catalogs: Catalog<Loadable<MetaItem[]>, DiscoverDeepLinks>[] | null,
    selected: {
        type: string | null,
        extra: [string, string][]
    } | null,
};