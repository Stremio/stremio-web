// Copyright (C) 2017-2026 Smart code 203358507

import { createContext } from 'react';

export type FullscreenContextValue = readonly [
    fullscreen: boolean,
    requestFullscreen: () => Promise<void> | void,
    exitFullscreen: () => void,
    toggleFullscreen: () => void,
    supported: boolean,
    setVideoElement: (el: HTMLVideoElement | null) => void,
];

const FullscreenContext = createContext<FullscreenContextValue | null>(null);

FullscreenContext.displayName = 'FullscreenContext';

export default FullscreenContext;
