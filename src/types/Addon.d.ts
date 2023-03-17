type AddonManifest = {
    id: string,
    version: string,
    name: string,
    description: string,
    contactEmail: string,
    logo: string,
    background: string,
    types: string[],
};

type Addon = {
    installed: boolean,
    manifest: AddonManifest,
    transportUrl: string,
};

type AddonsDeepLinks = {
    addons: string,
};