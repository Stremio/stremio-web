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
        error?: { type?: string; code?: number; message?: string };
        source?: {
            event?: string;
            args?: AddonUpgradedArgs;
        };
    };
};

export type UpdateAllFailureLine = {
    name: string;
    detail: string;
};

type SingleUpgradeOutcome =
    | { kind: 'updated' }
    | { kind: 'uptodate' }
    | { kind: 'protected_skip' }
    | { kind: 'failed'; detail: string };

function addonDisplayName(manifest: unknown, transportUrl: string): string {
    if (manifest !== null && typeof manifest === 'object' && 'name' in manifest) {
        const n = (manifest as { name: unknown }).name;
        if (typeof n === 'string' && n.trim().length > 0) {
            return n.trim();
        }
    }
    try {
        const u = new URL(transportUrl);
        return u.hostname || transportUrl;
    } catch {
        return transportUrl;
    }
}

function detailFromFetchError(err: unknown): string {
    if (err instanceof Error && err.message) {
        const m = err.message.match(/HTTP (\d+)/);
        return m ? m[1]! : err.message;
    }
    return String(err);
}

function detailFromCoreError(err: CoreEventPayload['args']['error'], errType: string | undefined, code: number): string {
    if (err && typeof err === 'object' && typeof err.message === 'string' && err.message.trim().length > 0) {
        return err.message.trim();
    }
    if (Number.isFinite(code) && code !== 0) {
        return String(code);
    }
    if (typeof errType === 'string' && errType.length > 0) {
        return errType;
    }
    return 'error';
}

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
): Promise<SingleUpgradeOutcome> {
    const target = normalizeTransportUrl(transportUrl);
    const targetId = addonManifestId;
    return new Promise((resolve) => {
        let settled = false;
        const finish = (outcome: SingleUpgradeOutcome) => {
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
                    finish({ kind: 'updated' });
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
                    finish({ kind: 'uptodate' });
                } else if (errType === 'Other' && code === 5) {
                    finish({ kind: 'protected_skip' });
                } else {
                    finish({
                        kind: 'failed',
                        detail: detailFromCoreError(args.error, errType, code),
                    });
                }
            }
        };

        const timer = setTimeout(() => finish({ kind: 'failed', detail: 'timeout' }), timeoutMs);
        core.transport.on('CoreEvent', handler);
    });
}

export type UpdateAllAddonsResult = {
    updated: number;
    upToDate: number;
    skippedProtected: number;
    failed: number;
    attempted: number;
    failures: UpdateAllFailureLine[];
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
        failures: [],
    };

    setBatchAddonUpdateEventsMuted(true);
    try {
        for (const descriptor of addons) {
            if (skip(descriptor)) {
                continue;
            }
            result.attempted += 1;
            const displayName = addonDisplayName(descriptor.manifest, descriptor.transportUrl);
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
                if (outcome.kind === 'updated') {
                    result.updated += 1;
                } else if (outcome.kind === 'uptodate') {
                    result.upToDate += 1;
                } else if (outcome.kind === 'protected_skip') {
                    result.skippedProtected += 1;
                } else if (outcome.kind === 'failed') {
                    result.failed += 1;
                    result.failures.push({ name: addonDisplayName(manifest, descriptor.transportUrl), detail: outcome.detail });
                }
            } catch (err: unknown) {
                result.failed += 1;
                result.failures.push({ name: displayName, detail: detailFromFetchError(err) });
            }
        }
    } finally {
        setBatchAddonUpdateEventsMuted(false);
    }

    return result;
}
