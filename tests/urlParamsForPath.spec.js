// Copyright (C) 2017-2026 Smart code 203358507

const routesRegexp = require('../src/common/routesRegexp');
const urlParamsForPath = require('../src/router/Router/urlParamsForPath');

describe('urlParamsForPath', () => {
    it('decodes route parameters', () => {
        expect(urlParamsForPath(routesRegexp.metadetails, '/metadetails/movie/tt%3A123%2Fvideo')).toEqual({
            path: '/metadetails/movie/tt%3A123%2Fvideo',
            type: 'movie',
            id: 'tt:123/video',
            videoId: null
        });
    });

    it('keeps malformed route parameters raw instead of throwing', () => {
        expect(() => urlParamsForPath(routesRegexp.metadetails, '/metadetails/movie/%E0%A4%A')).not.toThrow();
        expect(urlParamsForPath(routesRegexp.metadetails, '/metadetails/movie/%E0%A4%A')).toEqual({
            path: '/metadetails/movie/%E0%A4%A',
            type: 'movie',
            id: '%E0%A4%A',
            videoId: null
        });
    });
});
