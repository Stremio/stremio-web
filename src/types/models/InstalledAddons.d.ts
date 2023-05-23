type InstalledAddons = {
    catalog: Addon[],
    selectable: {
        catalogs: SelectableCatalog<AddonsDeepLinks>[],
        types: SelectableType<AddonsDeepLinks>[],
    },
    selected: {
        request: {
            type: string,
        }
    } | null,
};