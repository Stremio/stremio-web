// Copyright (C) 2017-2023 Smart code 203358507

const routesRegexp = require('../src/common/routesRegexp');

describe('routesRegexp', () => {
    describe('intro route regexp', () => {
        it('match /intro', async () => {
            expect(Array.from('/intro'.match(routesRegexp.intro.regexp)))
                .toEqual(['/intro']);
        });

        it('not match /intro/', async () => {
            expect('/intro/'.match(routesRegexp.intro.regexp))
                .toBe(null);
        });
    });

    describe('board route regexp', () => {
        it('match empty path', async () => {
            expect(Array.from(''.match(routesRegexp.board.regexp)))
                .toEqual(['']);
        });

        it('match /', async () => {
            expect(Array.from('/'.match(routesRegexp.board.regexp)))
                .toEqual(['/']);
        });

        it('not match /1', async () => {
            expect('/1'.match(routesRegexp.board.regexp))
                .toBe(null);
        });
    });

    describe('discover route regexp', () => {
        it('match /discover', async () => {
            expect(Array.from('/discover'.match(routesRegexp.discover.regexp)))
                .toEqual(['/discover', undefined, undefined, undefined]);
        });

        it('match /discover///', async () => {
            expect(Array.from('/discover///'.match(routesRegexp.discover.regexp)))
                .toEqual(['/discover///', '', '', '']);
        });

        it('match /discover/1//', async () => {
            expect(Array.from('/discover/1//'.match(routesRegexp.discover.regexp)))
                .toEqual(['/discover/1//', '1', '', '']);
        });

        it('match /discover//2/', async () => {
            expect(Array.from('/discover//2/'.match(routesRegexp.discover.regexp)))
                .toEqual(['/discover//2/', '', '2', '']);
        });

        it('match /discover///3', async () => {
            expect(Array.from('/discover///3'.match(routesRegexp.discover.regexp)))
                .toEqual(['/discover///3', '', '', '3']);
        });

        it('match /discover/1/2/', async () => {
            expect(Array.from('/discover/1/2/'.match(routesRegexp.discover.regexp)))
                .toEqual(['/discover/1/2/', '1', '2', '']);
        });

        it('match /discover/1//3', async () => {
            expect(Array.from('/discover/1//3'.match(routesRegexp.discover.regexp)))
                .toEqual(['/discover/1//3', '1', '', '3']);
        });

        it('match /discover//2/3', async () => {
            expect(Array.from('/discover//2/3'.match(routesRegexp.discover.regexp)))
                .toEqual(['/discover//2/3', '', '2', '3']);
        });

        it('match /discover/1/2/3', async () => {
            expect(Array.from('/discover/1/2/3'.match(routesRegexp.discover.regexp)))
                .toEqual(['/discover/1/2/3', '1', '2', '3']);
        });

        it('not match /discover/', async () => {
            expect('/discover/'.match(routesRegexp.discover.regexp))
                .toBe(null);
        });

        it('not match /discover//', async () => {
            expect('/discover//'.match(routesRegexp.discover.regexp))
                .toBe(null);
        });

        it('not match /discover////', async () => {
            expect('/discover////'.match(routesRegexp.discover.regexp))
                .toBe(null);
        });

        it('not match /discover/1', async () => {
            expect('/discover/1'.match(routesRegexp.discover.regexp))
                .toBe(null);
        });

        it('not match /discover/1/', async () => {
            expect('/discover/1/'.match(routesRegexp.discover.regexp))
                .toBe(null);
        });

        it('not match /discover//2', async () => {
            expect('/discover//2'.match(routesRegexp.discover.regexp))
                .toBe(null);
        });

        it('not match /discover/1/2', async () => {
            expect('/discover/1/2'.match(routesRegexp.discover.regexp))
                .toBe(null);
        });

        it('not match /discover/1/2/3/', async () => {
            expect('/discover/1/2/3/'.match(routesRegexp.discover.regexp))
                .toBe(null);
        });
    });

    describe('library route regexp', () => {
        it('match /library', async () => {
            expect(Array.from('/library'.match(routesRegexp.library.regexp)))
                .toEqual(['/library', undefined]);
        });

        it('match /library/type', async () => {
            expect(Array.from('/library/type'.match(routesRegexp.library.regexp)))
                .toEqual(['/library/type', 'type']);
        });

        it('match /library/type/', async () => {
            expect('/library/type/'.match(routesRegexp.library.regexp))
                .toBe(null);
        });
    });

    describe('search route regexp', () => {
        it('match /search', async () => {
            expect(Array.from('/search'.match(routesRegexp.search.regexp)))
                .toEqual(['/search']);
        });

        it('not match /search/', async () => {
            expect('/search/'.match(routesRegexp.search.regexp))
                .toBe(null);
        });
    });

    describe('metadetails route regexp', () => {
        it('match /metadetails//', async () => {
            expect(Array.from('/metadetails//'.match(routesRegexp.metadetails.regexp)))
                .toEqual(['/metadetails//', '', '', undefined]);
        });

        it('match /metadetails///', async () => {
            expect(Array.from('/metadetails///'.match(routesRegexp.metadetails.regexp)))
                .toEqual(['/metadetails///', '', '', '']);
        });

        it('match /metadetails/1/', async () => {
            expect(Array.from('/metadetails/1/'.match(routesRegexp.metadetails.regexp)))
                .toEqual(['/metadetails/1/', '1', '', undefined]);
        });

        it('match /metadetails/1//', async () => {
            expect(Array.from('/metadetails/1//'.match(routesRegexp.metadetails.regexp)))
                .toEqual(['/metadetails/1//', '1', '', '']);
        });

        it('match /metadetails//2/', async () => {
            expect(Array.from('/metadetails//2/'.match(routesRegexp.metadetails.regexp)))
                .toEqual(['/metadetails//2/', '', '2', '']);
        });

        it('match /metadetails///3', async () => {
            expect(Array.from('/metadetails///3'.match(routesRegexp.metadetails.regexp)))
                .toEqual(['/metadetails///3', '', '', '3']);
        });

        it('match /metadetails/1/2', async () => {
            expect(Array.from('/metadetails/1/2'.match(routesRegexp.metadetails.regexp)))
                .toEqual(['/metadetails/1/2', '1', '2', undefined]);
        });

        it('match /metadetails/1/2/', async () => {
            expect(Array.from('/metadetails/1/2/'.match(routesRegexp.metadetails.regexp)))
                .toEqual(['/metadetails/1/2/', '1', '2', '']);
        });

        it('match /metadetails/1//3', async () => {
            expect(Array.from('/metadetails/1//3'.match(routesRegexp.metadetails.regexp)))
                .toEqual(['/metadetails/1//3', '1', '', '3']);
        });

        it('match /metadetails//2/3', async () => {
            expect(Array.from('/metadetails//2/3'.match(routesRegexp.metadetails.regexp)))
                .toEqual(['/metadetails//2/3', '', '2', '3']);
        });

        it('match /metadetails/1/2/3', async () => {
            expect(Array.from('/metadetails/1/2/3'.match(routesRegexp.metadetails.regexp)))
                .toEqual(['/metadetails/1/2/3', '1', '2', '3']);
        });

        it('not match /metadetails', async () => {
            expect('/metadetails'.match(routesRegexp.metadetails.regexp))
                .toBe(null);
        });

        it('not match /metadetails/', async () => {
            expect('/metadetails/'.match(routesRegexp.metadetails.regexp))
                .toBe(null);
        });

        it('not match /metadetails////', async () => {
            expect('/metadetails////'.match(routesRegexp.metadetails.regexp))
                .toBe(null);
        });

        it('not match /metadetails/1', async () => {
            expect('/metadetails/1'.match(routesRegexp.metadetails.regexp))
                .toBe(null);
        });

        it('not match /metadetails/1/2/3/', async () => {
            expect('/metadetails/1/2/3/'.match(routesRegexp.metadetails.regexp))
                .toBe(null);
        });
    });

    describe('addons route regexp', () => {
        it('match /addons', async () => {
            expect(Array.from('/addons'.match(routesRegexp.addons.regexp)))
                .toEqual(['/addons', undefined, undefined, undefined]);
        });

        it('match /addons///', async () => {
            expect(Array.from('/addons///'.match(routesRegexp.addons.regexp)))
                .toEqual(['/addons///', '', '', '']);
        });

        it('match /addons/1//', async () => {
            expect(Array.from('/addons/1//'.match(routesRegexp.addons.regexp)))
                .toEqual(['/addons/1//', '1', '', '']);
        });

        it('match /addons//2/', async () => {
            expect(Array.from('/addons//2/'.match(routesRegexp.addons.regexp)))
                .toEqual(['/addons//2/', '', '2', '']);
        });

        it('match /addons///3', async () => {
            expect(Array.from('/addons///3'.match(routesRegexp.addons.regexp)))
                .toEqual(['/addons///3', '', '', '3']);
        });

        it('match /addons/1/2/', async () => {
            expect(Array.from('/addons/1/2/'.match(routesRegexp.addons.regexp)))
                .toEqual(['/addons/1/2/', '1', '2', '']);
        });

        it('match /addons/1//3', async () => {
            expect(Array.from('/addons/1//3'.match(routesRegexp.addons.regexp)))
                .toEqual(['/addons/1//3', '1', '', '3']);
        });

        it('match /addons//2/3', async () => {
            expect(Array.from('/addons//2/3'.match(routesRegexp.addons.regexp)))
                .toEqual(['/addons//2/3', '', '2', '3']);
        });

        it('match /addons/1/2/3', async () => {
            expect(Array.from('/addons/1/2/3'.match(routesRegexp.addons.regexp)))
                .toEqual(['/addons/1/2/3', '1', '2', '3']);
        });

        it('not match /addons/', async () => {
            expect(Array.from('/addons/'.match(routesRegexp.addons.regexp)))
                .toEqual(['/addons/', '', undefined, undefined]);
        });

        it('not match /addons//', async () => {
            expect('/addons//'.match(routesRegexp.addons.regexp))
                .toBe(null);
        });

        it('not match /addons////', async () => {
            expect('/addons////'.match(routesRegexp.addons.regexp))
                .toBe(null);
        });

        it('not match /addons/1', async () => {
            expect(Array.from('/addons/1'.match(routesRegexp.addons.regexp)))
                .toEqual(['/addons/1', '1', undefined, undefined]);
        });

        it('not match /addons/1/', async () => {
            expect('/addons/1/'.match(routesRegexp.addons.regexp))
                .toBe(null);
        });

        it('not match /addons//2', async () => {
            expect('/addons//2'.match(routesRegexp.addons.regexp))
                .toBe(null);
        });

        it('not match /addons/1/2', async () => {
            expect('/addons/1/2'.match(routesRegexp.addons.regexp))
                .toBe(null);
        });

        it('not match /addons/1/2/3/', async () => {
            expect('/addons/1/2/3/'.match(routesRegexp.addons.regexp))
                .toBe(null);
        });
    });

    describe('settings route regexp', () => {
        it('match /settings', async () => {
            expect(Array.from('/settings'.match(routesRegexp.settings.regexp)))
                .toEqual(['/settings']);
        });

        it('not match /settings/', async () => {
            expect('/settings/'.match(routesRegexp.settings.regexp))
                .toBe(null);
        });
    });

    describe('player route regexp', () => {
        it('not match /player', async () => {
            expect('/player'.match(routesRegexp.player.regexp))
                .toBe(null);
        });

        it('match /player/stream', async () => {
            expect(Array.from('/player/stream'.match(routesRegexp.player.regexp)))
                .toEqual(['/player/stream', 'stream', undefined, undefined, undefined, undefined, undefined]);
        });

        it('match /player/stream/', async () => {
            expect('/player/stream/'.match(routesRegexp.player.regexp))
                .toBe(null);
        });

        it('match /player/stream/stu/mtu/t/i/v', async () => {
            expect(Array.from('/player/stream/stu/mtu/t/i/v'.match(routesRegexp.player.regexp)))
                .toEqual(['/player/stream/stu/mtu/t/i/v', 'stream', 'stu', 'mtu', 't', 'i', 'v']);
        });

        it('match /player/stream/stu/mtu/t/i/v/', async () => {
            expect('/player/stream/stu/mtu/t/i/v/'.match(routesRegexp.player.regexp))
                .toBe(null);
        });
    });
});
