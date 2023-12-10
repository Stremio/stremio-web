#!/usr/bin/env node

// Copyright (C) 2017-2023 Smart code 203358507

const INDEX_CACHE = 7200;
const ASSETS_CACHE = 2629744;
const HTTP_PORT = 8080;

const express = require('express');
const path = require('path');

const build_path = path.resolve(__dirname, 'build');
const index_path = path.join(build_path, 'index.html');

const app = express();

app.use(express.static(build_path, {
    setHeaders: (res, path) => {
        if (path === index_path) {
            res.set('Cache-Control', `max-age=${INDEX_CACHE}, must-revalidate, public`);
        } else {
            res.set('Cache-Control', `max-age=${ASSETS_CACHE}, must-revalidate, public`);
        }
    },
    fallthrough: true
}));

app.use((_req, res) => {
    res.status(404).sendFile(index_path);
});

app.listen(HTTP_PORT, () => console.info(`Server listening on port: ${HTTP_PORT}`));
