import { DependencyList, useCallback, useEffect } from 'react';
import { ShortcutListener, ShortcutName, useShortcuts } from './Shortcuts';

const onShortcut = (name: ShortcutName, listener: ShortcutListener, deps: DependencyList) => {
    const shortcuts = useShortcuts();

    const listenerCallback = useCallback(listener, deps);

    useEffect(() => {
        shortcuts.on(name, listenerCallback);
        return () => shortcuts.off(name, listenerCallback);
    }, [listenerCallback]);
};

export default onShortcut;
