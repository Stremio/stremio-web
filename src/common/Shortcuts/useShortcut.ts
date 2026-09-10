import { useEffect } from 'react';
import { ShortcutListener, ShortcutName, useShortcuts } from './Shortcuts';

const useShortcut = (name: ShortcutName, listener: ShortcutListener, enabled = true) => {
    const { on, off } = useShortcuts();

    useEffect(() => {
        if (!enabled) return;
        on(name, listener);
        return () => off(name, listener);
    }, [name, listener, enabled, on, off]);
};

export default useShortcut;
