// Copyright (C) 2017-2026 Smart code 203358507

import type { Stage } from './freeze';
import type { Tier } from './quality';
import { glassy } from './quality';
import type { Hero } from './plan';
import type { Box } from './paint';
import paint, { place } from './paint';
import createSpring from './spring';
import { createPlan, findHero, findRows, findChrome } from './plan';
import type { Sand } from './sand';
import { createNoise, createField, createCover, createSand, createGlass, createPlate } from './sand';

type Rect = { left: number, top: number, width: number, height: number };

type Point = { x: number, y: number };

type Scope = { view: DOMRect, zoom: number };

type Budget = { ink: number, shots: number };

const HERO_CAP = 500;
const SCRIM = 260;
const HEAD_START = 60;
const PATIENCE = 260;
const STEP = 8;
const SOLID = 0.7;
const GHOST = 130;
const COPY = 0.7;
const STAGGER = 45;
const ENTRANCE = 320;
const RISE = 10;
const WAVE = 340;
const TAIL = 0.6;
const SOFT = 28;
const FEATHER = 48;
const QUICK = 150;
const FADE = 240;
const WIPE = 400;
const AREA = 4200000;
const TEXTURE = 4096;
const CARD: Budget = { ink: 14000, shots: 2000 };
const SHELVES: Budget = { ink: 2000, shots: 2500 };
const FLAT = 3000;
const INKED = 64;
const GRAIN = 3;
const MARGIN = 24;
const SLOW = 28;
const STALLED = 50;
const LINGER = 300;
const EASE = 'cubic-bezier(0.2, 0.7, 0.2, 1)';
const MASKS = ['mask-image', '-webkit-mask-image'];
const FROZEN = ['transform', 'opacity'] as const;
const ROWS = createSpring(300, 1);
const ART = createSpring(360, 1);

const spread = (share: number) => {
    const t = Math.max(0, share);
    return t <= 1 ? t * (2 - TAIL - (1 - TAIL) * t) : 1 + TAIL * (t - 1);
};

const zoomOf = (element: Element) => new DOMMatrixReadOnly(getComputedStyle(element).transform).a || 1;

const bitmap = (shape: number, image: Element, frame: Rect): Rect => {
    const { x, y, width, height } = place(shape, getComputedStyle(image), { x: frame.left, y: frame.top, width: frame.width, height: frame.height });
    return { left: x, top: y, width, height };
};

const mix = (from: Rect, to: Rect, share: number): Rect => ({
    left: from.left + (to.left - from.left) * share,
    top: from.top + (to.top - from.top) * share,
    width: from.width + (to.width - from.width) * share,
    height: from.height + (to.height - from.height) * share,
});

const within = ({ view }: Scope, rect: DOMRect | Rect): Rect => ({ left: rect.left - view.left, top: rect.top - view.top, width: rect.width, height: rect.height });

const reach = (origin: Point, rect: Rect) => Math.max(...[0, rect.width].flatMap((x) => [0, rect.height].map((y) => Math.hypot(rect.left + x - origin.x, rect.top + y - origin.y))));

const createAir = ({ view, zoom }: Scope, fast: boolean) => {
    const scale = Math.min(window.devicePixelRatio || 1, Math.sqrt(AREA / (view.width * view.height)), TEXTURE / Math.max(view.width, view.height));
    const width = Math.round(view.width * scale);
    const height = Math.round(view.height * scale);
    const sheet = () => {
        const canvas = document.createElement('canvas');
        canvas.style.cssText = `position:absolute;left:0;top:0;width:${(view.width / zoom).toFixed(2)}px;height:${(view.height / zoom).toFixed(2)}px`;
        return canvas;
    };
    const front = sheet();
    const back = sheet();
    front.width = width;
    front.height = height;
    const glass = fast ? createGlass(front) : null;
    const plate = createPlate(back);
    const field = createField(width, height, Math.hypot(width, height), createNoise());
    const layers = [glass, plate].map((renderer) => ({ renderer, sands: [] as Sand[], draws: [] as (() => void)[], dirty: false }));
    back.width = 0;
    back.height = 0;

    const stock = (flat: boolean, surface: HTMLCanvasElement, sand: Sand, grain: number) => {
        const layer = layers[flat ? 1 : 0];
        if (sand.count === 0 || layer.renderer === null) {
            return;
        }
        if (flat && back.width === 0) {
            back.width = width;
            back.height = height;
        }

        layer.sands.push(sand);
        layer.draws.push(layer.renderer.add(surface, sand, grain));
    };
    const advance = (seconds: number, radius: number, delta: number, hole: Rect | null) => {
        const gap = hole !== null ? { x: hole.left * scale, y: hole.top * scale, width: hole.width * scale, height: hole.height * scale } : null;
        field.update(seconds);
        return layers.map((layer) => {
            const alive = layer.sands.map((sand) => sand.advance(field, radius * scale, delta, gap)).some(Boolean);
            const flying = layer.sands.some((sand) => sand.range()[1] > sand.range()[0]);
            if (flying || layer.dirty) {
                layer.renderer?.clear();
                layer.draws.forEach((draw) => draw());
            }

            layer.dirty = flying;
            return alive;
        }).some(Boolean);
    };
    const discard = () => {
        glass?.drop();
        [front, back].forEach((canvas) => {
            canvas.width = 0;
            canvas.height = 0;
        });
    };

    return {
        scale,
        fast: glass !== null,
        canvases: [front, back],
        stock,
        advance,
        thin: (share: number) => layers.forEach(({ sands }) => sands.forEach((sand) => sand.thin(share))),
        discard,
    };
};

type Air = ReturnType<typeof createAir>;

const mill = (air: Air, { view, zoom }: Scope, roots: Element[], skip: Element | null, area: Rect, keep: Rect | null, source: Point, budget: Budget, images: Map<Element, HTMLImageElement>) => {
    const { scale } = air;
    const grain = Math.max(3, Math.round(GRAIN * scale));
    const drawn = paint(roots, skip, new DOMRect(view.left + area.left, view.top + area.top, area.width, area.height), scale, zoom, images);
    const { width, height } = drawn.shots;
    const bounds: Box = { x: 0, y: 0, width, height };
    const kept = createCover(bounds, keep !== null ? [{ x: (keep.left - area.left) * scale, y: (keep.top - area.top) * scale, width: keep.width * scale, height: keep.height * scale }] : []);
    const [marked, shot] = [drawn.marks, drawn.shot].map((boxes) => createCover(bounds, boxes));
    const letters = drawn.ink.getImageData(0, 0, width, height).data;
    const inked = (x: number, y: number) => [[0, 0], [-1, -1], [1, -1], [-1, 1], [1, 1]].some(([stepX, stepY]) => (
        letters[(Math.min(height - 1, Math.max(0, Math.round(y + stepY * grain / 4))) * width + Math.min(width - 1, Math.max(0, Math.round(x + stepX * grain / 4)))) * 4 + 3] > INKED
    ));
    const grind = (filled: (x: number, y: number) => boolean, amount: number) => createSand({
        region: { x: area.left * scale, y: area.top * scale, width, height },
        filled,
        origin: { x: source.x * scale, y: source.y * scale },
        unit: scale,
        grain,
        budget: amount,
        reach: (x, y) => Math.hypot(x - source.x * scale, y - source.y * scale),
    });
    const scraps = [drawn.ink.canvas, drawn.shots];
    const scrap = () => scraps.forEach((canvas) => {
        canvas.width = 0;
        canvas.height = 0;
    });
    const stamp = (canvas: HTMLCanvasElement) => {
        const dot = document.createElement('canvas');
        const stencil = canvas.getContext('2d');
        dot.width = grain;
        dot.height = grain;
        dot.getContext('2d')?.arc(grain / 2, grain / 2, grain / 2 - 0.25, 0, Math.PI * 2);
        dot.getContext('2d')?.fill();
        const pattern = stencil?.createPattern(dot, 'repeat') ?? null;
        if (stencil !== null && pattern !== null) {
            stencil.globalAlpha = 1;
            stencil.globalCompositeOperation = 'destination-in';
            stencil.fillStyle = pattern;
            stencil.fillRect(0, 0, width, height);
        }

        return canvas;
    };
    const letter = grind((x, y) => marked(x, y) && !kept(x, y) && inked(x, y), air.fast ? budget.ink : Math.min(FLAT, budget.ink));
    if (air.fast) {
        air.stock(false, drawn.ink.canvas, letter, grain);
    } else {
        const copy = document.createElement('canvas');
        copy.width = width;
        copy.height = height;
        copy.getContext('2d')?.drawImage(drawn.ink.canvas, 0, 0);
        scraps.push(copy);
        air.stock(true, stamp(copy), letter, grain);
    }
    if (drawn.shot.length > 0) {
        air.stock(true, stamp(drawn.shots), grind((x, y) => shot(x, y) && !kept(x, y), budget.shots), grain);
    }

    if (air.fast && drawn.shot.length === 0) {
        scrap();
    }

    return scrap;
};

const describe = (button: HTMLElement) => {
    const modal = button.closest<HTMLElement>('.modal-container');
    const card = modal?.querySelector<HTMLElement>('[role="dialog"]') ?? null;
    const route = button.closest<HTMLElement>('.route-container');
    if (card === null || route === null) {
        return null;
    }

    const view = route.getBoundingClientRect();
    const scope = { view, zoom: view.width / route.offsetWidth || 1 };
    const spot = card.querySelector<HTMLElement>('[data-hero-origin]');
    const spotStyle = spot !== null ? getComputedStyle(spot) : null;
    const moving = card.getAnimations({ subtree: true }).some(({ playState, effect }) => (
        playState === 'running' && !(effect instanceof KeyframeEffect && spot !== null && spot.contains(effect.target))
    ));
    const [cardRect, buttonRect] = [card, button].map((element) => within(scope, element.getBoundingClientRect()));
    const spotRect = spot !== null ? within(scope, spot.getBoundingClientRect()) : null;
    return {
        card,
        spot,
        scope,
        cardRect,
        buttonRect,
        spotRect,
        moving,
        docked: spotStyle !== null && spotStyle.transform === 'none' && Number(spotStyle.opacity) === 1,
        veiled: spotStyle !== null ? Number(spotStyle.opacity) : 1,
        key: JSON.stringify([cardRect, spotRect, view.width, view.height, window.devicePixelRatio, spotStyle?.transform, spotStyle?.opacity]),
    };
};

const prepare = (button: HTMLElement, settled: boolean) => {
    const shape = describe(button);
    if (shape === null || (settled && shape.moving)) {
        return null;
    }

    const { card, spot, scope, cardRect, buttonRect, spotRect } = shape;
    const origin = { x: buttonRect.left + buttonRect.width / 2, y: buttonRect.top + buttonRect.height / 2 };
    const air = createAir(scope, settled && glassy);
    try {
        const scrap = mill(air, scope, [card], spot, cardRect, spotRect, origin, CARD, new Map());
        const discard = () => {
            scrap();
            air.discard();
        };

        return { ...shape, air, discard };
    } catch (error) {
        air.discard();
        throw error;
    }
};

type Prepared = NonNullable<ReturnType<typeof prepare>>;

type Options = {
    stage: Stage,
    tier: Tier,
    pressed: number,
    prepared: Prepared | null,
    dispose: (disposer: () => void) => void,
    release: () => void,
    finish: () => boolean,
};

const fresh = (prepared: Prepared, button: HTMLElement) => describe(button)?.key === prepared.key;

const run = ({ stage, tier, pressed, prepared, dispose, release, finish }: Options) => {
    const { live, modal, card, button, under, over, sheet, copy, images, scrolled, view, zoom, origin } = stage;
    const animations: Animation[] = [];
    const restores: (() => void)[] = [];
    const scope = { view, zoom };
    const span = Math.hypot(Math.max(origin.x, view.width - origin.x), Math.max(origin.y, view.height - origin.y));
    let request = 0;
    let ended = false;
    let hero: Hero | null = null;
    let decoded = false;
    let decoding = false;

    const animate = (element: Element, keyframes: Keyframe[] | PropertyIndexedKeyframes, options: KeyframeAnimationOptions) => {
        const animation = element.animate(keyframes, options);
        animations.push(animation);
        return animation;
    };

    const local = (rect: DOMRect | Rect) => within(scope, rect);
    const px = (value: number) => `${(value / zoom).toFixed(2)}px`;

    const style = (element: HTMLElement, values: Record<string, string>) => {
        const before = Object.keys(values).map((name) => [name, element.style.getPropertyValue(name)]);
        Object.entries(values).forEach(([name, value]) => element.style.setProperty(name, value));
        restores.push(() => before.forEach(([name, value]) => element.style.setProperty(name, value)));
    };

    const ready = () => {
        const found = findHero(live);
        if (found === null) {
            return false;
        }
        if (found.image !== null && !decoded && !decoding) {
            const settle = () => {
                decoded = true;
            };
            decoding = true;
            found.image.decode().then(settle, settle);
        }

        return found.image === null || decoded;
    };

    const complete = () => {
        if (!ended) {
            ended = true;
            finish();
        }
    };

    dispose(() => {
        cancelAnimationFrame(request);
        window.removeEventListener('resize', complete);
        document.removeEventListener('visibilitychange', complete);
        animations.forEach((animation) => animation.cancel());
        restores.forEach((restore) => restore());
    });
    const start = (frame: FrameRequestCallback) => {
        dispose(() => {
            modal.style.visibility = 'hidden';
        });
        window.addEventListener('resize', complete);
        document.addEventListener('visibilitychange', complete);
        scrolled.forEach((element) => {
            element.scrollTop = 0;
        });
        request = requestAnimationFrame(frame);
    };

    const veils = Array.from(modal.children).filter((child) => child !== card);
    const lift = (duration: number) => veils.forEach((veil) => animate(veil, { opacity: 0 }, { duration, easing: 'ease-out', fill: 'forwards' }));

    if (tier !== 'sand') {
        const settle = (time: number) => {
            if (!ready() && time - pressed < HERO_CAP) {
                request = requestAnimationFrame(settle);
                return;
            }

            lift(FADE);
            if (tier === 'fade') {
                [under, card].forEach((element) => animate(element, { opacity: 0 }, { duration: FADE, easing: 'ease', fill: 'forwards' }));
                window.setTimeout(complete, FADE);
                return;
            }

            const cover = document.createElement('div');
            const x = px(origin.x);
            const y = px(origin.y);
            const frames = { clipPath: [`circle(0px at ${x} ${y})`, `circle(${Math.ceil(span / zoom)}px at ${x} ${y})`] };
            cover.style.cssText = sheet.style.cssText;
            under.appendChild(cover);
            live.before(under);
            animate(card, { opacity: 0 }, { duration: QUICK, easing: 'ease-out', fill: 'forwards' });
            animate(cover, frames, { duration: WIPE, easing: EASE, fill: 'both' });
            animate(live, frames, { duration: WIPE, easing: EASE, fill: 'both' });
            window.setTimeout(complete, WIPE);
        };

        return { commit: () => start(settle) };
    }

    const plate = prepared ?? prepare(button, false);
    if (plate === null) {
        throw new Error('stage');
    }

    const { cardRect, spot, spotRect, docked, veiled, air } = plate;
    const scene = spot?.closest<HTMLElement>('[data-hero-scene]') ?? null;
    const radii = getComputedStyle(card);
    const corner = (value: string) => Math.min(parseFloat(value) || 0, cardRect.width / zoom / 2, cardRect.height / zoom / 2);
    const [topLeft, topRight, bottomRight, bottomLeft] = [radii.borderTopLeftRadius, radii.borderTopRightRadius, radii.borderBottomRightRadius, radii.borderBottomLeftRadius].map(corner);
    const boxWidth = cardRect.width / zoom;
    const boxHeight = cardRect.height / zoom;
    const outline = `M${topLeft} 0H${boxWidth - topRight}A${topRight} ${topRight} 0 0 1 ${boxWidth} ${topRight}V${boxHeight - bottomRight}A${bottomRight} ${bottomRight} 0 0 1 ${boxWidth - bottomRight} ${boxHeight}H${bottomLeft}A${bottomLeft} ${bottomLeft} 0 0 1 0 ${boxHeight - bottomLeft}V${topLeft}A${topLeft} ${topLeft} 0 0 1 ${topLeft} 0Z`;
    const near = reach(origin, cardRect) + SOFT;
    const fabric: { element: HTMLElement, rect: Rect }[] = [{ element: card, rect: cardRect }];
    let far = near;
    let last = performance.now();
    let gone = -1;
    let usable = Infinity;
    let done = Infinity;
    let fading = Infinity;
    let slow = 0;
    let dissolved = false;
    let released = false;
    let ghost: HTMLElement | null = null;
    let frameAt: ((time: number) => Rect) | null = null;

    const snapshot = (source: HTMLElement, pane: Rect, round: boolean) => {
        const frame = document.createElement('div');
        const inner = source.cloneNode(true) as HTMLElement;
        const area = local(source.getBoundingClientRect());
        const sources = [source, ...Array.from(source.querySelectorAll<HTMLElement>('*'))];
        const copies = [inner, ...Array.from(inner.querySelectorAll<HTMLElement>('*'))];
        sources.forEach((element, index) => {
            const computed = getComputedStyle(element);
            FROZEN.forEach((property) => {
                copies[index].style[property] = computed[property];
            });
        });
        frame.style.cssText = `position:absolute;left:${px(pane.left)};top:${px(pane.top)};width:${px(pane.width)};height:${px(pane.height)};overflow:hidden;transform-origin:0 0;border-radius:${round ? `${topLeft}px ${topRight}px 0 0` : '0'}`;
        inner.style.cssText += `;position:absolute;left:${px(area.left - pane.left)};top:${px(area.top - pane.top)};width:${px(area.width)};height:${px(area.height)};padding:0;margin:0`;
        frame.appendChild(inner);
        over.appendChild(frame);
        return frame;
    };

    const travel = (element: HTMLElement, from: Rect, to: Rect) => {
        const inside = (rect: Rect) => rect.top + rect.height > 0 && rect.top < view.height;
        const clamp = (rect: Rect, other: Rect) => {
            if (inside(rect)) {
                return rect.top;
            }

            return rect.top > other.top ? Math.min(rect.top, view.height + MARGIN) : Math.max(rect.top, -rect.height - MARGIN);
        };
        const begin = { ...from, top: clamp(from, to) };
        const end = { ...to, top: clamp(to, from) };
        const scaleX = to.width > 0 ? from.width / to.width : 1;
        const scaleY = to.height > 0 ? from.height / to.height : 1;
        const sized = Math.abs(scaleX - 1) > 0.01 || Math.abs(scaleY - 1) > 0.01;
        if (Math.abs(begin.left - end.left) < 0.5 && Math.abs(begin.top - end.top) < 0.5 && !sized) {
            return null;
        }

        animate(element, ROWS.left.map((left) => ({
            transformOrigin: '0 0',
            transform: `translate(${px((begin.left - to.left) * left)}, ${px(end.top - to.top + (begin.top - end.top) * left)})${sized ? ` scale(${(1 + (scaleX - 1) * left).toFixed(4)}, ${(1 + (scaleY - 1) * left).toFixed(4)})` : ''}`,
        })), { duration: ROWS.duration, easing: 'linear', fill: 'backwards' });
        return { start: begin, end };
    };

    const arrive = (element: Element, delay: number) => (
        animate(element, [{ opacity: 0, transform: `translateY(${RISE}px)` }, {}], { duration: ENTRANCE, delay, easing: EASE, fill: 'backwards' })
    );

    const counter = (box: Rect, parent: Rect, shown: Rect, frame: Rect, wanted: Rect) => {
        const scaleX = frame.width / parent.width;
        const scaleY = frame.height / parent.height;
        const size = wanted.width / shown.width;
        const moveX = parent.left - box.left + (size * (box.left - shown.left) + wanted.left - frame.left) / scaleX;
        const moveY = parent.top - box.top + (size * (box.top - shown.top) + wanted.top - frame.top) / scaleY;
        return `translate(${px(moveX)}, ${px(moveY)}) scale(${(size / scaleX).toFixed(5)}, ${(size / scaleY).toFixed(5)})`;
    };

    const open = ({ section, art, image }: Hero & { art: HTMLElement }, from: Rect, delay: number) => {
        const to = local(art.getBoundingClientRect());
        const holder = image !== null && image.parentElement !== art ? image.parentElement : null;
        const shape = image !== null && image.naturalWidth > 0 && image.naturalHeight > 0 ? image.naturalWidth / image.naturalHeight : null;
        const shot = spot?.querySelector('img') ?? image;
        const frames = ART.left.map((left) => mix(from, to, 1 - left));
        const timing = { duration: ART.duration, delay, easing: 'linear', fill: 'backwards' } as const;
        let seed: Rect | null = null;
        let views: Rect[] = [];
        style(section, { 'z-index': String(Math.max(0, ...Array.from(section.parentElement?.children ?? []).map((sibling) => Number(getComputedStyle(sibling).zIndex) || 0)) + 1) });
        if (holder !== null && image !== null && shape !== null && shot !== null) {
            const box = local(holder.getBoundingClientRect());
            const rest = bitmap(shape, image, box);
            const wide = bitmap(shape, shot, from);
            const grow = zoomOf(shot) / zoomOf(image);
            const sown = {
                left: from.left + from.width / 2 + (wide.left - from.left - from.width / 2) * grow,
                top: from.top + from.height / 2 + (wide.top - from.top - from.height / 2) * grow,
                width: wide.width * grow,
                height: wide.height * grow,
            };
            seed = sown;
            views = ART.left.map((left) => mix(sown, rest, 1 - left));
            style(holder, { overflow: 'visible' });
            style(image, {
                'position': 'absolute',
                'left': px(rest.left - box.left),
                'top': px(rest.top - box.top),
                'width': px(rest.width),
                'height': px(rest.height),
                'max-width': 'none',
                'max-height': 'none',
                'object-fit': 'fill',
                'transform-origin': `${px(box.left + box.width / 2 - rest.left)} ${px(box.top + box.height / 2 - rest.top)}`,
            });
            animate(holder, frames.map((frame, index) => ({ transformOrigin: '0 0', transform: counter(box, to, rest, frame, views[index]) })), timing);
        }

        animate(art, frames.map((frame) => ({
            transformOrigin: '0 0',
            transform: `translate(${px(frame.left - to.left)}, ${px(frame.top - to.top)}) scale(${(frame.width / to.width).toFixed(5)}, ${(frame.height / to.height).toFixed(5)})`,
        })), timing);
        if (veiled < 1) {
            animate(art, { opacity: [veiled, 1] }, { duration: GHOST, delay, easing: 'ease-out', fill: 'backwards' });
        }
        if (from.width < to.width - 2) {
            const computed = getComputedStyle(art);
            const mask = computed.maskImage !== undefined && computed.maskImage !== 'none' ? computed.maskImage : computed.webkitMaskImage;
            const layered = typeof mask === 'string' && mask !== 'none' && mask !== '';
            const feather = FEATHER / (from.width / to.width) / zoom;
            const side = `linear-gradient(90deg, transparent 0px, #000 ${feather.toFixed(1)}px, #000 calc(100% - ${feather.toFixed(1)}px), transparent 100%)`;
            const sizes = ['100% 100%', `calc(100% + ${(feather * 2).toFixed(1)}px) 100%`].map((size) => layered ? `100% 100%, ${size}` : size);
            const layers = layered ? `${mask}, ${side}` : side;
            style(art, {
                'mask-image': layers,
                '-webkit-mask-image': layers,
                'mask-composite': 'intersect',
                '-webkit-mask-composite': 'source-in',
                'mask-repeat': 'no-repeat',
                '-webkit-mask-repeat': 'no-repeat',
                'mask-position': 'center',
                '-webkit-mask-position': 'center',
                'mask-size': sizes[0],
                '-webkit-mask-size': sizes[0],
            });
            animate(art, { maskSize: sizes, webkitMaskSize: sizes }, { duration: ART.until(0.02), delay, easing: 'cubic-bezier(0.3, 0.6, 0.3, 1)', fill: 'both' });
        }

        return { frames, seed, views, timing };
    };

    const go = (time: number) => {
        gone = time;
        hero = findHero(live);
        findRows(live).forEach((row) => {
            row.getAnimations().forEach((animation) => {
                if (animation instanceof CSSAnimation) {
                    animation.finish();
                }
            });
        });

        const plan = createPlan(copy, live, view, hero?.id ?? null);
        const rows = plan.moves.flatMap(({ element, from, to }) => travel(element, local(from), local(to)) ?? []);
        const content = plan.moves[0]?.element.parentElement ?? hero?.section.parentElement ?? null;
        const chrome = findChrome(live, content).map(local);
        const from = spotRect ?? (plan.poster !== null ? local(plan.poster.rect) : local(button.getBoundingClientRect()));
        const target = hero !== null && hero.art !== null && (spotRect !== null || decoded) ? local(hero.art.getBoundingClientRect()) : null;
        let delay = HEAD_START;
        let settled = rows.length > 0 ? ROWS.until(0.02) : 0;
        let finished = rows.length > 0 ? ROWS.duration : 0;
        let text = HEAD_START;

        const blocked = (wait: number) => {
            if (target === null || spotRect === null) {
                return false;
            }
            for (let moment = wait; moment <= wait + ART.duration; moment += STEP) {
                const frame = mix(from, target, 1 - ART.at(moment - wait));
                const solid = frame.top + frame.height * SOLID;
                const crossed = rows.some(({ start: begin, end }) => {
                    const top = end.top + (begin.top - end.top) * ROWS.at(moment);
                    const left = Math.max(0, end.left);
                    const right = Math.min(view.width, end.left + end.width);
                    if (top >= solid - 1 || top + end.height <= frame.top || right <= frame.left || left >= frame.left + frame.width) {
                        return false;
                    }

                    return left < frame.left - 1 || right > frame.left + frame.width + 1 || top < frame.top - 1;
                });
                if (crossed) {
                    return true;
                }
            }

            return false;
        };

        while (delay < PATIENCE && blocked(delay)) {
            delay += STEP;
        }

        sheet.style.visibility = 'hidden';
        if (plan.leaving.length > 0) {
            const edges = plan.leaving.map(({ rect }) => local(rect));
            const left = Math.max(0, Math.min(...edges.map((edge) => edge.left)));
            const top = Math.max(0, Math.min(...edges.map((edge) => edge.top)));
            const area = {
                left,
                top,
                width: Math.min(view.width, Math.max(...edges.map((edge) => edge.left + edge.width))) - left,
                height: Math.min(view.height, Math.max(...edges.map((edge) => edge.top + edge.height))) - top,
            };
            plan.leaving.forEach(({ element }, index) => {
                element.style.visibility = 'visible';
                fabric.push({ element, rect: edges[index] });
            });
            if (area.width > 0 && area.height > 0) {
                dispose(mill(air, scope, plan.leaving.map(({ element }) => element), null, area, null, origin, SHELVES, images));
                far = Math.max(far, reach(origin, area) + SOFT);
            }
        }

        air.canvases.forEach((canvas) => {
            const holes = chrome.map((rect) => `M${px(rect.left)} ${px(rect.top)}h${px(rect.width)}v${px(rect.height)}h-${px(rect.width)}Z`);
            canvas.style.clipPath = `path(evenodd, "M0 0H${px(view.width)}V${px(view.height)}H0Z${holes.join('')}")`.replace(/px/g, '');
        });
        lift(SCRIM);
        if (spot !== null && scene !== null && spotRect !== null) {
            ghost = snapshot(scene, spotRect, Math.abs(spotRect.top - cardRect.top) < 2);
            Array.from(ghost.firstElementChild?.children ?? []).forEach((layer, index) => {
                if (scene.children[index] !== spot) {
                    animate(layer, { opacity: 0 }, { duration: GHOST / 2, delay, easing: 'ease-out', fill: 'forwards' });
                }
            });
            style(card, { 'clip-path': `path(evenodd, "${outline}M${px(spotRect.left - cardRect.left)} ${px(spotRect.top - cardRect.top)}h${px(spotRect.width)}v${px(spotRect.height)}h-${px(spotRect.width)}Z")`.replace(/px/g, '') });
        } else if (plan.poster !== null && target !== null) {
            ghost = snapshot(plan.poster.element, from, false);
        }
        if (hero !== null && hero.art !== null && target !== null) {
            const { frames, seed, views, timing } = open({ ...hero, art: hero.art }, from, delay);
            const inner = ghost?.firstElementChild ?? null;
            const opened = time + delay;
            text = delay + ART.until(1 - COPY);
            settled = Math.max(settled, delay + ART.until(0.015));
            finished = Math.max(finished, delay + ART.duration);
            frameAt = (moment) => mix(from, target, 1 - ART.at(moment - opened));
            if (ghost !== null && (docked || spot === null)) {
                animate(ghost, frames.map((frame) => ({
                    transform: `translate(${px(frame.left - from.left)}, ${px(frame.top - from.top)}) scale(${(frame.width / from.width).toFixed(5)}, ${(frame.height / from.height).toFixed(5)})`,
                })), timing);
                if (inner !== null && scene !== null && seed !== null && spot !== null) {
                    const area = local(scene.getBoundingClientRect());
                    animate(inner, frames.map((frame, index) => ({ transformOrigin: '0 0', transform: counter(area, from, seed, frame, views[index]) })), timing);
                }
            }
        } else if (spotRect !== null) {
            frameAt = () => spotRect;
        }

        fading = time + delay;
        (hero?.content ?? []).forEach((part, index) => {
            arrive(part, text + index * STAGGER);
            if (hero !== null && hero.watch !== null && part.contains(hero.watch)) {
                settled = Math.max(settled, text + index * STAGGER + ENTRANCE * 0.5);
            }

            finished = Math.max(finished, text + index * STAGGER + ENTRANCE);
        });
        plan.entering.forEach(({ element }) => {
            arrive(element, text + STAGGER);
            finished = Math.max(finished, text + STAGGER + ENTRANCE);
        });
        usable = time + Math.max(settled, WAVE);
        done = time + Math.max(finished, WAVE * (1 + Math.max(0, far / near - 1) / TAIL));
    };

    const tick = (time: number) => {
        const elapsed = time - last;
        const delta = Math.min(0.034, Math.max(0, elapsed / 1000));
        last = time;
        if (gone < 0) {
            if (!ready() && time - pressed < HERO_CAP) {
                return;
            }

            go(time);
        }

        const radius = near * spread((time - gone) / WAVE);
        const frame = frameAt?.(time) ?? null;
        slow = elapsed > SLOW ? slow + (elapsed > STALLED ? 2 : 1) : Math.max(0, slow - 1);
        if (slow >= 4) {
            air.thin(slow >= 8 ? 0.15 : 0.5);
        }
        if (!dissolved && radius >= far) {
            dissolved = true;
            fabric.forEach(({ element }) => {
                element.style.visibility = 'hidden';
            });
        } else if (!dissolved && slow >= 12) {
            dissolved = true;
            fabric.forEach(({ element }) => {
                MASKS.forEach((name) => element.style.removeProperty(name));
                animate(element, { opacity: 0 }, { duration: QUICK, easing: 'ease-out', fill: 'forwards' });
            });
            air.thin(0);
        } else if (!dissolved) {
            fabric.forEach(({ element, rect }) => {
                const mask = `radial-gradient(circle at ${px(origin.x - rect.left)} ${px(origin.y - rect.top)}, transparent ${px(Math.max(0, radius - SOFT))}, #000 ${px(radius)})`;
                MASKS.forEach((name) => element.style.setProperty(name, mask));
            });
        }
        if (ghost !== null && time >= fading && (decoded || hero === null || hero.image === null || time >= usable)) {
            fading = Infinity;
            animate(ghost, { opacity: [1, 0] }, { duration: GHOST, easing: 'ease-out', fill: 'forwards' });
        }

        const alive = air.advance(time / 1000, Math.max(0, radius - SOFT / 2), delta, frame);
        if (!released && time >= usable) {
            released = true;
            modal.style.pointerEvents = 'none';
            over.style.pointerEvents = 'none';
            release();
        }
        if (time >= done && (!alive || time >= done + LINGER)) {
            complete();
        }
    };

    const loop = (time: number) => {
        request = requestAnimationFrame(loop);
        try {
            tick(time);
        } catch (_error) {
            complete();
        }
    };

    restores.push(() => MASKS.forEach((name) => card.style.removeProperty(name)));
    over.append(...air.canvases);
    dispose(plate.discard);
    return { commit: () => start(loop) };
};

export type { Prepared };

export { prepare, fresh };

export default run;
