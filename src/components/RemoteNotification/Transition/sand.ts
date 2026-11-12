// Copyright (C) 2017-2026 Smart code 203358507

import type { Box } from './paint';

type Point = { x: number, y: number };

type Noise = (x: number, y: number, z: number) => number;

type Options = {
    region: Box,
    filled: (x: number, y: number) => boolean,
    origin: Point,
    unit: number,
    grain: number,
    budget: number,
    reach: (x: number, y: number) => number,
};

const GRID = 8;
const TURN = Math.PI * 2;
const FLYING = 1;
const DEAD = 2;
const BURST = 420;
const SPRAY = 1.1;
const SWIRL = 0.4;
const SINK = 40;
const RISE = 30;
const HOLD = 0.3;
const EDGE = 28;

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

const createField = (width: number, height: number, span: number, noise: Noise) => {
    const cell = Math.max(12, span / 22);
    const columns = Math.ceil(width / cell) + 3;
    const rows = Math.ceil(height / cell) + 3;
    const potential = new Float32Array(columns * rows);
    const u = new Float32Array(columns * rows);
    const v = new Float32Array(columns * rows);
    const frequency = 3.4 / span;
    const gain = 0.13 * span / (2 * cell * frequency);

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

type Field = ReturnType<typeof createField>;

const createCover = (region: Box, boxes: Box[]) => {
    const columns = Math.ceil(region.width / GRID);
    const rows = Math.ceil(region.height / GRID);
    const grid = new Uint8Array(columns * rows);
    boxes.forEach((box) => {
        const left = Math.max(0, Math.floor(box.x / GRID));
        const top = Math.max(0, Math.floor(box.y / GRID));
        const right = Math.min(columns - 1, Math.floor((box.x + box.width) / GRID));
        const bottom = Math.min(rows - 1, Math.floor((box.y + box.height) / GRID));
        for (let row = top; row <= bottom; row++) {
            grid.fill(1, row * columns + left, row * columns + right + 1);
        }
    });

    return (x: number, y: number) => grid[Math.min(rows - 1, Math.floor(y / GRID)) * columns + Math.min(columns - 1, Math.floor(x / GRID))] === 1;
};

const createSand = ({ region, filled, origin, unit, grain, budget, reach }: Options) => {
    const spots: number[] = [];
    for (let top = 0; top < region.height; top += grain) {
        for (let left = 0; left < region.width; left += grain) {
            if (filled(left + grain / 2, top + grain / 2)) {
                spots.push(left, top);
            }
        }
    }

    const share = Math.min(1, budget / Math.max(1, spots.length / 2));
    const items: number[][] = [];
    for (let spot = 0; spot < spots.length; spot += 2) {
        if (Math.random() > share) {
            continue;
        }

        const centerX = region.x + spots[spot] + grain * (0.1 + 0.8 * Math.random());
        const centerY = region.y + spots[spot + 1] + grain * (0.1 + 0.8 * Math.random());
        const offsetX = centerX - origin.x;
        const offsetY = centerY - origin.y;
        const aimed = Math.hypot(offsetX, offsetY) > grain;
        const heading = aimed ? Math.atan2(offsetY, offsetX) + (Math.random() - 0.5) * SPRAY : Math.random() * TURN;
        const speed = BURST * (0.3 + 0.7 * Math.random()) * unit;
        items.push([
            reach(centerX, centerY) + grain * (Math.random() - 0.5),
            spots[spot],
            spots[spot + 1],
            centerX,
            centerY,
            Math.cos(heading) * speed,
            Math.sin(heading) * speed,
            420 + 300 * Math.random(),
            0.22 + 0.25 * Math.random(),
            0.85 + 0.5 * Math.random(),
        ]);
    }

    items.sort((a, b) => a[0] - b[0]);
    const count = items.length;
    const column = (index: number) => Float32Array.from(items, (item) => item[index]);
    const release = column(0);
    const cells = new Float32Array(count * 2);
    const data = new Float32Array(count * 4);
    const velocityX = column(5);
    const velocityY = column(6);
    const life = column(7);
    const tau = column(8);
    const girth = column(9);
    const age = new Float32Array(count);
    const state = new Uint8Array(count);
    items.forEach((item, index) => {
        cells[index * 2] = item[1];
        cells[index * 2 + 1] = item[2];
        data[index * 4] = item[3];
        data[index * 4 + 1] = item[4];
    });
    let head = 0;
    let tail = 0;
    let rate = 1;

    const advance = (field: Field, radius: number, delta: number, hole: Box | null) => {
        const { cell, columns, rows, u, v } = field;
        while (tail < count && release[tail] <= radius) {
            state[tail] = rate < 1 && (tail * 0.618) % 1 > rate ? DEAD : FLYING;
            tail++;
        }
        while (head < tail && state[head] === DEAD) {
            head++;
        }

        const sink = SINK * unit;
        const step = delta * 1000;
        for (let index = head; index < tail; index++) {
            const slot = index * 4;
            if (state[index] === DEAD) {
                continue;
            }

            age[index] += step;
            const progress = age[index] / life[index];
            if (progress >= 1) {
                state[index] = DEAD;
                data[slot + 2] = 0;
                continue;
            }
            const gridX = Math.min(columns - 2.001, Math.max(1, data[slot] / cell + 1));
            const gridY = Math.min(rows - 2.001, Math.max(1, data[slot + 1] / cell + 1));
            const cornerX = gridX | 0;
            const cornerY = gridY | 0;
            const blendX = gridX - cornerX;
            const blendY = gridY - cornerY;
            const node = cornerY * columns + cornerX;
            const flowX = (u[node] * (1 - blendX) + u[node + 1] * blendX) * (1 - blendY) + (u[node + columns] * (1 - blendX) + u[node + columns + 1] * blendX) * blendY;
            const flowY = (v[node] * (1 - blendX) + v[node + 1] * blendX) * (1 - blendY) + (v[node + columns] * (1 - blendX) + v[node + columns + 1] * blendX) * blendY;
            const drag = 1 - Math.exp(-delta / tau[index]);
            velocityX[index] += (flowX * SWIRL - velocityX[index]) * drag;
            velocityY[index] += (flowY * SWIRL + sink - velocityY[index]) * drag;
            data[slot] += velocityX[index] * delta;
            data[slot + 1] += velocityY[index] * delta;
            const ebb = Math.max(0, (progress - HOLD) / (1 - HOLD));
            let alpha = Math.min(1, age[index] / RISE) * (1 - ebb * ebb * (3 - 2 * ebb));
            if (hole !== null) {
                const outsideX = Math.max(hole.x - data[slot], 0, data[slot] - hole.x - hole.width);
                const outsideY = Math.max(hole.y - data[slot + 1], 0, data[slot + 1] - hole.y - hole.height);
                alpha *= Math.min(1, Math.hypot(outsideX, outsideY) / EDGE);
            }

            data[slot + 2] = alpha;
            data[slot + 3] = girth[index] * (1 - 0.4 * progress * progress);
        }

        return head < count;
    };

    const thin = (keep: number) => {
        rate = Math.min(rate, keep);
    };

    const range = () => [head, tail];

    return { count, cells, data, advance, thin, range };
};

type Sand = ReturnType<typeof createSand>;

const createPlate = (canvas: HTMLCanvasElement) => {
    const context = canvas.getContext('2d')!;
    const add = (surface: HTMLCanvasElement, sand: Sand, grain: number) => () => {
        const [head, tail] = sand.range();
        const { cells, data } = sand;
        for (let index = head; index < tail; index++) {
            const slot = index * 4;
            if (data[slot + 2] > 0.01) {
                const side = grain * data[slot + 3];
                context.globalAlpha = data[slot + 2];
                context.drawImage(surface, cells[index * 2], cells[index * 2 + 1], grain, grain, data[slot] - side / 2, data[slot + 1] - side / 2, side, side);
            }
        }

        context.globalAlpha = 1;
    };

    return {
        add,
        clear: () => context.clearRect(0, 0, canvas.width, canvas.height),
    };
};

export type { Point, Noise, Field, Sand };

export { createNoise, createField, createCover, createSand, createPlate };
