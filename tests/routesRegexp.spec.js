const routesRegexp = require('../src/common/routesRegexp');

describe('routesRegexp', () => {
    describe('intro route regexp', () => {
        it('match /intro', async () => {
            expect(Array.from('/intro'.match(routesRegexp.intro.regexp)))
                .toEqual(['/intro']);
        });

        it('match /intro/', async () => {
            expect(Array.from('/intro/'.match(routesRegexp.intro.regexp)))
                .toEqual(['/intro/']);
        });

        it('not match /intro/$', async () => {
            expect('/intro/$'.match(routesRegexp.intro.regexp))
                .toBe(null);
        });
    });

    describe('board route regexp', () => {
        it('match /', async () => {
            expect(Array.from('/'.match(routesRegexp.board.regexp)))
                .toEqual(['/']);
        });

        it('not match /$', async () => {
            expect('/$'.match(routesRegexp.board.regexp))
                .toBe(null);
        });
    });
});
