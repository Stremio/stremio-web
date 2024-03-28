// Copyright (C) 2017-2023 Smart code 203358507

const fs = require('fs');
const readdirp = require('readdirp');

const COPYRIGHT_HEADER = /^\/\/ Copyright \(C\) 2017-\d{4} Smart code 203358507.*/;

describe('copyright', () => {
    test('js', async () => {
        for await (const { fullPath } of readdirp('src', { fileFilter: '*.js' })) {
            const content = await fs.promises.readFile(fullPath, 'utf8');
            expect(content).toEqual(expect.stringMatching(COPYRIGHT_HEADER));
        }
    });
    
    test('less', async () => {
        for await (const { fullPath } of readdirp('src', { fileFilter: '*.less' })) {
            const content = await fs.promises.readFile(fullPath, 'utf8');
            expect(content).toEqual(expect.stringMatching(COPYRIGHT_HEADER));
        }
    });
});
