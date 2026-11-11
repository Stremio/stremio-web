// Copyright (C) 2017-2026 Smart code 203358507

import type { Stage } from './freeze';
import type { Tier } from './quality';
import type { Source } from './lock';
import type { Hero } from './plan';
import type { Box } from './paint';
import paint, { warm } from './paint';
import createSpring from './spring';
import { createPlan, findHero } from './plan';
import { createNoise, createField, createSand } from './sand';

type Options = {
    stage: Stage,
    tier: Tier,
    keyboard: boolean,
    pressed: number,
    dispose: (disposer: () => void) => void,
    release: () => void,
    finish: () => boolean,
};

type Rect = { left: number, top: number, width: number, height: number };

const WAVE = 560;
const LEAD = 1.6;
const HERO_CAP = 800;
const SCRIM = 260;
const RISE = 12;
const STAGGER = 55;
const ENTRANCE = 420;
const HURRY = 150;
const FADE = 240;
const WIPE = 400;
const AREA = 2300000;
const BUDGET = 9000;
const GRAIN = 4;
const POINTS = 56;
const MARGIN = 24;
const SLOW = 28;
const STALLED = 50;
const EASE = 'cubic-bezier(0.2, 0.7, 0.2, 1)';
const OUTER = 'M-99999 -99999H99999V99999H-99999Z';
const HERO = 'section[aria-roledescription="carousel"]';
const ROWS = '[class*="board-row-"]';
const TILE = createSpring(430, 0.86);
const OPEN = createSpring(520, 1);

const smooth = (value: number) => {
    const t = Math.max(0, Math.min(1, value));
    return t * t * (3 - 2 * t);
};

const unsmooth = (value: number) => 0.5 - Math.sin(Math.asin(1 - 2 * Math.max(0, Math.min(1, value))) / 3);

const run = ({ stage, tier, keyboard, pressed, dispose, release, finish }: Options) => {
    const { live, modal, card, button, under, over, sheet, copy, images, scrolled, view, zoom, origin } = stage;
    const animations: Animation[] = [];
    const span = Math.hypot(Math.max(origin.x, view.width - origin.x), Math.max(origin.y, view.height - origin.y));
    const phases = [Math.random() * 6.28, Math.random() * 6.28, Math.random() * 6.28];
    const far = span / 0.9;
    let request = 0;
    let ended = false;
    let hurried: Source | null = null;
    let hero: Hero | null = null;
    let decoded = false;
    let decoding = false;

    const animate = (element: Element, keyframes: Keyframe[] | PropertyIndexedKeyframes, options: KeyframeAnimationOptions) => {
        const animation = element.animate(keyframes, options);
        animations.push(animation);
        return animation;
    };

    const local = (rect: DOMRect | Rect): Rect => ({ left: rect.left - view.left, top: rect.top - view.top, width: rect.width, height: rect.height });
    const wobble = (angle: number) => 1 + 0.045 * Math.sin(3 * angle + phases[0]) + 0.03 * Math.sin(5 * angle + phases[1]) + 0.02 * Math.sin(9 * angle + phases[2]);
    const reach = (x: number, y: number) => Math.hypot(x - origin.x, y - origin.y) / wobble(Math.atan2(y - origin.y, x - origin.x));
    const nearest = ({ left, top, width, height }: Rect) => reach(Math.max(left, Math.min(origin.x, left + width)), Math.max(top, Math.min(origin.y, top + height)));
    const farthest = ({ left, top, width, height }: Rect) => Math.max(reach(left, top), reach(left + width, top), reach(left, top + height), reach(left + width, top + height));
    const radiusAt = (time: number) => far * smooth(time / WAVE);
    const timeAt = (distance: number) => WAVE * unsmooth(distance / far);

    const hole = (radius: number, offset: Rect) => {
        let path = '';
        for (let point = 0; point < POINTS; point++) {
            const angle = point / POINTS * Math.PI * 2;
            const length = radius * wobble(angle);
            const x = ((origin.x + Math.cos(angle) * length - offset.left) / zoom).toFixed(1);
            const y = ((origin.y + Math.sin(angle) * length - offset.top) / zoom).toFixed(1);
            path += `${point === 0 ? 'M' : 'L'}${x} ${y}`;
        }

        return `${path}Z`;
    };

    const ready = () => {
        const section = live.querySelector<HTMLElement>(HERO);
        const image = section?.querySelector('img') ?? null;
        if (section === null) {
            return false;
        }
        if (image !== null && !decoded && !decoding) {
            const settle = () => {
                decoded = true;
            };
            decoding = true;
            image.decode().then(settle, settle);
        }

        return image === null || decoded;
    };

    const complete = () => {
        if (ended) {
            return;
        }

        ended = true;
        const target = keyboard || hurried === 'keys' ? (hero ?? findHero(live))?.watch ?? null : null;
        let attempts = 0;
        const focus = () => {
            if (modal.isConnected && attempts++ < 30) {
                requestAnimationFrame(focus);
            } else if (target !== null && target.isConnected) {
                target.focus({ preventScroll: true });
            }
        };

        if (finish() && target !== null) {
            requestAnimationFrame(focus);
        }
    };

    const hurry = (source: Source) => {
        if (ended || hurried !== null) {
            return;
        }

        hurried = source;
        animations.forEach((animation) => animation.updatePlaybackRate(8));
        [under, over, card].forEach((element) => animate(element, { opacity: 0 }, { duration: HURRY, easing: 'ease-out', fill: 'forwards' }));
        window.setTimeout(complete, HURRY);
    };

    dispose(() => {
        cancelAnimationFrame(request);
        window.removeEventListener('resize', complete);
        document.removeEventListener('visibilitychange', complete);
        animations.forEach((animation) => animation.cancel());
    });
    dispose(() => {
        modal.style.visibility = 'hidden';
    });
    window.addEventListener('resize', complete);
    document.addEventListener('visibilitychange', complete);
    scrolled.forEach((element) => {
        element.scrollTop = 0;
    });

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
            const x = `${(origin.x / zoom).toFixed(1)}px`;
            const y = `${(origin.y / zoom).toFixed(1)}px`;
            const frames = { clipPath: [`circle(0px at ${x} ${y})`, `circle(${Math.ceil(span / zoom)}px at ${x} ${y})`] };
            cover.style.cssText = sheet.style.cssText;
            under.appendChild(cover);
            live.before(under);
            animate(card, { opacity: 0 }, { duration: HURRY, easing: 'ease-out', fill: 'forwards' });
            animate(cover, frames, { duration: WIPE, easing: EASE, fill: 'both' });
            animate(live, frames, { duration: WIPE, easing: EASE, fill: 'both' });
            window.setTimeout(complete, WIPE);
        };

        request = requestAnimationFrame(settle);
        return hurry;
    }

    const ratio = window.devicePixelRatio || 1;
    let upscale = Math.max(1, Math.round(ratio));
    while (view.width * view.height * ratio * ratio / (upscale * upscale) > AREA) {
        upscale++;
    }

    const scale = ratio / upscale;
    const width = Math.round(view.width * scale);
    const height = Math.round(view.height * scale);
    const grain = Math.max(3, Math.round(GRAIN * scale));
    const dot = document.createElement('canvas');
    const canvas = document.createElement('canvas');
    const context = canvas.getContext('2d')!;
    const noise = createNoise();
    const field = createField(width, height, span * scale, noise);
    const sands: { sand: ReturnType<typeof createSand>, lead: number }[] = [];
    const cardRect = local(card.getBoundingClientRect());
    const peek = card.querySelector<HTMLElement>('[data-hero-origin]');
    const peekRect = peek !== null ? local(peek.getBoundingClientRect()) : null;
    const cardEnd = farthest(cardRect) + 4;
    const hold = peekRect !== null ? Math.max(0, nearest(peekRect) - 6) : cardEnd;
    const radii = getComputedStyle(card);
    const corner = (value: string) => Math.min(parseFloat(value) || 0, cardRect.width / zoom / 2, cardRect.height / zoom / 2).toFixed(1);
    const [topLeft, topRight, bottomRight, bottomLeft] = [radii.borderTopLeftRadius, radii.borderTopRightRadius, radii.borderBottomRightRadius, radii.borderBottomLeftRadius].map(corner);
    const boxWidth = (cardRect.width / zoom).toFixed(1);
    const boxHeight = (cardRect.height / zoom).toFixed(1);
    const outline = `M${topLeft} 0H${Number(boxWidth) - Number(topRight)}A${topRight} ${topRight} 0 0 1 ${boxWidth} ${topRight}V${Number(boxHeight) - Number(bottomRight)}A${bottomRight} ${bottomRight} 0 0 1 ${Number(boxWidth) - Number(bottomRight)} ${boxHeight}H${bottomLeft}A${bottomLeft} ${bottomLeft} 0 0 1 0 ${Number(boxHeight) - Number(bottomLeft)}V${topLeft}A${topLeft} ${topLeft} 0 0 1 ${topLeft} 0Z`;
    const inset = { top: 0, right: 0, bottom: 0, left: 0 };
    let last = performance.now();
    let wave = 0;
    let gone = -1;
    let usable = Infinity;
    let done = Infinity;
    let slow = 0;
    let leaving = 0;
    let cardGone = false;
    let released = false;

    const sandbox = (region: Rect): Box => {
        const x = Math.max(0, Math.floor(region.left * scale));
        const y = Math.max(0, Math.floor(region.top * scale));
        return {
            x,
            y,
            width: Math.min(width, Math.ceil((region.left + region.width) * scale)) - x,
            height: Math.min(height, Math.ceil((region.top + region.height) * scale)) - y,
        };
    };

    const pour = (elements: Element[], region: Box, keep: Rect | null, budget: number, lead: number) => {
        if (region.width <= 0 || region.height <= 0) {
            return;
        }

        const area = new DOMRect(view.left + region.x / scale, view.top + region.y / scale, region.width / scale, region.height / scale);
        const painted = paint(elements, area, scale, zoom, images);
        const kept = keep !== null ? [{ x: keep.left * scale - region.x, y: keep.top * scale - region.y, width: keep.width * scale, height: keep.height * scale }] : [];
        const surface = painted.canvas.getContext('2d');
        const pattern = surface?.createPattern(dot, 'repeat') ?? null;
        if (surface !== null && pattern !== null) {
            surface.globalCompositeOperation = 'destination-in';
            surface.fillStyle = pattern;
            surface.fillRect(0, 0, region.width, region.height);
        }

        dispose(() => {
            painted.canvas.width = 0;
            painted.canvas.height = 0;
        });
        sands.push({
            lead,
            sand: createSand({
                materials: [{
                    canvas: painted.canvas,
                    region,
                    marks: painted.marks.filter((mark) => !kept.some((box) => mark.x < box.x + 3 && mark.y < box.y + 3 && mark.x + mark.width > box.x + box.width - 3 && mark.y + mark.height > box.y + box.height - 3)),
                    keep: kept,
                }],
                origin: { x: origin.x * scale, y: origin.y * scale },
                span: span * scale,
                grain,
                budget,
                reach: (x, y) => reach(x / scale, y / scale) * scale,
            }),
        });
    };

    const travel = (element: HTMLElement, from: Rect, to: Rect, tall: number) => {
        const inside = (rect: Rect) => rect.top + rect.height > 0 && rect.top < tall;
        const clamp = (rect: Rect, other: Rect) => {
            if (inside(rect)) {
                return rect.top;
            }

            return rect.top > other.top ? Math.min(rect.top, tall + MARGIN) : Math.max(rect.top, -rect.height - MARGIN);
        };
        const startX = from.left - to.left;
        const startY = clamp(from, to) - to.top;
        const endY = clamp(to, from) - to.top;
        const scaleX = to.width > 0 ? from.width / to.width : 1;
        const scaleY = to.height > 0 ? from.height / to.height : 1;
        const sized = Math.abs(scaleX - 1) > 0.01 || Math.abs(scaleY - 1) > 0.01;
        if (Math.abs(startX) < 0.5 && Math.abs(startY - endY) < 0.5 && !sized) {
            return null;
        }

        const anchor = inside(from) ? from : to;
        const delay = Math.max(0, timeAt(reach(anchor.left + anchor.width / 2, Math.max(0, Math.min(tall, anchor.top + anchor.height / 2)))) - wave);
        animate(element, TILE.left.map((left) => ({
            transformOrigin: '0 0',
            transform: `translate(${(startX * left / zoom).toFixed(2)}px, ${((endY + (startY - endY) * left) / zoom).toFixed(2)}px)${sized ? ` scale(${(1 + (scaleX - 1) * left).toFixed(4)}, ${(1 + (scaleY - 1) * left).toFixed(4)})` : ''}`,
        })), { duration: TILE.duration, delay, easing: 'linear', fill: 'backwards' });
        return delay;
    };

    const open = (art: HTMLElement, from: Rect, radius: number, delay: number) => {
        const to = local(art.getBoundingClientRect());
        animate(art, OPEN.left.map((left) => {
            const frame = {
                left: to.left + (from.left - to.left) * left,
                top: to.top + (from.top - to.top) * left,
                width: to.width + (from.width - to.width) * left,
                height: to.height + (from.height - to.height) * left,
            };
            const size = Math.max(frame.width / to.width, frame.height / to.height);
            const x = frame.left + frame.width / 2 - to.width * size / 2 - to.left;
            const y = frame.top + frame.height / 2 - to.height * size / 2 - to.top;
            const cutLeft = (frame.left - to.left - x) / size;
            const cutTop = (frame.top - to.top - y) / size;
            const cutRight = to.width - cutLeft - frame.width / size;
            const cutBottom = to.height - cutTop - frame.height / size;
            return {
                transformOrigin: '0 0',
                transform: `translate(${(x / zoom).toFixed(2)}px, ${(y / zoom).toFixed(2)}px) scale(${size.toFixed(4)})`,
                clipPath: `inset(${(cutTop / zoom).toFixed(2)}px ${(cutRight / zoom).toFixed(2)}px ${(cutBottom / zoom).toFixed(2)}px ${(cutLeft / zoom).toFixed(2)}px round ${(radius * left / size).toFixed(2)}px)`,
            };
        }), { duration: OPEN.duration, delay, easing: 'linear', fill: 'backwards' });
    };

    const arrive = (element: Element, delay: number) => (
        animate(element, [{ opacity: 0, transform: `translateY(${RISE}px)` }, {}], { duration: ENTRANCE, delay, easing: EASE, fill: 'backwards' })
    );

    const go = (time: number) => {
        gone = time;
        hero = findHero(live);
        live.querySelectorAll(ROWS).forEach((row) => {
            row.getAnimations().forEach((animation) => {
                if (animation instanceof CSSAnimation) {
                    animation.finish();
                }
            });
        });

        const plan = createPlan(copy, live, view, hero?.id ?? null);
        const slide = hero !== null && hero.content.length > 0 ? local(hero.content[0].parentElement!.getBoundingClientRect()) : null;
        let settled = 0;
        let clear = 0;
        sheet.style.visibility = 'hidden';
        plan.leaving.forEach(({ element }) => {
            element.style.visibility = 'visible';
        });
        plan.moves.forEach(({ element, from, to }) => {
            const start = local(from);
            const delay = travel(element, start, local(to), view.height);
            if (delay === null) {
                return;
            }

            settled = Math.max(settled, delay + TILE.duration * 0.6);
            if (slide !== null && start.top < slide.top + slide.height && start.top + start.height > slide.top && start.left < slide.left + slide.width && start.left + start.width > slide.left) {
                clear = Math.max(clear, delay + TILE.duration * 0.3);
            }
        });
        plan.entering.forEach(({ element, rect }) => {
            const area = local(rect);
            const delay = Math.max(0, timeAt(reach(area.left + area.width / 2, area.top + area.height / 2)) - wave) + 120;
            arrive(element, delay);
            settled = Math.max(settled, delay + ENTRANCE * 0.7);
        });
        if (plan.leaving.length > 0) {
            leaving = Math.max(...plan.leaving.map(({ rect }) => farthest(local(rect)))) + 4;
            pour(plan.leaving.map(({ element }) => element), { x: 0, y: 0, width, height }, null, BUDGET * 0.6, 1);
        }
        if (hero !== null) {
            const source = peekRect ?? (plan.poster !== null ? local(plan.poster.rect) : local(button.getBoundingClientRect()));
            const start = Math.max(0, timeAt(peekRect !== null ? (nearest(source) + (farthest(source) - nearest(source)) * 0.6) / LEAD : nearest(source)) - wave);
            let text = Math.max(start + 200, clear);
            if (hero.art !== null) {
                open(hero.art, source, peekRect !== null ? parseFloat(radii.borderTopLeftRadius) * zoom : 10 * zoom, start);
                settled = Math.max(settled, start + OPEN.duration * 0.6);
            }
            if (peekRect === null && plan.poster !== null) {
                const ghost = plan.poster.element.cloneNode(false) as HTMLElement;
                const style = getComputedStyle(plan.poster.element);
                ghost.style.cssText = `position:absolute;left:${source.left / zoom}px;top:${source.top / zoom}px;width:${source.width / zoom}px;height:${source.height / zoom}px;object-fit:${style.objectFit};border-radius:${style.borderRadius};visibility:visible`;
                under.appendChild(ghost);
                animate(ghost, { opacity: [1, 0], transform: ['scale(1)', 'scale(1.12)'] }, { duration: 240, delay: start, easing: 'ease-out', fill: 'both' });
            }

            hero.content.forEach((part) => {
                arrive(part, text);
                text += STAGGER;
            });
            settled = Math.max(settled, text + ENTRANCE * 0.5);
        }

        usable = time + Math.max(settled, WAVE * 0.8);
        done = usable + 220;
    };

    const tick = (time: number) => {
        const delta = Math.min(0.034, Math.max(0, (time - last) / 1000));
        const elapsed = time - last;
        last = time;
        if (hurried !== null) {
            return;
        }
        if (gone < 0 && (ready() || time - pressed >= HERO_CAP)) {
            go(time);
        }

        wave = gone >= 0 || radiusAt(wave + delta * 1000) * LEAD <= hold ? wave + delta * 1000 : Math.max(wave, timeAt(hold / LEAD));
        const radius = radiusAt(wave);
        if (!cardGone) {
            if (radius * LEAD >= cardEnd) {
                cardGone = true;
                card.style.visibility = 'hidden';
            } else {
                card.style.clipPath = `path(evenodd, "${outline}${hole(radius * LEAD, cardRect)}")`;
            }
        }
        if (gone >= 0 && leaving > 0) {
            if (radius >= leaving) {
                leaving = 0;
                under.style.visibility = 'hidden';
            } else {
                sheet.style.clipPath = `path(evenodd, "${OUTER}${hole(radius, { left: 0, top: 0, width: 0, height: 0 })}")`;
            }
        }

        field.update(time / 1000);
        context.clearRect(0, 0, width, height);
        const alive = sands.map(({ sand, lead }) => sand.advance(context, field, radius * lead * scale, delta)).some(Boolean);
        if (gone >= 0) {
            slow = elapsed > SLOW ? slow + (elapsed > STALLED ? 2 : 1) : Math.max(0, slow - 1);
            if (slow >= 6) {
                sands.forEach(({ sand }) => sand.thin(0.3));
            }
            if (slow >= 14) {
                hurry('pointer');
                return;
            }
        }
        if (!released && time >= usable) {
            released = true;
            modal.style.pointerEvents = 'none';
            over.style.pointerEvents = 'none';
            release();
        }
        if (time >= done && (!alive || time >= done + 500)) {
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

    live.querySelectorAll('nav').forEach((nav) => {
        const rect = local(nav.getBoundingClientRect());
        if (rect.width >= view.width * 0.6 && rect.height > 0) {
            if (rect.top < view.height / 2) {
                inset.top = Math.max(inset.top, rect.top + rect.height);
            } else {
                inset.bottom = Math.max(inset.bottom, view.height - rect.top);
            }
        } else if (rect.height >= view.height * 0.6 && rect.width > 0) {
            if (rect.left < view.width / 2) {
                inset.left = Math.max(inset.left, rect.left + rect.width);
            } else {
                inset.right = Math.max(inset.right, view.width - rect.left);
            }
        }
    });
    dot.width = grain;
    dot.height = grain;
    dot.getContext('2d')?.arc(grain / 2, grain / 2, grain / 2, 0, Math.PI * 2);
    dot.getContext('2d')?.fill();
    canvas.width = width;
    canvas.height = height;
    canvas.style.cssText = `position:absolute;top:0;left:0;width:100%;height:100%;image-rendering:pixelated;clip-path:inset(${inset.top / zoom}px ${inset.right / zoom}px ${inset.bottom / zoom}px ${inset.left / zoom}px)`;
    context.imageSmoothingEnabled = false;
    over.appendChild(canvas);
    dispose(() => {
        canvas.width = 0;
        canvas.height = 0;
    });
    warm(copy);
    lift(SCRIM);
    pour([card], sandbox(cardRect), peekRect, BUDGET, LEAD);
    request = requestAnimationFrame(loop);
    return hurry;
};

export default run;
