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
        epgEndpoint?: string,
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
