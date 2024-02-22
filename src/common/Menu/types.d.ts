export type MenuPosition = ['top' | 'bottom', 'left' | 'right'];

export type Menu = {
    id: string,
    className: string,
    parent: HTMLElement,
    position?: MenuPosition,
    open: boolean,
};