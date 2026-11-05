type MetaItemPreviewCatalogsWithExtra = MetaItemPreview & {
    inLibrary: boolean,
    watched: boolean,
    deepLinks: MetaItemDeepLinks,
};

type CatalogAddonPreview = {
    manifest: {
        id: string,
        name: string,
    },
};

type SpotlightCatalog = Catalog<Loadable<MetaItemPreviewCatalogsWithExtra[]>, DiscoverDeepLinks> & {
    id: string,
    name: string,
    type: string,
    addon: CatalogAddonPreview,
};

type CatalogsWithExtra = {
    catalogs: Catalog<Loadable<MetaItemPreviewCatalogsWithExtra[]>, DiscoverDeepLinks>[] | null,
    spotlight: SpotlightCatalog | null,
    selected: {
        type: string | null,
        extra: [string, string][]
    } | null,
};
