// Copyright (C) 2017-2026 Smart code 203358507

import type { Stage } from './freeze';
import type { Tier } from './quality';
import type { Hero } from './plan';
import type { Box } from './paint';
import paint, { place } from './paint';
import createSpring from './spring';
import { createPlan, findHero, findRows, findChrome } from './plan';
import { createNoise, createField, createSand } from './sand';

type Options = {
    stage: Stage,
    tier: Tier,
    pressed: number,
    dispose: (disposer: () => void) => void,
    release: () => void,
    finish: () => boolean,
};

type Rect = { left: number, top: number, width: number, height: number };

const HERO_CAP = 500;
const SCRIM = 220;
const HEAD_START = 60;
const PATIENCE = 260;
const STEP = 8;
const SOLID = 0.7;
const GHOST = 130;
const COPY = 0.7;
const STAGGER = 45;
const ENTRANCE = 320;
const RISE = 10;
const WAVE = 200;
const SOFT = 80;
const EDGE = 48;
const HURRY = 150;
const FADE = 240;
const WIPE = 400;
const AREA = 4200000;
const BUDGET = 3000;
const GRAIN = 2.5;
const DRIFT = 110;
const INK = 96;
const MARGIN = 24;
const SLOW = 28;
const STALLED = 50;
const EASE = 'cubic-bezier(0.2, 0.7, 0.2, 1)';
const MASKS = ['mask-image', '-webkit-mask-image', 'mask-composite', '-webkit-mask-composite', 'mask-repeat', '-webkit-mask-repeat', 'mask-position', '-webkit-mask-position', 'mask-size', '-webkit-mask-size'];
const FROZEN = ['transform', 'opacity'] as const;
const ROWS = createSpring(300, 1);
const ART = createSpring(360, 1);

const smooth = (value: number) => {
    const t = Math.max(0, Math.min(1, value));
    return t * t * (3 - 2 * t);
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

const run = ({ stage, tier, pressed, dispose, release, finish }: Options) => {
    const { live, modal, card, button, under, over, sheet, copy, scrolled, view, zoom, origin } = stage;
    const animations: Animation[] = [];
    const restores: (() => void)[] = [];
    const span = Math.hypot(Math.max(origin.x, view.width - origin.x), Math.max(origin.y, view.height - origin.y));
    let request = 0;
    let ended = false;
    let hurried = false;
    let hero: Hero | null = null;
    let decoded = false;
    let decoding = false;

    const animate = (element: Element, keyframes: Keyframe[] | PropertyIndexedKeyframes, options: KeyframeAnimationOptions) => {
        const animation = element.animate(keyframes, options);
        animations.push(animation);
        return animation;
    };

    const local = (rect: DOMRect | Rect): Rect => ({ left: rect.left - view.left, top: rect.top - view.top, width: rect.width, height: rect.height });
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

    const hurry = () => {
        if (ended || hurried) {
            return;
        }

        hurried = true;
        animations.forEach((animation) => animation.updatePlaybackRate(8));
        [under, over, card].forEach((element) => animate(element, { opacity: 0 }, { duration: HURRY, easing: 'ease-out', fill: 'forwards' }));
        window.setTimeout(complete, HURRY);
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
            animate(card, { opacity: 0 }, { duration: HURRY, easing: 'ease-out', fill: 'forwards' });
            animate(cover, frames, { duration: WIPE, easing: EASE, fill: 'both' });
            animate(live, frames, { duration: WIPE, easing: EASE, fill: 'both' });
            window.setTimeout(complete, WIPE);
        };

        return { hurry, commit: () => start(settle) };
    }

    const cardRect = local(card.getBoundingClientRect());
    const spot = card.querySelector<HTMLElement>('[data-hero-origin]');
    const scene = spot?.closest<HTMLElement>('[data-hero-scene]') ?? null;
    const spotRect = spot !== null ? local(spot.getBoundingClientRect()) : null;
    const spotStyle = spot !== null ? getComputedStyle(spot) : null;
    const docked = spotStyle !== null && spotStyle.transform === 'none' && Number(spotStyle.opacity) === 1;
    const region: Rect = {
        left: Math.max(0, cardRect.left - DRIFT),
        top: Math.max(0, cardRect.top - DRIFT),
        width: Math.min(view.width, cardRect.left + cardRect.width + DRIFT) - Math.max(0, cardRect.left - DRIFT),
        height: Math.min(view.height, cardRect.top + cardRect.height + DRIFT) - Math.max(0, cardRect.top - DRIFT),
    };
    const ratio = window.devicePixelRatio || 1;
    const scale = Math.min(ratio, Math.sqrt(AREA / (region.width * region.height)));
    const grain = Math.max(3, Math.round(GRAIN * scale));
    const canvas = document.createElement('canvas');
    const context = canvas.getContext('2d')!;
    const dot = document.createElement('canvas');
    const far = Math.max(...[0, cardRect.width].flatMap((x) => [0, cardRect.height].map((y) => Math.hypot(cardRect.left + x - origin.x, cardRect.top + y - origin.y)))) + SOFT;
    const radii = getComputedStyle(card);
    const corner = (value: string) => Math.min(parseFloat(value) || 0, cardRect.width / zoom / 2, cardRect.height / zoom / 2);
    const [topLeft, topRight, bottomRight, bottomLeft] = [radii.borderTopLeftRadius, radii.borderTopRightRadius, radii.borderBottomRightRadius, radii.borderBottomLeftRadius].map(corner);
    const boxWidth = cardRect.width / zoom;
    const boxHeight = cardRect.height / zoom;
    const outline = `M${topLeft} 0H${boxWidth - topRight}A${topRight} ${topRight} 0 0 1 ${boxWidth} ${topRight}V${boxHeight - bottomRight}A${bottomRight} ${bottomRight} 0 0 1 ${boxWidth - bottomRight} ${boxHeight}H${bottomLeft}A${bottomLeft} ${bottomLeft} 0 0 1 0 ${boxHeight - bottomLeft}V${topLeft}A${topLeft} ${topLeft} 0 0 1 ${topLeft} 0Z`;
    const ink = paint(card, spot, new DOMRect(view.left + cardRect.left, view.top + cardRect.top, cardRect.width, cardRect.height), scale, zoom);
    const offset: Box = { x: (cardRect.left - region.left) * scale, y: (cardRect.top - region.top) * scale, width: ink.text.width, height: ink.text.height };
    const kept: Box[] = spotRect !== null ? [{ x: (spotRect.left - cardRect.left) * scale, y: (spotRect.top - cardRect.top) * scale, width: spotRect.width * scale, height: spotRect.height * scale }] : [];
    const letters = (() => {
        try {
            return ink.text.getContext('2d')!.getImageData(0, 0, ink.text.width, ink.text.height).data;
        } catch (_error) {
            return null;
        }
    })();
    const inked = letters !== null ? (x: number, y: number) => letters[(Math.min(ink.text.height - 1, y | 0) * ink.text.width + Math.min(ink.text.width - 1, x | 0)) * 4 + 3] > INK : null;
    dot.width = grain;
    dot.height = grain;
    dot.getContext('2d')?.arc(grain / 2, grain / 2, grain / 2 - 0.25, 0, Math.PI * 2);
    dot.getContext('2d')?.fill();
    [ink.text, ink.image].forEach((source) => {
        const surface = source.getContext('2d');
        const pattern = surface?.createPattern(dot, 'repeat') ?? null;
        if (surface !== null && pattern !== null) {
            surface.globalAlpha = 1;
            surface.globalCompositeOperation = 'destination-in';
            surface.fillStyle = pattern;
            surface.fillRect(0, 0, source.width, source.height);
        }
    });
    canvas.width = Math.round(region.width * scale);
    canvas.height = Math.round(region.height * scale);
    canvas.style.cssText = `position:absolute;left:${px(region.left)};top:${px(region.top)};width:${px(region.width)};height:${px(region.height)}`;
    over.appendChild(canvas);
    dispose(() => {
        [canvas, ink.text, ink.image].forEach((surface) => {
            surface.width = 0;
            surface.height = 0;
        });
    });

    const field = createField(canvas.width, canvas.height, span * scale, createNoise());
    const sand = createSand({
        materials: [
            { canvas: ink.text, region: offset, marks: ink.marks.filter(({ text }) => text), keep: kept, inked },
            { canvas: ink.image, region: offset, marks: ink.marks.filter(({ text }) => !text), keep: kept, inked: null },
        ],
        origin: {
            x: ((spotRect !== null ? spotRect.left + spotRect.width / 2 : origin.x) - region.left) * scale,
            y: ((spotRect !== null ? spotRect.top + spotRect.height / 2 : origin.y) - region.top) * scale,
        },
        span: span * scale,
        grain,
        budget: BUDGET,
        reach: (x, y) => Math.hypot(x / scale + region.left - origin.x, y / scale + region.top - origin.y) * scale,
    });
    let last = performance.now();
    let gone = -1;
    let usable = Infinity;
    let done = Infinity;
    let fading = Infinity;
    let slow = 0;
    let dissolved = false;
    let released = false;
    let ghost: HTMLElement | null = null;

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
        const start = { ...from, top: clamp(from, to) };
        const end = { ...to, top: clamp(to, from) };
        const scaleX = to.width > 0 ? from.width / to.width : 1;
        const scaleY = to.height > 0 ? from.height / to.height : 1;
        const sized = Math.abs(scaleX - 1) > 0.01 || Math.abs(scaleY - 1) > 0.01;
        if (Math.abs(start.left - end.left) < 0.5 && Math.abs(start.top - end.top) < 0.5 && !sized) {
            return null;
        }

        animate(element, ROWS.left.map((left) => ({
            transformOrigin: '0 0',
            transform: `translate(${px((start.left - to.left) * left)}, ${px(end.top - to.top + (start.top - end.top) * left)})${sized ? ` scale(${(1 + (scaleX - 1) * left).toFixed(4)}, ${(1 + (scaleY - 1) * left).toFixed(4)})` : ''}`,
        })), { duration: ROWS.duration, easing: 'linear', fill: 'backwards' });
        return { start, end };
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

    const open = ({ section, art, image }: Hero & { art: HTMLElement }, from: Rect, delay: number, veiled: number) => {
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
            const feather = EDGE / (from.width / to.width) / zoom;
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
        const holes = findChrome(live, content).map(local).map((rect) => `M${px(rect.left - region.left)} ${px(rect.top - region.top)}h${px(rect.width)}v${px(rect.height)}h-${px(rect.width)}Z`.replace(/px/g, ''));
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
                const crossed = rows.some(({ start, end }) => {
                    const top = end.top + (start.top - end.top) * ROWS.at(moment);
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

        canvas.style.clipPath = `path(evenodd, "M0 0H${px(region.width)}V${px(region.height)}H0Z${holes.join('')}")`.replace(/px/g, '');
        sheet.style.visibility = 'hidden';
        plan.leaving.forEach(({ element }) => {
            element.style.visibility = 'visible';
            animate(element, { opacity: [1, 0], transform: ['none', `translateY(${RISE}px)`] }, { duration: HURRY, easing: 'ease-out', fill: 'forwards' });
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
            const { frames, seed, views, timing } = open({ ...hero, art: hero.art }, from, delay, spotStyle !== null ? Number(spotStyle.opacity) : 1);
            const inner = ghost?.firstElementChild ?? null;
            text = delay + ART.until(1 - COPY);
            settled = Math.max(settled, delay + ART.until(0.015));
            finished = Math.max(finished, delay + ART.duration);
            if (ghost !== null && (docked || spot === null)) {
                animate(ghost, frames.map((frame) => ({
                    transform: `translate(${px(frame.left - from.left)}, ${px(frame.top - from.top)}) scale(${(frame.width / from.width).toFixed(5)}, ${(frame.height / from.height).toFixed(5)})`,
                })), timing);
                if (inner !== null && scene !== null && seed !== null && spot !== null) {
                    const area = local(scene.getBoundingClientRect());
                    animate(inner, frames.map((frame, index) => ({ transformOrigin: '0 0', transform: counter(area, from, seed, frame, views[index]) })), timing);
                }
            }
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
        done = time + Math.max(finished, WAVE);
    };

    const tick = (time: number) => {
        const elapsed = time - last;
        const delta = Math.min(0.034, Math.max(0, elapsed / 1000));
        last = time;
        if (hurried) {
            return;
        }
        if (gone < 0) {
            if (!ready() && time - pressed < HERO_CAP) {
                return;
            }

            go(time);
        }

        const radius = far * smooth((time - gone) / WAVE);
        if (!dissolved) {
            if (radius >= far) {
                dissolved = true;
                card.style.visibility = 'hidden';
            } else {
                const mask = `radial-gradient(circle at ${px(origin.x - cardRect.left)} ${px(origin.y - cardRect.top)}, transparent ${px(Math.max(0, radius - SOFT))}, #000 ${px(radius)})`;
                card.style.setProperty('-webkit-mask-image', mask);
                card.style.setProperty('mask-image', mask);
            }
        }
        if (ghost !== null && time >= fading && (decoded || hero === null || hero.image === null || time >= usable)) {
            fading = Infinity;
            animate(ghost, { opacity: [1, 0] }, { duration: GHOST, easing: 'ease-out', fill: 'forwards' });
        }

        field.update(time / 1000);
        context.clearRect(0, 0, canvas.width, canvas.height);
        const alive = sand.advance(context, field, Math.max(0, radius - SOFT / 2) * scale, delta);
        slow = elapsed > SLOW ? slow + (elapsed > STALLED ? 2 : 1) : Math.max(0, slow - 1);
        if (slow >= 6) {
            sand.thin(0.3);
        }
        if (slow >= 14) {
            hurry();
            return;
        }
        if (!released && time >= usable) {
            released = true;
            modal.style.pointerEvents = 'none';
            over.style.pointerEvents = 'none';
            release();
        }
        if (time >= done && (!alive || time >= done + 200)) {
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
    return { hurry, commit: () => start(loop) };
};

export default run;
