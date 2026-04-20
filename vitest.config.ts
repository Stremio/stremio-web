// Copyright (C) 2017-2026 Smart code 203358507

import path from 'node:path';
import { defineConfig } from 'vitest/config';

export default defineConfig({
    resolve: {
        alias: {
            stremio: path.resolve(__dirname, 'src'),
            'stremio-router': path.resolve(__dirname, 'src', 'router'),
        },
    },
    test: {
        globals: true,
        environment: 'jsdom',
        setupFiles: ['./tests/setup.js'],
        include: ['tests/**/*.{test,spec}.{js,ts,jsx,tsx}'],
        exclude: ['node_modules', 'build', 'dist'],
        css: false,
        coverage: {
            provider: 'v8',
            reporter: ['text', 'html'],
            include: ['src/**'],
        },
    },
});
