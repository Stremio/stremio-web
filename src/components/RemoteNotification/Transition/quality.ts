// Copyright (C) 2017-2026 Smart code 203358507

type Tier = 'sand' | 'wipe' | 'fade';

type Battery = { charging: boolean, level: number };

type Device = Navigator & {
    deviceMemory?: number,
    getBattery?: () => Promise<Battery>,
};

const SOFTWARE = /swiftshader|llvmpipe|softpipe|software|basic render/i;
const IDLE = 2000;
const device: Device = navigator;

const accelerated = () => {
    const gl = document.createElement('canvas').getContext('webgl', { failIfMajorPerformanceCaveat: true });
    if (gl === null) {
        return false;
    }

    const info = gl.getExtension('WEBGL_debug_renderer_info');
    const name = info !== null ? String(gl.getParameter(info.UNMASKED_RENDERER_WEBGL)) : '';
    gl.getExtension('WEBGL_lose_context')?.loseContext();
    return !SOFTWARE.test(name);
};

let weak: boolean | null = null;
let drained = false;

const probe = () => {
    weak = weak ?? (device.hardwareConcurrency <= 2 || (device.deviceMemory ?? 8) <= 2 || !accelerated());
    return weak;
};

if (typeof window.requestIdleCallback === 'function') {
    window.requestIdleCallback(probe, { timeout: IDLE });
} else {
    window.setTimeout(probe, IDLE);
}

device.getBattery?.().then((battery) => {
    drained = !battery.charging && battery.level <= 0.2;
}).catch(() => null);

const quality = (): Tier => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches || !CSS.supports('clip-path', 'path("M0 0H1V1Z")')) {
        return 'fade';
    }

    return probe() || drained ? 'wipe' : 'sand';
};

export type { Tier };

export default quality;
