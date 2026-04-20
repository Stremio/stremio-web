// Copyright (C) 2017-2026 Smart code 203358507

const path = require('path');

module.exports = {
    testEnvironment: 'jsdom',
    setupFilesAfterEnv: ['<rootDir>/tests/setup.js'],
    testPathIgnorePatterns: ['/node_modules/', '/build/'],
    moduleNameMapper: {
        '\\.(less|css)$': '<rootDir>/tests/helpers/styleMock.js',
        '^stremio-router$': '<rootDir>/src/router',
        '^stremio/(.*)$': '<rootDir>/src/$1',
    },
    transform: {
        '^.+\\.(t|j)sx?$': ['babel-jest', {
            configFile: false,
            presets: [
                ['@babel/preset-env', { targets: { node: 'current' } }],
                ['@babel/preset-react', { runtime: 'automatic' }],
                '@babel/preset-typescript',
            ],
        }],
    },
    transformIgnorePatterns: [
        'node_modules/(?!(@testing-library)/)',
    ],
};
