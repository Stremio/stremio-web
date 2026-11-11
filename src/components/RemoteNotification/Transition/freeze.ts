// Copyright (C) 2017-2026 Smart code 203358507

import { CLEAR } from './paint';

type Frame = {
    live: HTMLElement,
    root: HTMLElement,
    board: HTMLElement,
    backdrop: HTMLElement,
    card: HTMLElement,
    images: Map<Element, HTMLImageElement>,
    scrolled: Element[],
    origin: { x: number, y: number },
    watcher: { changed: boolean },
    observer: MutationObserver,
};

const COVER = 'position:absolute;top:0;right:0;bottom:0;left:0;overflow:hidden';
const ROOT = `${COVER};pointer-events:none`;
const FREEZE = '[data-board-transition] *,[data-board-transition] *::before,[data-board-transition] *::after{animation:none!important;transition:none!important}';
const PRESSED = ['backgroundColor', 'color', 'outlineStyle', 'outlineColor', 'outlineWidth', 'outlineOffset'] as const;

const ground = (element: Element) => {
    for (let node = element.parentElement; node !== null; node = node.parentElement) {
        const style = getComputedStyle(node);
        if (style.backgroundImage !== 'none' || !CLEAR.includes(style.backgroundColor)) {
            return node;
        }
    }

    return null;
};

const clone = (source: HTMLElement, images: Map<Element, HTMLImageElement>, scrolled: Element[]) => {
    const sources = source.querySelectorAll('*');
    const offsets: [number, number, number][] = [];
    sources.forEach((element, index) => {
        if (element.scrollTop !== 0 || element.scrollLeft !== 0) {
            offsets.push([index, element.scrollTop, element.scrollLeft]);
            if (element.scrollTop !== 0) {
                scrolled.push(element);
            }
        }
    });

    const copy = source.cloneNode(true) as HTMLElement;
    const copies = copy.querySelectorAll('*');
    sources.forEach((element, index) => {
        const target = copies[index];
        if (element instanceof HTMLImageElement && target instanceof HTMLImageElement) {
            target.loading = 'eager';
            target.decoding = 'sync';
            images.set(target, element);
        } else if (element instanceof HTMLInputElement && target instanceof HTMLInputElement) {
            target.value = element.value;
        }
    });

    const restore = () => {
        offsets.forEach(([index, top, left]) => {
            copies[index].scrollTop = top;
            copies[index].scrollLeft = left;
        });
    };

    return { copy, copies, restore };
};

const freeze = (button: HTMLElement): Frame | null => {
    const modal = button.closest<HTMLElement>('.modal-container');
    const route = button.closest<HTMLElement>('.route-container');
    const live = route?.querySelector<HTMLElement>(':scope > .route-content') ?? null;
    if (modal === null || route === null || live === null) {
        return null;
    }

    const images = new Map<Element, HTMLImageElement>();
    const scrolled: Element[] = [];
    const board = clone(live, images, scrolled);
    const backdrop = clone(modal, images, []);
    const card = backdrop.copy.firstElementChild;
    const pressed = backdrop.copies[Array.prototype.indexOf.call(modal.querySelectorAll('*'), button)];
    if (!(card instanceof HTMLElement) || !(pressed instanceof HTMLElement)) {
        return null;
    }

    const style = getComputedStyle(button);
    PRESSED.forEach((property) => {
        pressed.style[property] = style[property];
    });

    const root = document.createElement('div');
    const freezer = document.createElement('style');
    const hold = document.createElement('div');
    const sheet = document.createElement('div');
    root.dataset.boardTransition = '';
    root.setAttribute('aria-hidden', 'true');
    root.style.cssText = ROOT;
    freezer.textContent = FREEZE;
    hold.inert = true;
    hold.style.cssText = `${COVER};z-index:2`;
    sheet.style.cssText = COVER;
    backdrop.copy.style.cssText += `;${COVER}`;
    sheet.appendChild(board.copy);
    hold.append(sheet, backdrop.copy);
    root.append(freezer, hold);
    route.appendChild(root);
    board.restore();
    backdrop.restore();

    const view = root.getBoundingClientRect();
    const rect = button.getBoundingClientRect();
    const backing = ground(route);
    const watcher = { changed: false };
    const observer = new MutationObserver(() => {
        watcher.changed = true;
    });
    observer.observe(live, { childList: true, subtree: true, attributes: true, attributeFilter: ['class'] });
    if (backing !== null) {
        const zoom = view.width / root.offsetWidth || 1;
        const area = backing.getBoundingClientRect();
        const { backgroundColor, backgroundImage } = getComputedStyle(backing);
        sheet.style.backgroundColor = backgroundColor;
        sheet.style.backgroundImage = backgroundImage;
        sheet.style.backgroundRepeat = 'no-repeat';
        sheet.style.backgroundSize = `${area.width / zoom}px ${area.height / zoom}px`;
        sheet.style.backgroundPosition = `${(area.left - view.left) / zoom}px ${(area.top - view.top) / zoom}px`;
    }

    return {
        live,
        root,
        board: sheet,
        backdrop: backdrop.copy,
        card,
        images,
        scrolled,
        origin: {
            x: (rect.left + rect.width / 2 - view.left) / view.width,
            y: (rect.top + rect.height / 2 - view.top) / view.height,
        },
        watcher,
        observer,
    };
};

export type { Frame };

export default freeze;
