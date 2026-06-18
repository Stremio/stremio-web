import { DependencyList, useCallback, useEffect } from 'react';
import { ShortcutListener, ShortcutName, useShortcuts } from './Shortcuts';

const onShortcut = (name: ShortcutName, listener: ShortcutListener, deps: DependencyList, enabled = true) => {
    const shortcuts = useShortcuts();

    const listenerCallback = useCallback(listener, deps);

    useEffect(() => {
        if (!enabled) return;
        shortcuts.on(name, listenerCallback);
        return () => shortcuts.off(name, listenerCallback);
    }, [listenerCallback, enabled]);
};

export default onShortcut;
