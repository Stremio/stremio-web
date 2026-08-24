type Shortcut = {
    name: string,
    label: string,
    combos: string[][],
    repeat?: boolean,
};

type ShortcutGroup = {
    name: string,
    label: string,
    shortcuts: Shortcut[],
};
