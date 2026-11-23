// Copyright (C) 2017-2026 Smart code 203358507

type Unit = {
    element: HTMLElement,
    rect: DOMRect,
};

type Move = {
    element: HTMLElement,
    from: DOMRect,
    to: DOMRect,
};

type Hero = {
    section: HTMLElement,
    art: HTMLElement | null,
    image: HTMLImageElement | null,
    content: HTMLElement[],
    watch: HTMLElement | null,
    id: string | null,
};

type Plan = {
    moves: Move[],
    leaving: Unit[],
    entering: Unit[],
    poster: Unit | null,
};

const ROW = '[data-board-row]';
const ROW_FALLBACK = '[class*="board-row-"]';
const TILE = 'data-board-tile';
const HERO = '[data-spotlight-hero]';
const HERO_FALLBACK = 'section[aria-roledescription="carousel"]';
const ART = '[data-spotlight-art]';
const CONTENT = '[data-spotlight-content]';
const WATCH = '[data-spotlight-watch]';
const WATCH_FALLBACK = '[class*="watch"]';
const PANEL = '[role="tabpanel"]';
const SLIDE = `${PANEL}:not([aria-hidden="true"])`;
const HIDDEN = '[aria-hidden="true"]';
const FOCUSABLE = '[tabindex]:not([tabindex="-1"])';
const DETAILS = 'a[href*="/detail/"]';

const findRows = (root: HTMLElement) => {
    const hooked = root.querySelectorAll<HTMLElement>(ROW);
    return Array.from(hooked.length > 0 ? hooked : root.querySelectorAll<HTMLElement>(ROW_FALLBACK));
};

const units = (root: HTMLElement) => {
    const found = new Map<string, HTMLElement>();
    const seen = new Map<string, number>();
    findRows(root).forEach((row) => {
        const name = row.dataset.boardRow || (row.firstElementChild?.textContent ?? '');
        const count = seen.get(name) ?? 0;
        seen.set(name, count + 1);
        found.set(count === 0 ? name : `${name}#${count}`, row);
    });

    return found;
};

const findPoster = (row: HTMLElement, id: string) => {
    const hooked = row.querySelector(`[${TILE}="${CSS.escape(id)}"]`);
    const tile = hooked ?? Array.from(row.querySelectorAll(DETAILS)).find((link) => link.getAttribute('href')?.split('/')[3] === id) ?? null;
    return tile?.querySelector('img') ?? null;
};

const findChrome = (live: HTMLElement, content: HTMLElement | null) => {
    const chrome: DOMRect[] = [];
    for (let node = content; node !== null && node !== live; node = node.parentElement) {
        Array.from(node.parentElement?.children ?? []).forEach((sibling) => {
            const rect = sibling.getBoundingClientRect();
            if (sibling !== node && rect.width > 0 && rect.height > 0) {
                chrome.push(rect);
            }
        });
    }

    return chrome;
};

const createPlan = (old: HTMLElement, live: HTMLElement, view: DOMRect, id: string | null): Plan => {
    const inside = (rect: DOMRect) => rect.width > 0 && rect.bottom > view.top && rect.top < view.bottom && rect.right > view.left && rect.left < view.right;
    const before = units(old);
    const after = units(live);
    const plan: Plan = { moves: [], leaving: [], entering: [], poster: null };
    before.forEach((element, key) => {
        const from = element.getBoundingClientRect();
        const target = after.get(key);
        const shown = inside(from);
        if (shown && plan.poster === null && id !== null) {
            const image = findPoster(element, id);
            if (image !== null && inside(image.getBoundingClientRect())) {
                plan.poster = { element: image, rect: image.getBoundingClientRect() };
            }
        }
        if (target === undefined) {
            if (shown) {
                plan.leaving.push({ element, rect: from });
            }

            return;
        }

        const to = target.getBoundingClientRect();
        if (shown || inside(to)) {
            plan.moves.push({ element: target, from, to });
        }
    });
    after.forEach((element, key) => {
        const rect = element.getBoundingClientRect();
        if (!before.has(key) && inside(rect)) {
            plan.entering.push({ element, rect });
        }
    });

    return plan;
};

const shown = (element: Element) => element.closest(HIDDEN) === null && getComputedStyle(element).visibility !== 'hidden';

const findHero = (live: HTMLElement): Hero | null => {
    const section = live.querySelector<HTMLElement>(HERO) ?? live.querySelector<HTMLElement>(HERO_FALLBACK);
    if (section === null) {
        return null;
    }

    const hooked = section.querySelector<HTMLElement>(ART);
    const image = (hooked ?? section).querySelector('img');
    const art = hooked ?? Array.from(section.children).find((child): child is HTMLElement => child instanceof HTMLElement && child.contains(image)) ?? null;
    const block = Array.from(section.querySelectorAll<HTMLElement>(CONTENT)).find(shown) ?? section.querySelector<HTMLElement>(SLIDE);
    const rest = Array.from(section.children).filter((child) => !child.contains(art) && !child.matches(`${PANEL}, ${CONTENT}`) && child.querySelector(CONTENT) === null);
    return {
        section,
        art: image !== null ? art : null,
        image,
        content: [...Array.from(block?.children ?? []), ...rest].filter((part): part is HTMLElement => part instanceof HTMLElement && part.offsetWidth > 1),
        watch:
            Array.from(section.querySelectorAll<HTMLElement>(WATCH)).find(shown) ??
            block?.querySelector<HTMLElement>(`${WATCH_FALLBACK}${FOCUSABLE}`) ??
            (block ?? section).querySelector<HTMLElement>(FOCUSABLE),
        id: section.dataset.spotlightHero || (block?.querySelector(DETAILS)?.getAttribute('href')?.split('/')[3] ?? null),
    };
};

export type { Unit, Move, Hero, Plan };

export { createPlan, findHero, findRows, findChrome };
