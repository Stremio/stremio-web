type RemoteAddons = {
    catalog: Catalog<Loadable<Addon[]>>,
    selectable: {
        catalogs: CatalogOption<AddonsDeepLinks>[],
        types: TypeOption<AddonsDeepLinks>[],
    },
    selected: {
        request: ResourceRequest,
    } | null,
};