import React, { createContext, useCallback, useContext, useEffect } from 'react';
import shortcuts from './shortcuts.json';

const SHORTCUTS = shortcuts.map(({ shortcuts }) => shortcuts).flat();

export type ShortcutName = string;
export type ShortcutListener = () => void;

interface ShortcutsContext {
    grouped: ShortcutGroup[],
}

const ShortcutsContext = createContext<ShortcutsContext>({} as ShortcutsContext);

type Props = {
    children: JSX.Element,
    onShortcut: (name: ShortcutName) => void,
};

const ShortcutsProvider = ({ children, onShortcut }: Props) => {
    const onKeyDown = useCallback(({ ctrlKey, shiftKey, key }: KeyboardEvent) => {
        SHORTCUTS.forEach(({ name, combos }) => combos.forEach((keys) => {
            const modifers = (keys.includes('Ctrl') ? ctrlKey : true)
                && (keys.includes('Shift') ? shiftKey : true);

            if (modifers && keys.includes(key.toUpperCase())) {
                onShortcut(name as ShortcutName);
            }
        }));
    }, [onShortcut]);

    useEffect(() => {
        document.addEventListener('keydown', onKeyDown);

        return () => {
            document.removeEventListener('keydown', onKeyDown);
        };
    }, [onKeyDown]);

    return (
        <ShortcutsContext.Provider value={{ grouped: shortcuts }}>
            {children}
        </ShortcutsContext.Provider>
    );
};

const useShortcuts = () => {
    return useContext(ShortcutsContext);
};

export {
    ShortcutsProvider,
    useShortcuts
};
