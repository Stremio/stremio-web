// Copyright (C) 2017-2026 Smart code 203358507

import { useSyncExternalStore } from 'react';

type BeforeInstallPromptEvent = Event & {
    prompt: () => Promise<void>,
};

let deferredPrompt: BeforeInstallPromptEvent | null = null;
const listeners = new Set<() => void>();

const setDeferredPrompt = (event: BeforeInstallPromptEvent | null) => {
    deferredPrompt = event;
    listeners.forEach((listener) => listener());
};

// registered at module load since the event can fire before any component mounts
window.addEventListener('beforeinstallprompt', (event) => setDeferredPrompt(event as BeforeInstallPromptEvent));

window.addEventListener('appinstalled', () => setDeferredPrompt(null));

const subscribe = (onStoreChange: () => void) => {
    listeners.add(onStoreChange);
    return () => {
        listeners.delete(onStoreChange);
    };
};

const getSnapshot = () => deferredPrompt;

const install = () => {
    deferredPrompt?.prompt().catch(console.error);
    // a prompt event can only be used once, the browser fires a new one if the user dismisses it
    setDeferredPrompt(null);
};

const useInstallPrompt = () => {
    const prompt = useSyncExternalStore(subscribe, getSnapshot);
    return prompt !== null ? install : null;
};

export default useInstallPrompt;
