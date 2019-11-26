const routesRegexp = require('../src/common/routesRegexp');

const urlParamsMatch = (result, urlParams) => {
    expect(Array.isArray(result)).toBe(true);
    expect(result.length).toBe(urlParams.length);
    urlParams.forEach((urlParam, index) => {
        expect(result[index]).toBe(urlParam);
    });
};

describe('routes regex', () => {
    describe('intro regexp', () => {
        it('goes to /intro', async () => {
            const result = '/intro'.match(routesRegexp.intro.regexp);
            urlParamsMatch(result, ['/intro']);
        });

        it('goes to /intro/', async () => {
            const result = '/intro/'.match(routesRegexp.intro.regexp);
            urlParamsMatch(result, ['/intro/']);
        });

        it('goes to /intro/<random_input>', async () => {
            const result = '/intro/a'.match(routesRegexp.intro.regexp);
            expect(result).toBe(null);
        });
    });

    describe('board regexp', () => {
        it('goes to /', async () => {
            const result = '/'.match(routesRegexp.board.regexp);
            urlParamsMatch(result, ['/']);
        });

        it('goes to /<random_input>', async () => {
            const result = '/a'.match(routesRegexp.board.regexp);
            expect(result).toBe(null);
        });
    });
});
