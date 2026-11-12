// Copyright (C) 2017-2026 Smart code 203358507

type BoardCatalogPreview = {
    background: string,
    logo: string | null,
    name: string,
    count: number,
};

type BoardCatalog = {
    id: string,
    name: string,
    type: string,
    addon: AddonPreview,
    request: ResourceRequest,
    selected: number | null,
    default: boolean,
    content: Loadable<BoardCatalogPreview | null> | null,
};

type BoardCatalogs = {
    selected: {
        all: boolean,
    } | null,
    catalogs: BoardCatalog[],
    spotlight: BoardCatalogPreview | null,
};
