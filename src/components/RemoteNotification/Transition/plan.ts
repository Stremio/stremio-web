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

const ROWS = '[class*="board-row-"]';
const HERO = 'section[aria-roledescription="carousel"]';
const SLIDE = '[role="tabpanel"]:not([aria-hidden="true"])';
const WATCH = '[class*="watch"]';
const FOCUSABLE = '[tabindex]:not([tabindex="-1"])';
const DETAILS = 'a[href*="/detail/"]';
const TILES = 3;

const metaId = (root: Element | null) => root?.querySelector(DETAILS)?.getAttribute('href')?.split('/')[3] ?? null;

const units = (root: HTMLElement) => {
    const found = new Map<string, HTMLElement>();
    const seen = new Map<string, number>();
    const unique = (key: string) => {
        const count = seen.get(key) ?? 0;
        seen.set(key, count + 1);
        return count === 0 ? key : `${key}#${count}`;
    };

    root.querySelectorAll<HTMLElement>(ROWS).forEach((row) => {
        const name = unique(row.firstElementChild?.textContent ?? '');
        Array.from(row.children).forEach((part, index) => {
            if (!(part instanceof HTMLElement)) {
                return;
            }
            if (part.children.length < TILES || part.querySelector('img') === null || getComputedStyle(part).overflowX !== 'visible') {
                found.set(`${name}/${index}`, part);
                return;
            }

            Array.from(part.children).forEach((tile, position) => {
                if (tile instanceof HTMLElement) {
                    found.set(unique(`${name}/${tile.querySelector('img')?.getAttribute('src') ?? position}`), tile);
                }
            });
        });
    });

    return found;
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
        if (shown && plan.poster === null && id !== null && metaId(element) === id) {
            const image = element.querySelector('img');
            if (image !== null) {
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

const findHero = (live: HTMLElement): Hero | null => {
    const section = live.querySelector<HTMLElement>(HERO);
    if (section === null) {
        return null;
    }

    const image = section.querySelector('img');
    const art = image?.closest<HTMLElement>(`${HERO} > *`) ?? null;
    const slide = section.querySelector<HTMLElement>(SLIDE);
    const parts = slide !== null ? Array.from(slide.children) : [];
    const rest = Array.from(section.children).filter((child) => child !== art && !child.matches('[role="tabpanel"]'));
    return {
        section,
        art,
        image,
        content: [...parts, ...rest].filter((child): child is HTMLElement => child instanceof HTMLElement && child.offsetWidth > 1),
        watch: slide?.querySelector<HTMLElement>(`${WATCH}${FOCUSABLE}`) ?? slide?.lastElementChild?.querySelector<HTMLElement>(FOCUSABLE) ?? null,
        id: metaId(slide),
    };
};

export type { Unit, Move, Hero, Plan };

export { createPlan, findHero };
