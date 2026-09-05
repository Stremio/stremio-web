import React, { createContext, useCallback, useContext, useEffect, useRef } from 'react';
import { getKeyboardShortcutKey, getKeyboardShortcutKeys } from './keyboard';
import shortcuts from './shortcuts.json';

const SHORTCUTS = shortcuts.map(({ shortcuts }) => shortcuts).flat();

export type ShortcutName = string;
export type ShortcutListener = (combo: number, key: string, heldForMs: number) => void;

interface ShortcutsContext {
    grouped: ShortcutGroup[],
    on: (name: ShortcutName, listener: ShortcutListener) => void,
    off: (name: ShortcutName, listener: ShortcutListener) => void,
}

const ShortcutsContext = createContext<ShortcutsContext>({} as ShortcutsContext);

type Props = {
    children: JSX.Element,
    onShortcut: (name: ShortcutName, combo: number, key: string, heldForMs: number) => void,
};

const REPEAT_THROTTLE_MS = 130;

const isInputFocused = () => {
    const inputElements = ['INPUT', 'TEXTAREA', 'SELECT'];
    const activeElement = document.activeElement;

    return activeElement instanceof HTMLElement &&
        (inputElements.includes(activeElement.tagName) || activeElement.isContentEditable);
};

const ShortcutsProvider = ({ children, onShortcut }: Props) => {
    const listeners = useRef<Map<ShortcutName, Set<ShortcutListener>>>(new Map());
    const lastRepeatTime = useRef<Map<string, number>>(new Map());
    const keyDownAt = useRef<Map<string, number>>(new Map());

    const onKeyDown = useCallback((event: KeyboardEvent) => {
        const { ctrlKey, shiftKey, altKey, metaKey, key, repeat } = event;
        if (isInputFocused()) return;

        const shortcutKeys = getKeyboardShortcutKeys(event);
        const repeatKey = getKeyboardShortcutKey(event);
        const now = Date.now();
        if (!repeat) {
            keyDownAt.current.set(repeatKey, now);
        }
        if (repeat) {
            if (!keyDownAt.current.has(repeatKey)) return;
            const last = lastRepeatTime.current.get(repeatKey) ?? 0;
            if (now - last < REPEAT_THROTTLE_MS) return;
            lastRepeatTime.current.set(repeatKey, now);
        }
        const heldForMs = repeat ? now - keyDownAt.current.get(repeatKey)! : 0;

        SHORTCUTS.forEach(({ name, combos }) => combos.forEach((keys) => {
            const modifers = (keys.includes('Ctrl') === ctrlKey)
                && (keys.includes('Shift') === shiftKey)
                && !altKey
                && !metaKey;
            const keyMatched = keys.some((shortcutKey) => (
                shortcutKey !== 'Ctrl'
                && shortcutKey !== 'Shift'
                && shortcutKeys.includes(shortcutKey)
            ));

            if (modifers && keyMatched) {
                const combo = combos.indexOf(keys);
                listeners.current.get(name)?.forEach((listener) => listener(combo, key, heldForMs));

                onShortcut(name as ShortcutName, combo, key, heldForMs);
            }
        }));
    }, [onShortcut]);

    const onKeyUp = useCallback((event: KeyboardEvent) => {
        const repeatKey = getKeyboardShortcutKey(event);
        keyDownAt.current.delete(repeatKey);
        lastRepeatTime.current.delete(repeatKey);
    }, []);

    const clearKeyState = useCallback(() => {
        keyDownAt.current.clear();
        lastRepeatTime.current.clear();
    }, []);

    const on = (name: ShortcutName, listener: ShortcutListener) => {
        !listeners.current.has(name) && listeners.current.set(name, new Set());
        listeners.current.get(name)!.add(listener);
    };

    const off = (name: ShortcutName, listener: ShortcutListener) => {
        listeners.current.get(name)?.delete(listener);
    };

    useEffect(() => {
        document.addEventListener('keydown', onKeyDown);
        document.addEventListener('keyup', onKeyUp);
        window.addEventListener('blur', clearKeyState);
        return () => {
            document.removeEventListener('keydown', onKeyDown);
            document.removeEventListener('keyup', onKeyUp);
            window.removeEventListener('blur', clearKeyState);
        };
    }, [clearKeyState, onKeyDown, onKeyUp]);

    return (
        <ShortcutsContext.Provider value={{ grouped: shortcuts, on, off }}>
            {children}
        </ShortcutsContext.Provider>
    );
};

const useShortcuts = () => {
    return useContext(ShortcutsContext);
};

export {
    ShortcutsProvider,
    useShortcuts,
};
