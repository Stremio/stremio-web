type RemoteAddons = {
    catalog: Catalog<Loadable<Addon[]>>,
    selectable: {
        catalogs: SelectableCatalog<AddonsDeepLinks>[],
        types: SelectableType<AddonsDeepLinks>[],
    },
    selected: {
        request: ResourceRequest,
    } | null,
};