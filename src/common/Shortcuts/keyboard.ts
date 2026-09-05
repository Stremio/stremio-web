const KEY_CODE_MAP: Record<number, string> = {
    8: 'Backspace',
    27: 'Escape',
    32: 'Space',
    37: 'ArrowLeft',
    38: 'ArrowUp',
    39: 'ArrowRight',
    40: 'ArrowDown',
    122: 'F11',
    187: '=',
    189: '-',
    191: '/',
    219: '[',
    221: ']',
};

const KEY_MAP: Record<string, string> = {
    ' ': 'Space',
    Spacebar: 'Space',
    Esc: 'Escape',
    Left: 'ArrowLeft',
    Up: 'ArrowUp',
    Right: 'ArrowRight',
    Down: 'ArrowDown',
};

const keyFromKeyCode = (keyCode: number) => {
    if (KEY_CODE_MAP[keyCode]) {
        return KEY_CODE_MAP[keyCode];
    }

    if (keyCode >= 48 && keyCode <= 57) {
        return String.fromCharCode(keyCode);
    }

    if (keyCode >= 65 && keyCode <= 90) {
        return String.fromCharCode(keyCode);
    }

    if (keyCode >= 96 && keyCode <= 105) {
        return String(keyCode - 96);
    }

    return null;
};

const normalizeKeyboardKey = ({ key, keyCode, which }: KeyboardEvent) => {
    const mappedKey = KEY_MAP[key] ?? key;
    if (mappedKey && mappedKey !== 'Unidentified') {
        return mappedKey.length === 1 ? mappedKey.toUpperCase() : mappedKey;
    }

    return keyFromKeyCode(keyCode || which) ?? mappedKey;
};

const getKeyboardShortcutKey = (event: KeyboardEvent) => {
    return event.code && event.code !== 'Unidentified' ? event.code : normalizeKeyboardKey(event);
};

const getKeyboardShortcutKeys = (event: KeyboardEvent) => {
    const normalizedKey = normalizeKeyboardKey(event);
    const code = event.code !== 'Unidentified' ? event.code : '';
    return code && code !== normalizedKey ? [code, normalizedKey] : [normalizedKey];
};

export {
    getKeyboardShortcutKey,
    getKeyboardShortcutKeys,
};
