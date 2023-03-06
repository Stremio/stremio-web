type InstalledAddons = {
    catalog: Addon[],
    selectable: {
        catalogs: CatalogOption<AddonsDeepLinks>[],
        types: TypeOption<AddonsDeepLinks>[],
    },
    selected: {
        request: {
            type: string,
        }
    } | null,
};