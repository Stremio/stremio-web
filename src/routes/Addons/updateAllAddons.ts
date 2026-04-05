// Copyright (C) 2017-2023 Smart code 203358507

import { setBatchAddonUpdateEventsMuted } from '../../common/batchAddonUpdateMute';
import {
    dispatchAddonUpgrade,
    fetchAddonManifest,
    type AddonDescriptor,
    type CoreWithTransport,
} from './updateAddon';

type AddonUpgradedArgs = {
    transport_url?: string;
    transportUrl?: string;
    id?: string;
};

type CoreEventPayload = {
    event: string;
    args: AddonUpgradedArgs & {
        error?: { type?: string; code?: number };
        source?: {
            event?: string;
            args?: AddonUpgradedArgs;
        };
    };
};

function normalizeTransportUrl(url: string): string {
    return String(url || '').trim();
}

function sameAddonTransportUrl(a: string | undefined, b: string | undefined): boolean {
    const sa = normalizeTransportUrl(a ?? '');
    const sb = normalizeTransportUrl(b ?? '');
    if (sa === sb) {
        return true;
    }
    try {
        const ua = new URL(sa);
        const ub = new URL(sb);
        if (ua.origin !== ub.origin) {
            return false;
        }
        const pathA = (ua.pathname.replace(/\/+$/, '') || '/') + ua.search;
        const pathB = (ub.pathname.replace(/\/+$/, '') || '/') + ub.search;
        return pathA === pathB;
    } catch {
        return false;
    }
}

function addonIdFromManifest(manifest: unknown): string {
    if (manifest !== null && typeof manifest === 'object' && 'id' in manifest) {
        const id = (manifest as { id: unknown }).id;
        return typeof id === 'string' && id.length > 0 ? id : '';
    }
    return '';
}

function eventMatchesAddon(
    eventUrl: string | undefined,
    eventManifestId: string | undefined,
    targetUrl: string,
    targetAddonId: string
): boolean {
    if (targetAddonId.length > 0 && typeof eventManifestId === 'string' && eventManifestId === targetAddonId) {
        return true;
    }
    return sameAddonTransportUrl(eventUrl, targetUrl);
}

function waitForSingleAddonUpgradeOutcome(
    core: CoreWithTransport,
    transportUrl: string,
    addonManifestId: string,
    timeoutMs: number
): Promise<'updated' | 'uptodate' | 'protected_skip' | 'other_error'> {
    const target = normalizeTransportUrl(transportUrl);
    const targetId = addonManifestId;
    return new Promise((resolve) => {
        let settled = false;
        const finish = (outcome: 'updated' | 'uptodate' | 'protected_skip' | 'other_error') => {
            if (settled) {
                return;
            }
            settled = true;
            clearTimeout(timer);
            core.transport.off('CoreEvent', handler);
            resolve(outcome);
        };

        const handler = (raw: unknown) => {
            if (raw === null || typeof raw !== 'object' || !('event' in raw) || !('args' in raw)) {
                return;
            }
            const { event, args } = raw as CoreEventPayload;
            if (!args) {
                return;
            }

            const topEvent = typeof event === 'string' ? event : '';

            if (topEvent === 'AddonUpgraded') {
                const u = args.transport_url ?? args.transportUrl;
                const mid = args.id;
                if (eventMatchesAddon(u, mid, target, targetId)) {
                    finish('updated');
                }
                return;
            }

            if (topEvent === 'Error' && args.source && typeof args.source === 'object' && 'event' in args.source) {
                const srcEvent = (args.source as { event?: string }).event;
                if (srcEvent !== 'AddonUpgraded') {
                    return;
                }
                const src = (args.source as { args?: AddonUpgradedArgs }).args ?? {};
                const u = src.transport_url ?? src.transportUrl;
                const mid = src.id;
                if (!eventMatchesAddon(u, mid, target, targetId)) {
                    return;
                }
                const code = Number(args.error?.code);
                const errType = args.error?.type;
                if (errType === 'Other' && code === 3) {
                    finish('uptodate');
                } else if (errType === 'Other' && code === 5) {
                    finish('protected_skip');
                } else {
                    finish('other_error');
                }
            }
        };

        const timer = setTimeout(() => finish('other_error'), timeoutMs);
        core.transport.on('CoreEvent', handler);
    });
}

export type UpdateAllAddonsResult = {
    updated: number;
    upToDate: number;
    skippedProtected: number;
    failed: number;
    attempted: number;
};

const DEFAULT_TIMEOUT_MS = 25000;

export async function runUpdateAllInstalledAddons(
    core: CoreWithTransport,
    addons: AddonDescriptor[],
    options?: { timeoutMs?: number; skip?: (descriptor: AddonDescriptor) => boolean }
): Promise<UpdateAllAddonsResult> {
    const timeoutMs = options?.timeoutMs ?? DEFAULT_TIMEOUT_MS;
    const skip = options?.skip ?? (() => false);

    const result: UpdateAllAddonsResult = {
        updated: 0,
        upToDate: 0,
        skippedProtected: 0,
        failed: 0,
        attempted: 0,
    };

    setBatchAddonUpdateEventsMuted(true);
    try {
        for (const descriptor of addons) {
            if (skip(descriptor)) {
                continue;
            }
            result.attempted += 1;
            try {
                const manifest = await fetchAddonManifest(descriptor.transportUrl);
                const addonId = addonIdFromManifest(manifest);
                const outcomePromise = waitForSingleAddonUpgradeOutcome(
                    core,
                    descriptor.transportUrl,
                    addonId,
                    timeoutMs
                );
                await dispatchAddonUpgrade(core, { ...descriptor, manifest });
                const outcome = await outcomePromise;
                if (outcome === 'updated') {
                    result.updated += 1;
                } else if (outcome === 'uptodate') {
                    result.upToDate += 1;
                } else if (outcome === 'protected_skip') {
                    result.skippedProtected += 1;
                } else {
                    result.failed += 1;
                }
            } catch {
                result.failed += 1;
            }
        }
    } finally {
        setBatchAddonUpdateEventsMuted(false);
    }

    return result;
}
