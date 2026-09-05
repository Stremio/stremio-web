import React, { createContext, useCallback, useContext, useEffect, useRef } from 'react';
import { PRIMARY_MODIFIER, getKeyboardShortcutKey, getKeyboardShortcutKeys } from './keyboard';
import shortcuts from './shortcuts.json';

const SHORTCUTS = shortcuts.map(({ shortcuts }) => shortcuts).flat();

export type ShortcutName = string;
export type ShortcutListener = (combo: number, key: string) => void;

interface ShortcutsContext {
    grouped: ShortcutGroup[],
    on: (name: ShortcutName, listener: ShortcutListener) => void,
    off: (name: ShortcutName, listener: ShortcutListener) => void,
}

const ShortcutsContext = createContext<ShortcutsContext>({} as ShortcutsContext);

type Props = {
    children: JSX.Element,
    onShortcut: (name: ShortcutName, combo: number, key: string) => void,
};

const REPEAT_THROTTLE_MS = 130;
const ZOOM_KEY_ALIASES: Record<string, string[]> = {
    '+': ['=', 'Equal', 'NumpadAdd'],
    '-': ['Minus', 'NumpadSubtract'],
    '0': ['Digit0', 'Numpad0'],
};

const isInputFocused = () => {
    const inputElements = ['INPUT', 'TEXTAREA', 'SELECT'];
    const activeElement = document.activeElement;

    return activeElement instanceof HTMLElement &&
        (inputElements.includes(activeElement.tagName) || activeElement.isContentEditable);
};

const ShortcutsProvider = ({ children, onShortcut }: Props) => {
    const listeners = useRef<Map<ShortcutName, Set<ShortcutListener>>>(new Map());
    const lastRepeatTime = useRef<Map<string, number>>(new Map());

    const onKeyDown = useCallback((event: KeyboardEvent) => {
        const { ctrlKey, shiftKey, altKey, metaKey, key, repeat } = event;
        if (event.isComposing) return;
        const inputFocused = isInputFocused();

        const shortcutKeys = getKeyboardShortcutKeys(event);
        const repeatKey = getKeyboardShortcutKey(event);
        const now = Date.now();
        const throttled = repeat && now - (lastRepeatTime.current.get(repeatKey) ?? 0) < REPEAT_THROTTLE_MS;
        if (repeat && !throttled) lastRepeatTime.current.set(repeatKey, now);

        SHORTCUTS.forEach(({ name, combos }) => combos.forEach((keys) => {
            const interfaceScale = name === 'interfaceScale';
            if (inputFocused && !interfaceScale) return;

            const primary = keys.includes('Mod');
            const modifiers = ((keys.includes('Ctrl') || (primary && PRIMARY_MODIFIER === 'Ctrl')) === ctrlKey)
                && ((primary && PRIMARY_MODIFIER === 'Meta') === metaKey)
                && (keys.includes('Shift') === shiftKey || (interfaceScale && (keys.includes('+') || keys.includes('0'))))
                && !altKey
                && !event.getModifierState('AltGraph');
            const keyMatched = keys.some((shortcutKey) => (
                shortcutKey !== 'Ctrl'
                && shortcutKey !== 'Shift'
                && shortcutKey !== 'Mod'
                && (shortcutKeys.includes(shortcutKey) || (interfaceScale && ZOOM_KEY_ALIASES[shortcutKey]?.some((alias) => shortcutKeys.includes(alias))))
            ));

            if (modifiers && keyMatched) {
                // Consume repeats and limit hits too, otherwise the browser also zooms.
                if (interfaceScale) event.preventDefault();
                if (throttled) return;
                const combo = combos.indexOf(keys);
                listeners.current.get(name)?.forEach((listener) => listener(combo, key));

                onShortcut(name as ShortcutName, combo, key);
            }
        }));
    }, [onShortcut]);

    const on = (name: ShortcutName, listener: ShortcutListener) => {
        !listeners.current.has(name) && listeners.current.set(name, new Set());
        listeners.current.get(name)!.add(listener);
    };

    const off = (name: ShortcutName, listener: ShortcutListener) => {
        listeners.current.get(name)?.delete(listener);
    };

    useEffect(() => {
        document.addEventListener('keydown', onKeyDown);
        return () => document.removeEventListener('keydown', onKeyDown);
    }, [onKeyDown]);

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
