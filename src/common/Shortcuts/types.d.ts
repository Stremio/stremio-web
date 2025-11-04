type Shortcut = {
    name: string,
    label: string,
    combos: string[][],
};

type ShortcutGroup = {
    name: string,
    label: string,
    shortcuts: Shortcut[],
};
