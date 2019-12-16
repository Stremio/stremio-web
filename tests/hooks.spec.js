const { renderHook, act } = require('@testing-library/react-hooks');
const useSelectableSeasons = require('../src/routes/MetaDetails/VideosList/useSelectableSeasons');

const videos = [{ 'season': 4 }, { 'season': 5 }, { 'season': 4 }, { 'season': 7 }];

describe('hooks tests', () => {
    describe('useSelectableSeasons hook', () => {
        it('match 4', async () => {
            const { result } = renderHook(() => useSelectableSeasons(videos));
            const [, selectedSeason] = result.current;
            expect(selectedSeason).toBe(4);
        });

        it('match 5', async () => {
            const { result } = renderHook(() => useSelectableSeasons(videos));

            act(() => {
                const [, , , selectSeason] = result.current;
                selectSeason(5);
            });

            const [, selectedSeason] = result.current;
            expect(selectedSeason).toBe(5);
        });

        it('not match 6', async () => {
            const { result } = renderHook(() => useSelectableSeasons(videos));

            act(() => {
                const [, , , selectSeason] = result.current;
                selectSeason(6);
            });

            const [, selectedSeason] = result.current;
            expect(selectedSeason).toBe(undefined);
        });

        it('not match $', async () => {
            const { result } = renderHook(() => useSelectableSeasons(videos));

            act(() => {
                const [, , , selectSeason] = result.current;
                selectSeason('$');
            });

            const [, selectedSeason] = result.current;
            expect(selectedSeason).toBe(undefined);
        });
    });
});
