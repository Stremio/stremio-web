type MetaItemPreviewCatalogsWithExtra = MetaItemPreview & {
    inLibrary: boolean,
    watched: boolean,
    deepLinks: MetaItemDeepLinks,
};

type CatalogWithExtra = {
    id: string,
    name: string,
    type: string,
    addon: AddonPreview,
    content: Loadable<MetaItemPreviewCatalogsWithExtra[]> | null,
    deepLinks: DiscoverDeepLinks,
};

type CatalogsWithExtra = {
    catalogs: CatalogWithExtra[] | null,
    spotlight: CatalogWithExtra | null,
    selected: {
        type: string | null,
        extra: [string, string][]
    } | null,
};
