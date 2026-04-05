// Copyright (C) 2017-2023 Smart code 203358507

export type AddonDescriptorFlags = {
    official?: boolean;
    protected?: boolean;
};

export type AddonDescriptor = {
    transportUrl: string;
    manifest: unknown;
    flags?: AddonDescriptorFlags;
};

type CoreTransport = {
    dispatch: (msg: unknown) => void | Promise<unknown>;
    on: (event: string, handler: (payload: unknown) => void) => void;
    off: (event: string, handler: (payload: unknown) => void) => void;
};

export type CoreWithTransport = {
    transport: CoreTransport;
};

export async function fetchAddonManifest(transportUrl: string): Promise<unknown> {
    const response = await fetch(transportUrl);
    if (!response.ok) {
        throw new Error(`Failed to fetch manifest: HTTP ${response.status}`);
    }
    return response.json();
}

export async function dispatchAddonUpgrade(core: CoreWithTransport, descriptor: AddonDescriptor): Promise<void> {
    await core.transport.dispatch({
        action: 'Ctx',
        args: {
            action: 'UpgradeAddon',
            args: {
                transportUrl: descriptor.transportUrl,
                manifest: descriptor.manifest,
                flags: descriptor.flags ?? {},
            },
        },
    });
}

export async function updateAddonWithFreshManifest(
    core: CoreWithTransport,
    descriptor: AddonDescriptor
): Promise<void> {
    const manifest = await fetchAddonManifest(descriptor.transportUrl);
    await dispatchAddonUpgrade(core, { ...descriptor, manifest });
}
