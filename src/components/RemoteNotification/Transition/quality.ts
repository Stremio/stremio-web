// Copyright (C) 2017-2026 Smart code 203358507

type Tier = 'sand' | 'wipe' | 'fade';

type Battery = { charging: boolean, level: number };

type Device = Navigator & {
    deviceMemory?: number,
    getBattery?: () => Promise<Battery>,
};

const SOFTWARE = /swiftshader|llvmpipe|softpipe|software|basic render/i;
const device: Device = navigator;

const renderer = (attributes?: WebGLContextAttributes) => {
    const gl = document.createElement('canvas').getContext('webgl', attributes);
    if (gl === null) {
        return null;
    }

    const info = gl.getExtension('WEBGL_debug_renderer_info');
    const name = info !== null ? String(gl.getParameter(info.UNMASKED_RENDERER_WEBGL)) : '';
    gl.getExtension('WEBGL_lose_context')?.loseContext();
    return name;
};

const software = () => {
    const name = renderer();
    return name !== null && (SOFTWARE.test(name) || renderer({ failIfMajorPerformanceCaveat: true }) === null);
};

let weak = device.hardwareConcurrency <= 2 || (device.deviceMemory ?? 8) <= 2 || software();

device.getBattery?.().then((battery) => {
    weak = weak || (!battery.charging && battery.level <= 0.2);
}).catch(() => null);

const quality = (): Tier => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches || !CSS.supports('clip-path', 'path("M0 0H1V1Z")')) {
        return 'fade';
    }

    return weak ? 'wipe' : 'sand';
};

export type { Tier };

export default quality;
