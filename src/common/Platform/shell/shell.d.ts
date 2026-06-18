type WindowVisibility = {
    visible: boolean;
    visibility: number;
    isFullscreen: boolean;
};

type WindowState = {
    state: number;
};

type MediaStatus = {
    paused: boolean;
};

interface Shell {
    active: boolean,
    capabilities: ShellCapabilities,
    state: ShellState,
    on: (name: string, listener: (arg: any) => void) => void;
    off: (name: string, listener: (arg: any) => void) => void;
    send: (method: string, ...args: (string | number | object)[]) => void;
}

type ShellCapabilities = {
    gpuVideoProcessing: boolean;
};

type ShellState = {
    initialized: boolean;
    version: string | null;
    windowClosed: boolean;
    windowHidden: boolean;
};
