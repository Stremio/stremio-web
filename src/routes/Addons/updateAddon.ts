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
    dispatch: (msg: unknown) => void;
};

export async function updateAddonWithFreshManifest(
    core: { transport: CoreTransport },
    descriptor: AddonDescriptor
): Promise<void> {
    const response = await fetch(descriptor.transportUrl);
    if (!response.ok) {
        throw new Error(`Failed to fetch manifest: HTTP ${response.status}`);
    }
    const manifest: unknown = await response.json();
    core.transport.dispatch({
        action: 'Ctx',
        args: {
            action: 'UpgradeAddon',
            args: {
                transportUrl: descriptor.transportUrl,
                manifest,
                flags: descriptor.flags ?? {},
            },
        },
    });
}
