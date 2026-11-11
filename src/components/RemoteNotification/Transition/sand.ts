// Copyright (C) 2017-2026 Smart code 203358507

import type { Box, Mark } from './paint';

type Point = { x: number, y: number };

type Noise = (x: number, y: number, z: number) => number;

type Material = {
    canvas: HTMLCanvasElement,
    region: Box,
    marks: Mark[],
    keep: Box[],
    inked: ((x: number, y: number) => boolean) | null,
};

type Options = {
    materials: Material[],
    origin: Point,
    span: number,
    grain: number,
    budget: number,
    reach: (x: number, y: number) => number,
};

const GRID = 8;
const TURN = Math.PI * 2;
const FLYING = 1;
const DEAD = 2;
const IMAGE = 1;
const TEXT = 2;
const SPARSE = 0.4;
const DIM = 0.55;
const BRIEF = 0.6;
const SHADE = 0.6;
const RISE = 45;

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

const createCover = (region: Box, boxes: Box[], kinds: number[]) => {
    const columns = Math.ceil(region.width / GRID);
    const rows = Math.ceil(region.height / GRID);
    const grid = new Uint8Array(columns * rows);
    boxes.forEach((box, index) => {
        const left = Math.max(0, Math.floor(box.x / GRID));
        const top = Math.max(0, Math.floor(box.y / GRID));
        const right = Math.min(columns - 1, Math.floor((box.x + box.width) / GRID));
        const bottom = Math.min(rows - 1, Math.floor((box.y + box.height) / GRID));
        for (let row = top; row <= bottom; row++) {
            grid.fill(kinds[index], row * columns + left, row * columns + right + 1);
        }
    });

    return (x: number, y: number) => grid[Math.min(rows - 1, Math.floor(y / GRID)) * columns + Math.min(columns - 1, Math.floor(x / GRID))];
};

const createSand = ({ materials, origin, span, grain, budget, reach }: Options) => {
    const cells: number[][] = [];
    materials.forEach(({ region, marks, keep, inked }, material) => {
        const marked = createCover(region, marks, marks.map(({ text }) => text ? TEXT : IMAGE));
        const kept = createCover(region, keep, keep.map(() => IMAGE));
        for (let top = 0; top < region.height; top += grain) {
            for (let left = 0; left < region.width; left += grain) {
                const centerX = left + grain / 2;
                const centerY = top + grain / 2;
                const ink = marked(centerX, centerY);
                if (ink !== 0 && kept(centerX, centerY) === 0 && (inked === null || inked(centerX, centerY))) {
                    cells.push([material, left, top, ink]);
                }
            }
        }
    });

    const weight = cells.reduce((sum, cell) => sum + (cell[3] === TEXT ? SPARSE : 1), 0);
    const share = Math.min(1, budget / Math.max(1, weight));
    const items: number[][] = [];
    cells.forEach(([material, left, top, ink]) => {
        if (Math.random() > share * (ink === TEXT ? SPARSE : 1)) {
            return;
        }

        const { region } = materials[material];
        const homeX = region.x + left;
        const homeY = region.y + top;
        const offsetX = homeX + grain / 2 - origin.x;
        const offsetY = homeY + grain / 2 - origin.y;
        const away = Math.hypot(offsetX, offsetY) || 1;
        const heading = Math.random() * TURN;
        const speed = span * 0.05 * Math.random();
        const push = span * 0.26 * Math.random();
        items.push([
            reach(homeX + grain / 2, homeY + grain / 2) + grain * (Math.random() - 0.5),
            material,
            left,
            top,
            homeX,
            homeY,
            Math.cos(heading) * speed + offsetX / away * push,
            Math.sin(heading) * speed + offsetY / away * push,
            (180 + 220 * Math.random()) * (ink === TEXT ? BRIEF : 1),
            0.08 + 0.26 * Math.random() * Math.random(),
            0.45 + 0.75 * Math.random(),
            ink === TEXT ? DIM : SHADE,
        ]);
    });

    items.sort((a, b) => a[0] - b[0]);
    const count = items.length;
    const column = (index: number) => Float32Array.from(items, (item) => item[index]);
    const release = column(0);
    const material = Uint8Array.from(items, (item) => item[1]);
    const sourceX = column(2);
    const sourceY = column(3);
    const x = column(4);
    const y = column(5);
    const velocityX = column(6);
    const velocityY = column(7);
    const life = column(8);
    const tau = column(9);
    const reply = column(10);
    const shade = column(11);
    const age = new Float32Array(count);
    const state = new Uint8Array(count);
    const canvases = materials.map(({ canvas }) => canvas);
    let head = 0;
    let tail = 0;
    let rate = 1;

    const advance = (context: CanvasRenderingContext2D, field: Field, radius: number, delta: number) => {
        const { cell, columns, rows, u, v } = field;
        while (tail < count && release[tail] <= radius) {
            state[tail] = rate < 1 && (tail * 0.618) % 1 > rate ? DEAD : FLYING;
            tail++;
        }
        while (head < tail && state[head] === DEAD) {
            head++;
        }

        const gust = span * 0.42;
        const step = delta * 1000;
        for (let index = head; index < tail; index++) {
            if (state[index] === DEAD) {
                continue;
            }

            age[index] += step;
            if (age[index] >= life[index]) {
                state[index] = DEAD;
                continue;
            }

            const centerX = x[index] + grain / 2;
            const centerY = y[index] + grain / 2;
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
            const wind = gust * reply[index] * Math.exp(-age[index] / 210);
            const drag = 1 - Math.exp(-delta / tau[index]);
            velocityX[index] += (flowX + offsetX / away * wind - velocityX[index]) * drag;
            velocityY[index] += (flowY + offsetY / away * wind - velocityY[index]) * drag;
            x[index] += velocityX[index] * delta;
            y[index] += velocityY[index] * delta;

            const ebb = Math.max(0, (age[index] / life[index] - 0.3) / 0.7);
            context.globalAlpha = shade[index] * Math.min(1, age[index] / RISE) * (1 - ebb * ebb * (3 - 2 * ebb));
            context.drawImage(canvases[material[index]], sourceX[index], sourceY[index], grain, grain, x[index], y[index], grain, grain);
        }

        context.globalAlpha = 1;
        return head < count;
    };

    const thin = (keep: number) => {
        rate = Math.min(rate, keep);
    };

    return { count, advance, thin };
};

export type { Point, Noise, Field, Material };

export { createNoise, createField, createSand };
