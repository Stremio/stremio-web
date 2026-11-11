// Copyright (C) 2017-2026 Smart code 203358507

type Stage = {
    route: HTMLElement,
    live: HTMLElement,
    modal: HTMLElement,
    card: HTMLElement,
    button: HTMLElement,
    under: HTMLElement,
    over: HTMLElement,
    sheet: HTMLElement,
    copy: HTMLElement,
    scrolled: Element[],
    view: DOMRect,
    zoom: number,
    origin: { x: number, y: number },
};

const CLEAR = ['rgba(0, 0, 0, 0)', 'transparent'];
const COVER = 'position:absolute;top:0;right:0;bottom:0;left:0;overflow:hidden';
const FREEZE = '[data-board-transition] *,[data-board-transition] *::before,[data-board-transition] *::after{animation:none!important;transition:none!important}';

const ground = (element: Element) => {
    for (let node = element.parentElement; node !== null; node = node.parentElement) {
        const style = getComputedStyle(node);
        if (style.backgroundImage !== 'none' || !CLEAR.includes(style.backgroundColor)) {
            return node;
        }
    }

    return null;
};

const clone = (source: HTMLElement, scrolled: Element[]) => {
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

    return { copy, restore };
};

const layer = (order: number) => {
    const element = document.createElement('div');
    element.dataset.boardTransition = '';
    element.setAttribute('aria-hidden', 'true');
    element.style.cssText = `${COVER};z-index:${order}`;
    return element;
};

const freeze = (button: HTMLElement, dispose: (disposer: () => void) => void): Stage | null => {
    const modal = button.closest<HTMLElement>('.modal-container');
    const card = modal?.querySelector<HTMLElement>('[role="dialog"]') ?? null;
    const route = button.closest<HTMLElement>('.route-container');
    const live = route?.querySelector<HTMLElement>(':scope > .route-content') ?? null;
    if (modal === null || card === null || route === null || live === null) {
        return null;
    }

    const scrolled: Element[] = [];
    const board = clone(live, scrolled);
    const playing = card.getAnimations({ subtree: true }).filter(({ playState }) => playState === 'running');
    const under = layer(0);
    const over = layer(100);
    const freezer = document.createElement('style');
    const sheet = document.createElement('div');
    dispose(() => {
        under.remove();
        over.remove();
        playing.forEach((animation) => animation.play());
    });
    playing.forEach((animation) => animation.pause());
    freezer.textContent = FREEZE;
    under.inert = true;
    sheet.style.cssText = COVER;
    sheet.appendChild(board.copy);
    under.append(freezer, sheet);
    live.after(under);
    route.appendChild(over);
    board.restore();

    const view = under.getBoundingClientRect();
    const zoom = view.width / under.offsetWidth || 1;
    const rect = button.getBoundingClientRect();
    const backing = ground(route);
    if (backing !== null) {
        const area = backing.getBoundingClientRect();
        const { backgroundColor, backgroundImage } = getComputedStyle(backing);
        sheet.style.backgroundColor = backgroundColor;
        sheet.style.backgroundImage = backgroundImage;
        sheet.style.backgroundRepeat = 'no-repeat';
        sheet.style.backgroundSize = `${area.width / zoom}px ${area.height / zoom}px`;
        sheet.style.backgroundPosition = `${(area.left - view.left) / zoom}px ${(area.top - view.top) / zoom}px`;
    }

    return {
        route,
        live,
        modal,
        card,
        button,
        under,
        over,
        sheet,
        copy: board.copy,
        scrolled,
        view,
        zoom,
        origin: {
            x: rect.left + rect.width / 2 - view.left,
            y: rect.top + rect.height / 2 - view.top,
        },
    };
};

export type { Stage };

export default freeze;
