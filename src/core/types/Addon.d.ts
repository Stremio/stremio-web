// Copyright (C) 2017-2026 Smart code 203358507

type AddonManifestCatalog = {
    type: string,
    id: string,
    name?: string,
};

type AddonManifest = {
    id: string,
    version: string,
    name: string,
    description: string,
    contactEmail: string,
    logo: string,
    background: string,
    types: string[],
    catalogs?: AddonManifestCatalog[],
    behaviorHints?: {
        epgProvider?: boolean,
        [key: string]: unknown,
    },
};

type Addon = {
    installed: boolean,
    manifest: AddonManifest,
    transportUrl: string,
};

type AddonsDeepLinks = {
    addons: string,
};
