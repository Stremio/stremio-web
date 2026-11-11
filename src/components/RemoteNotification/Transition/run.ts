// Copyright (C) 2017-2026 Smart code 203358507

import type { Frame } from './freeze';
import type { Tier } from './quality';
import type { Box } from './paint';
import type { Layer, Motion } from './sand';
import paint from './paint';
import { CLASSES, createMasks, createNoise, createField, createLayer, thin, clip, veil, advance } from './sand';

const PRESS = 110;
const REBOUND = 90;
const CARD = 260;
const GAP = 380;
const WAVE = 780;
const HOLD = 2400;
const QUIET = 500;
const BRIEF = 2000;
const SKIP = 150;
const FADE = 240;
const AREA = 2300000;
const BUDGET = 8000;
const BUILD = 450;
const SLOW = 25;
const STALLED = 45;
const VORTEX: Motion = { gust: 1.25, lift: 0.07, spread: 0.5, inertia: 0.45, glow: 0.6, vortex: true };
const BLAST: Motion = { gust: 1.25, lift: 0.07, spread: 1, inertia: 1, glow: 1, vortex: false };
const SWALLOWED = ['keydown', 'keyup', 'pointerdown', 'pointerup', 'mousedown', 'mouseup', 'click', 'dblclick', 'contextmenu', 'touchstart', 'touchend', 'wheel'];
const SKIPPING = ['keydown', 'pointerdown', 'touchstart', 'wheel'];
const FOCUSABLE = '[tabindex]:not([tabindex="-1"]):not([data-focus-guard])';
const CANVAS = 'position:absolute;top:0;left:0;z-index:3;width:100%;height:100%;image-rendering:pixelated';

const pressed = () => Array.from(navigator.getGamepads?.() ?? []).some((gamepad) => gamepad?.buttons.some((button) => button.pressed));

const run = (frame: Frame, tier: Tier, keyboard: boolean, onEnd: () => void) => {
    const { live, root, board, backdrop, card, images, scrolled, origin, watcher, observer } = frame;
    const view = root.getBoundingClientRect();
    const zoom = view.width / root.offsetWidth || 1;
    const animations: Animation[] = [];
    const canvases: HTMLCanvasElement[] = [];
    let request = 0;
    let ended = false;
    let locked = true;
    let skipping = false;
    let held = pressed();

    const animate = (element: Element, keyframes: PropertyIndexedKeyframes, options: KeyframeAnimationOptions) => {
        const animation = element.animate(keyframes, options);
        animations.push(animation);
        return animation;
    };

    const visible = (element: Element) => {
        const rect = element.getBoundingClientRect();
        return rect.width > 0 && rect.bottom > view.top && rect.top < view.bottom && rect.right > view.left && rect.left < view.right;
    };

    const swallow = (event: Event) => {
        event.preventDefault();
        event.stopPropagation();
        if (SKIPPING.includes(event.type) && !(event instanceof KeyboardEvent && event.repeat)) {
            skip();
        }
    };

    const unlock = () => {
        if (!locked) {
            return;
        }

        locked = false;
        SWALLOWED.forEach((type) => window.removeEventListener(type, swallow, true));
        root.style.pointerEvents = 'none';
        if (keyboard) {
            Array.from(live.querySelectorAll<HTMLElement>(FOCUSABLE))
                .find((element) => element.closest('nav') === null && visible(element))
                ?.focus({ preventScroll: true });
        }
    };

    const end = () => {
        if (ended) {
            return;
        }

        ended = true;
        cancelAnimationFrame(request);
        observer.disconnect();
        unlock();
        window.removeEventListener('resize', end);
        document.removeEventListener('visibilitychange', end);
        animations.forEach((animation) => animation.cancel());
        canvases.forEach((canvas) => {
            canvas.width = 0;
            canvas.height = 0;
        });
        root.remove();
        onEnd();
    };

    const skip = () => {
        if (!skipping && !ended) {
            skipping = true;
            animate(root, { opacity: [1, 0] }, { duration: SKIP, easing: 'ease-out', fill: 'forwards' }).finished.then(end, end);
        }
    };

    SWALLOWED.forEach((type) => window.addEventListener(type, swallow, { capture: true, passive: false }));
    window.addEventListener('resize', end);
    document.addEventListener('visibilitychange', end);
    root.style.pointerEvents = 'auto';
    scrolled.forEach((element) => {
        element.scrollTop = 0;
    });

    if (tier === 'fade') {
        animate(root, { opacity: [1, 0] }, { duration: FADE, delay: 80, easing: 'ease', fill: 'forwards' }).finished.then(end, end);
        return end;
    }

    const ratio = window.devicePixelRatio || 1;
    let upscale = Math.max(1, Math.round(ratio));
    while (view.width * view.height * ratio * ratio / (upscale * upscale) > AREA) {
        upscale++;
    }

    const scale = ratio / upscale;
    const width = Math.round(view.width * scale);
    const height = Math.round(view.height * scale);
    const center = { x: origin.x * width, y: origin.y * height };
    const span = Math.hypot(Math.max(center.x, width - center.x), Math.max(center.y, height - center.y));
    const patch = Math.max(20, Math.min(48, Math.round(Math.sqrt(width * height * CLASSES / BUDGET))));
    const surfaces = [document.createElement('canvas'), document.createElement('canvas')];
    const [still, dust] = surfaces.map((canvas) => {
        canvas.width = width;
        canvas.height = height;
        canvas.style.cssText = CANVAS;
        canvases.push(canvas);
        return tier === 'sand' ? canvas.getContext('2d') : null;
    });
    const sandy = still !== null && dust !== null;
    const masks = sandy ? createMasks() : [];
    const noise = createNoise();
    const field = createField(width, height, span, noise);
    const unit = 1 / (scale * zoom);
    const started = performance.now();
    const deltas: number[] = [];
    const decoding = new Set<HTMLImageElement>();
    const decoded = new WeakSet<HTMLImageElement>();
    let cardLayer: Layer | null = null;
    let boardLayer: Layer | null = null;
    let calm = 0;
    let rebound = -1;
    let cardStart = -1;
    let boardStart = -1;
    let last = started;

    const layer = (element: HTMLElement, content: Element | null, region: Box, motion: Motion, duration: number, power: number) => {
        const within = new DOMRect(view.left + region.x / scale, view.top + region.y / scale, region.width / scale, region.height / scale);
        const painted = sandy ? paint(content ?? element, within, scale, zoom, images, true) : null;
        const ground = sandy && content !== null ? paint(element, within, scale, zoom, images, false).canvas : null;
        const result = createLayer({
            element,
            source: painted?.canvas ?? null,
            ground,
            region,
            marks: content !== null ? painted?.marks ?? null : null,
            origin: center,
            masks,
            noise,
            motion,
            patch,
            span,
            duration,
            power,
            unit,
        });
        [painted?.canvas, result.atlas, ground].forEach((canvas) => {
            if (canvas) {
                canvases.push(canvas);
            }
        });
        clip(result, 0);

        return result;
    };

    const builds: ((time: number) => void)[] = [
        () => {
            const rect = card.getBoundingClientRect();
            const x = Math.floor((rect.left - view.left) * scale);
            const y = Math.floor((rect.top - view.top) * scale);
            const result = layer(card, null, {
                x,
                y,
                width: Math.ceil((rect.right - view.left) * scale) - x,
                height: Math.ceil((rect.bottom - view.top) * scale) - y,
            }, VORTEX, CARD, 1.5);
            result.stages.forEach((stage) => stage());
            cardLayer = result;
            animate(card, { transform: ['scale(1)', 'scale(0.965)'] }, { duration: PRESS, easing: 'cubic-bezier(0.2, 0.7, 0.3, 1)', fill: 'forwards' });
        },
        () => {
            const result = layer(board, board.firstElementChild, { x: 0, y: 0, width, height }, BLAST, WAVE, 1.75);
            boardLayer = result;
            result.stages.forEach((stage, index) => {
                builds.push((time) => {
                    if (time - started > BUILD) {
                        builds.length = 0;
                        thin(result, index);
                    } else {
                        stage();
                    }
                    if (still !== null && result.atlas !== null) {
                        still.drawImage(result.atlas, 0, index * height, 1, 1, 0, 0, 1, 1);
                        still.clearRect(0, 0, 1, 1);
                    }
                });
            });
        },
    ];

    const settle = () => {
        live.getAnimations({ subtree: true }).forEach((animation) => {
            if (Number(animation.effect?.getComputedTiming().endTime) <= BRIEF) {
                animation.finish();
            }
        });
    };

    const ready = (time: number) => {
        if (!watcher.changed && time - started < QUIET) {
            return false;
        }

        let pending = false;
        live.querySelectorAll('img').forEach((image) => {
            if (decoded.has(image) || !visible(image)) {
                return;
            }

            pending = true;
            if (image.complete && !decoding.has(image)) {
                const done = () => {
                    decoded.add(image);
                    decoding.delete(image);
                };
                decoding.add(image);
                image.decode().then(done, done);
            }
        });
        return !pending;
    };

    const tick = (time: number) => {
        const delta = Math.min(0.034, Math.max(0, (time - last) / 1000));
        const build = builds.shift();
        const down = pressed();
        if (cardStart >= 0 && boardStart < 0) {
            deltas.push(time - last);
        }
        if (down && !held) {
            skip();
        }

        held = down;
        last = time;
        if (build !== undefined) {
            build(time);
            return;
        }
        if (cardLayer === null || boardLayer === null) {
            return;
        }
        if (rebound < 0) {
            still?.clearRect(0, 0, 1, 1);
            calm = watcher.changed && delta < 0.03 ? calm + 1 : 0;
            if (time - started < PRESS || (calm < 3 && time - started < QUIET)) {
                return;
            }

            rebound = time;
            settle();
            animate(card, { transform: [getComputedStyle(card).transform, 'scale(1)'] }, { duration: REBOUND, easing: 'cubic-bezier(0.3, 0, 0.2, 1)', fill: 'forwards' });
        }
        if (cardStart < 0) {
            if (time - rebound < REBOUND) {
                return;
            }

            cardStart = time;
            animate(backdrop, {
                backgroundColor: [getComputedStyle(backdrop).backgroundColor, 'rgba(0, 0, 0, 0)'],
            }, { duration: 200, easing: 'ease-out', fill: 'forwards' });
        }
        if (boardStart < 0 && time - cardStart >= (sandy ? GAP : CARD) && (ready(time) || time - cardStart >= HOLD)) {
            const pace = deltas.sort((a, b) => a - b)[deltas.length >> 1] ?? 0;
            boardStart = time;
            cardLayer.blast = time - cardStart;
            observer.disconnect();
            settle();
            if (pace > STALLED) {
                thin(boardLayer, 0);
            } else if (pace > SLOW) {
                thin(boardLayer, CLASSES / 2);
            }
        }

        field.update((time - started) / 1000);
        clip(cardLayer, time - cardStart);
        if (sandy) {
            still.clearRect(0, 0, width, height);
            dust.clearRect(0, 0, width, height);
            if (boardStart >= 0) {
                veil(boardLayer, still, time - boardStart);
            }

            advance(cardLayer, still, dust, field, time - cardStart, delta);
        }
        if (boardStart >= 0) {
            clip(boardLayer, time - boardStart);
            if (sandy) {
                advance(boardLayer, still, dust, field, time - boardStart, delta);
            }
            if (time - boardStart >= WAVE) {
                unlock();
                if (cardLayer.head === cardLayer.count && boardLayer.head === boardLayer.count) {
                    end();
                }
            }
        }
    };

    const loop = (time: number) => {
        request = requestAnimationFrame(loop);
        try {
            tick(time);
        } catch (_error) {
            end();
        }
    };

    if (sandy) {
        surfaces[1].style.mixBlendMode = 'screen';
        root.append(...surfaces);
    }

    request = requestAnimationFrame(loop);
    return end;
};

export default run;
