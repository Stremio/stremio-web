// Copyright (C) 2017-2026 Smart code 203358507

import type { Box } from './paint';

type Point = { x: number, y: number };

type Noise = (x: number, y: number, z: number) => number;

type Motion = {
    gust: number,
    lift: number,
    spread: number,
    inertia: number,
    glow: number,
    vortex: boolean,
};

type Field = {
    cell: number,
    columns: number,
    rows: number,
    u: Float32Array,
    v: Float32Array,
    update: (seconds: number) => void,
};

type Options = {
    element: HTMLElement,
    source: HTMLCanvasElement | null,
    ground: HTMLCanvasElement | null,
    region: Box,
    marks: Box[] | null,
    origin: Point,
    masks: HTMLCanvasElement[],
    noise: Noise,
    motion: Motion,
    patch: number,
    span: number,
    duration: number,
    power: number,
    unit: number,
};

type Layer = ReturnType<typeof createLayer>;

const CLASSES = 6;
const TILE = 128;
const GRID = 8;
const FEATHER = 0.11;
const TURN = Math.PI * 2;
const OUTER = 'M-9999 -9999H19999V19999H-9999Z';
const FLYING = 1;
const DEAD = 2;

const createMasks = () => {
    const classes = new Uint8Array(TILE * TILE);
    [2, 1].forEach((size) => {
        for (let y = 0; y < TILE; y += size) {
            for (let x = 0; x < TILE; x += size) {
                if (size === 2 || Math.random() < 0.5) {
                    const value = Math.floor(Math.random() * CLASSES);
                    for (let row = y; row < y + size; row++) {
                        classes.fill(value, row * TILE + x, row * TILE + x + size);
                    }
                }
            }
        }
    });

    return Array.from({ length: CLASSES }, (_, index) => {
        const canvas = document.createElement('canvas');
        canvas.width = TILE;
        canvas.height = TILE;
        const context = canvas.getContext('2d')!;
        const image = context.createImageData(TILE, TILE);
        classes.forEach((value, pixel) => {
            if (value === index) {
                image.data[pixel * 4 + 3] = 255;
            }
        });
        context.putImageData(image, 0, 0);
        return canvas;
    });
};

const createNoise = (): Noise => {
    const table = new Uint8Array(512);
    const order = Array.from({ length: 256 }, (_, index) => index);
    for (let index = 255; index > 0; index--) {
        const swap = Math.floor(Math.random() * (index + 1));
        [order[index], order[swap]] = [order[swap], order[index]];
    }
    for (let index = 0; index < 512; index++) {
        table[index] = order[index & 255];
    }

    const ease = (t: number) => t * t * t * (t * (t * 6 - 15) + 10);
    const mix = (a: number, b: number, t: number) => a + (b - a) * t;
    const grad = (hash: number, x: number, y: number, z: number) => {
        const h = hash & 15;
        const a = h < 8 ? x : y;
        let b = z;
        if (h < 4) {
            b = y;
        } else if (h === 12 || h === 14) {
            b = x;
        }

        return ((h & 1) === 0 ? a : -a) + ((h & 2) === 0 ? b : -b);
    };

    return (px, py, pz) => {
        const cx = Math.floor(px) & 255;
        const cy = Math.floor(py) & 255;
        const cz = Math.floor(pz) & 255;
        const x = px - Math.floor(px);
        const y = py - Math.floor(py);
        const z = pz - Math.floor(pz);
        const u = ease(x);
        const v = ease(y);
        const w = ease(z);
        const a = table[cx] + cy;
        const b = table[cx + 1] + cy;
        const aa = table[a] + cz;
        const ab = table[a + 1] + cz;
        const ba = table[b] + cz;
        const bb = table[b + 1] + cz;
        return mix(
            mix(
                mix(grad(table[aa], x, y, z), grad(table[ba], x - 1, y, z), u),
                mix(grad(table[ab], x, y - 1, z), grad(table[bb], x - 1, y - 1, z), u),
                v
            ),
            mix(
                mix(grad(table[aa + 1], x, y, z - 1), grad(table[ba + 1], x - 1, y, z - 1), u),
                mix(grad(table[ab + 1], x, y - 1, z - 1), grad(table[bb + 1], x - 1, y - 1, z - 1), u),
                v
            ),
            w
        );
    };
};

const createField = (width: number, height: number, span: number, noise: Noise): Field => {
    const cell = Math.max(12, span / 22);
    const columns = Math.ceil(width / cell) + 3;
    const rows = Math.ceil(height / cell) + 3;
    const potential = new Float32Array(columns * rows);
    const u = new Float32Array(columns * rows);
    const v = new Float32Array(columns * rows);
    const frequency = 3.4 / span;
    const gain = 0.17 * span / (2 * cell * frequency);

    const update = (seconds: number) => {
        for (let row = 0; row < rows; row++) {
            for (let column = 0; column < columns; column++) {
                const x = (column - 1) * cell * frequency;
                const y = (row - 1) * cell * frequency;
                potential[row * columns + column] =
                    noise(x, y, seconds * 0.6) +
                    0.5 * noise(x * 2.1 + 31.4, y * 2.1 + 12.7, seconds * 0.95);
            }
        }
        for (let row = 1; row < rows - 1; row++) {
            for (let column = 1; column < columns - 1; column++) {
                const index = row * columns + column;
                u[index] = (potential[index + columns] - potential[index - columns]) * gain;
                v[index] = (potential[index - 1] - potential[index + 1]) * gain;
            }
        }
    };

    return { cell, columns, rows, u, v, update };
};

const createAtlas = (source: HTMLCanvasElement, region: Box, masks: HTMLCanvasElement[]) => {
    const canvas = document.createElement('canvas');
    canvas.width = region.width;
    canvas.height = region.height * masks.length;
    const context = canvas.getContext('2d')!;
    const stages = masks.map((mask, index) => () => {
        const top = index * region.height;
        const pattern = context.createPattern(mask, 'repeat');
        if (pattern === null) {
            return;
        }

        context.save();
        context.beginPath();
        context.rect(0, top, region.width, region.height);
        context.clip();
        context.drawImage(source, 0, 0, region.width, region.height, 0, top, region.width, region.height);
        context.globalCompositeOperation = 'destination-in';
        context.fillStyle = pattern;
        context.fillRect(0, top, region.width, region.height);
        context.restore();
    });

    return { canvas, stages };
};

const createContent = (region: Box, marks: Box[] | null) => {
    if (marks === null) {
        return () => true;
    }

    const columns = Math.ceil(region.width / GRID);
    const rows = Math.ceil(region.height / GRID);
    const grid = new Uint8Array(columns * rows);
    marks.forEach((mark) => {
        const left = Math.max(0, Math.floor(mark.x / GRID));
        const top = Math.max(0, Math.floor(mark.y / GRID));
        const right = Math.min(columns - 1, Math.floor((mark.x + mark.width) / GRID));
        const bottom = Math.min(rows - 1, Math.floor((mark.y + mark.height) / GRID));
        for (let row = top; row <= bottom; row++) {
            grid.fill(1, row * columns + left, row * columns + right + 1);
        }
    });

    return (x: number, y: number, width: number, height: number) => {
        for (let point = 0; point < 9; point++) {
            const column = Math.min(columns - 1, Math.floor((x + width * (point % 3) / 2) / GRID));
            const row = Math.min(rows - 1, Math.floor((y + height * Math.floor(point / 3) / 2) / GRID));
            if (grid[row * columns + column] === 1) {
                return true;
            }
        }

        return false;
    };
};

const createLayer = ({ element, source, ground, region, marks, origin, masks, noise, motion, patch, span, duration, power, unit }: Options) => {
    const reach = (ground !== null ? span * FEATHER : 0) + 1.03 * Math.max(
        Math.hypot(region.x - origin.x, region.y - origin.y),
        Math.hypot(region.x + region.width - origin.x, region.y - origin.y),
        Math.hypot(region.x - origin.x, region.y + region.height - origin.y),
        Math.hypot(region.x + region.width - origin.x, region.y + region.height - origin.y)
    );
    const timeAt = (distance: number) => duration * (1 - Math.pow(1 - Math.max(0, Math.min(1, distance / reach)), 1 / power));
    const content = createContent(region, marks);
    const items: number[][] = [];
    if (source !== null) {
        for (let index = 0; index < CLASSES; index++) {
            const shiftX = -Math.floor(Math.random() * patch);
            const shiftY = -Math.floor(Math.random() * patch);
            for (let cellY = shiftY; cellY < region.height; cellY += patch) {
                for (let cellX = shiftX; cellX < region.width; cellX += patch) {
                    const left = Math.max(0, cellX);
                    const top = Math.max(0, cellY);
                    const width = Math.min(region.width, cellX + patch) - left;
                    const height = Math.min(region.height, cellY + patch) - top;
                    if (width <= 0 || height <= 0 || !content(left, top, width, height)) {
                        continue;
                    }

                    const distance = Math.hypot(region.x + left + width / 2 - origin.x, region.y + top + height / 2 - origin.y);
                    const finger = Math.max(0, Math.min(1, 0.5 + 0.8 * noise((region.x + left) * 5 / span, (region.y + top) * 5 / span, 9.7)));
                    const speed = span * 0.06 * Math.random();
                    const heading = Math.random() * TURN;
                    items.push([
                        timeAt(distance - patch * 0.75 - 2),
                        timeAt(distance) + (20 + 80 * finger + 11 * index + 8 * Math.random()) * motion.spread,
                        300 + 380 * Math.random(),
                        left,
                        top + index * region.height,
                        width,
                        height,
                        region.x + left,
                        region.y + top,
                        Math.cos(heading) * speed,
                        Math.sin(heading) * speed,
                        (0.05 + 0.25 * Math.pow(Math.random(), 2)) * motion.inertia,
                        (0.6 + 0.8 * Math.random()) * (1 - 0.45 * Math.min(1, distance / reach)),
                        index,
                    ]);
                }
            }
        }
    }

    items.sort((a, b) => a[0] - b[0]);
    const count = items.length;
    const column = (index: number) => Float32Array.from(items, (item) => item[index]);
    const atlas = source !== null ? createAtlas(source, region, masks) : null;

    return {
        element,
        atlas: atlas?.canvas ?? null,
        stages: atlas?.stages ?? [],
        ground,
        origin,
        offset: { x: region.x, y: region.y },
        unit,
        reach,
        duration,
        power,
        span,
        motion,
        start: -1,
        blast: Infinity,
        gone: false,
        count,
        head: 0,
        tail: 0,
        show: column(0),
        release: column(1),
        life: column(2),
        sourceX: column(3),
        sourceY: column(4),
        width: column(5),
        height: column(6),
        homeX: column(7),
        homeY: column(8),
        velocityX: column(9),
        velocityY: column(10),
        tau: column(11),
        reply: column(12),
        kind: Uint8Array.from(items, (item) => item[13]),
        x: new Float32Array(count),
        y: new Float32Array(count),
        state: new Uint8Array(count),
    };
};

const radiusAt = (layer: Layer, elapsed: number) => (
    layer.reach * (1 - Math.pow(1 - Math.max(0, Math.min(1, elapsed / layer.duration)), layer.power))
);

const thin = (layer: Layer, keep: number) => {
    for (let index = 0; index < layer.count; index++) {
        if (layer.kind[index] >= keep) {
            layer.state[index] = DEAD;
        }
    }
};

const clip = (layer: Layer, elapsed: number) => {
    if (layer.gone) {
        return;
    }
    if (elapsed >= layer.duration) {
        layer.gone = true;
        layer.element.style.visibility = 'hidden';
        return;
    }

    const { origin, offset, unit } = layer;
    const radius = Number((radiusAt(layer, elapsed) * unit).toFixed(1));
    const x = ((origin.x - offset.x) * unit - radius).toFixed(1);
    const y = ((origin.y - offset.y) * unit).toFixed(1);
    layer.element.style.clipPath = `path(evenodd, "${OUTER}M${x} ${y}a${radius} ${radius} 0 1 0 ${radius * 2} 0a${radius} ${radius} 0 1 0 ${-radius * 2} 0Z")`;
};

const veil = (layer: Layer, still: CanvasRenderingContext2D, elapsed: number) => {
    const { ground, origin, span } = layer;
    if (ground === null || layer.gone) {
        return;
    }

    const radius = Math.max(1, radiusAt(layer, elapsed));
    const gradient = still.createRadialGradient(origin.x, origin.y, Math.max(0, radius - span * FEATHER), origin.x, origin.y, radius);
    gradient.addColorStop(0, 'rgba(0, 0, 0, 0)');
    gradient.addColorStop(1, 'rgb(0, 0, 0)');
    still.fillStyle = gradient;
    still.beginPath();
    still.arc(origin.x, origin.y, radius + 2, 0, TURN);
    still.fill();
    still.globalCompositeOperation = 'source-in';
    still.drawImage(ground, 0, 0);
    still.globalCompositeOperation = 'source-over';
};

const advance = (layer: Layer, still: CanvasRenderingContext2D, dust: CanvasRenderingContext2D, field: Field, elapsed: number, delta: number) => {
    const { atlas, state, release, life, sourceX, sourceY, width, height, homeX, homeY, velocityX, velocityY, tau, reply, x, y, origin, span, motion } = layer;
    const { cell, columns, rows, u, v } = field;
    if (atlas === null) {
        return;
    }

    while (layer.tail < layer.count && layer.show[layer.tail] <= elapsed) {
        layer.tail++;
    }
    while (layer.head < layer.tail && state[layer.head] === DEAD) {
        layer.head++;
    }

    const lift = span * motion.lift;
    const gust = span * motion.gust;
    const swirl = span * 0.42;
    dust.globalCompositeOperation = motion.vortex ? 'lighter' : 'source-over';
    for (let index = layer.head; index < layer.tail; index++) {
        if (state[index] === DEAD) {
            continue;
        }

        const age = elapsed - release[index];
        if (age < 0) {
            still.drawImage(atlas, sourceX[index], sourceY[index], width[index], height[index], homeX[index], homeY[index], width[index], height[index]);
            continue;
        }

        const since = motion.vortex ? Math.min(age, elapsed - layer.blast) : age;
        if (since >= life[index]) {
            state[index] = DEAD;
            continue;
        }

        const step = state[index] === FLYING ? delta : Math.min(delta, age / 1000);
        state[index] = FLYING;
        const halfX = width[index] / 2;
        const halfY = height[index] / 2;
        const centerX = homeX[index] + x[index] + halfX;
        const centerY = homeY[index] + y[index] + halfY;
        const gridX = Math.min(columns - 2.001, Math.max(1, centerX / cell + 1));
        const gridY = Math.min(rows - 2.001, Math.max(1, centerY / cell + 1));
        const cornerX = gridX | 0;
        const cornerY = gridY | 0;
        const blendX = gridX - cornerX;
        const blendY = gridY - cornerY;
        const node = cornerY * columns + cornerX;
        const flowX = (u[node] * (1 - blendX) + u[node + 1] * blendX) * (1 - blendY) + (u[node + columns] * (1 - blendX) + u[node + columns + 1] * blendX) * blendY;
        const flowY = (v[node] * (1 - blendX) + v[node + 1] * blendX) * (1 - blendY) + (v[node + columns] * (1 - blendX) + v[node + columns + 1] * blendX) * blendY;
        const offsetX = centerX - origin.x;
        const offsetY = centerY - origin.y;
        const away = Math.hypot(offsetX, offsetY) || 1;
        const awayX = offsetX / away;
        const awayY = offsetY / away;
        let targetX = flowX;
        let targetY = flowY - lift;
        if (since < 0) {
            const pull = Math.max(-span * 1.1, (span * (0.015 + 0.05 * (index * 0.618 % 1)) - away) * 6);
            targetX = awayX * pull - awayY * swirl;
            targetY = awayY * pull + awayX * swirl;
        } else {
            const wind = gust * reply[index] * Math.exp(-since / 260);
            targetX += awayX * wind;
            targetY += awayY * wind;
        }

        const drag = 1 - Math.exp(-step / tau[index]);
        velocityX[index] += (targetX - velocityX[index]) * drag;
        velocityY[index] += (targetY - velocityY[index]) * drag;
        x[index] += velocityX[index] * step;
        y[index] += velocityY[index] * step;

        const progress = Math.max(0, since) / life[index];
        const ebb = Math.max(0, (progress - 0.2) / 0.8);
        const speed = Math.hypot(velocityX[index], velocityY[index]) || 1;
        const along = 1 + Math.min(2.4, speed * 0.002);
        const across = 1 - 0.4 * progress;
        const headingX = velocityX[index] / speed;
        const headingY = velocityY[index] / speed;
        dust.setTransform(
            across + (along - across) * headingX * headingX,
            (along - across) * headingX * headingY,
            (along - across) * headingX * headingY,
            across + (along - across) * headingY * headingY,
            Math.round(homeX[index] + x[index]) + halfX,
            Math.round(homeY[index] + y[index]) + halfY
        );
        dust.globalAlpha = motion.glow * (1 - ebb * ebb * (3 - 2 * ebb)) / Math.sqrt(along);
        dust.drawImage(atlas, sourceX[index], sourceY[index], width[index], height[index], -halfX, -halfY, width[index], height[index]);
    }

    dust.setTransform(1, 0, 0, 1, 0, 0);
};

export type { Layer, Field, Point, Motion };

export { CLASSES, createMasks, createNoise, createField, createLayer, thin, clip, veil, advance };
