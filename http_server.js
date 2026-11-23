#!/usr/bin/env node

// Copyright (C) 2017-2023 Smart code 203358507

const HASHED_ASSETS_CACHE = 'public, max-age=31536000, immutable';
const HTTP_PORT = 8080;

const express = require('express');
const path = require('path');

const build_path = path.resolve(__dirname, 'build');
const hashed_assets_regex = /^[0-9a-f]{40}$/;

express().use(express.static(build_path, {
    setHeaders: (res, file_path) => {
        const [root] = path.relative(build_path, file_path).split(path.sep);
        res.set('cache-control', hashed_assets_regex.test(root) ? HASHED_ASSETS_CACHE : 'no-cache');
    }
})).all('*', (_req, res) => {
    // TODO: better 404 page
    res.status(404).set('cache-control', 'no-store').send('<h1>404! Page not found</h1>');
}).listen(HTTP_PORT, () => console.info(`Server listening on port: ${HTTP_PORT}`));
