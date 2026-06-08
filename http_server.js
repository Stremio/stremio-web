#!/usr/bin/env node

// Copyright (C) 2017-2023 Smart code 203358507

const ASSETS_CACHE = 2629744;
const HTTP_PORT = 8080;

const express = require('express');
const path = require('path');

const build_path = path.resolve(__dirname, 'build');
const index_path = path.join(build_path, 'index.html');

express().use(express.static(build_path, {
    setHeaders: (res, filePath) => {
        if (
            filePath === index_path ||
            filePath.endsWith('.js') ||
            filePath.endsWith('.css') ||
            filePath.endsWith('.map') ||
            filePath.endsWith('manifest.json')
        ) {
            res.set('cache-control', 'no-cache');
        } else {
            res.set('cache-control', `public, max-age: ${ASSETS_CACHE}`);
        }
    }
})).all('*', (_req, res) => {
    // TODO: better 404 page
    res.status(404).send('<h1>404! Page not found</h1>');
}).listen(HTTP_PORT, () => console.info(`Server listening on port: ${HTTP_PORT}`));
