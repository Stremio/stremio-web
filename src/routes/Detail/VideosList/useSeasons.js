const React = require('react');

const seasonsReducer = (state, action) => {
    switch (action.type) {
        case 'videos-changed': {
            const seasons = action.videos
                .map(({ season }) => season)
                .filter((season, index, seasons) => {
                    return season !== null &&
                        !isNaN(season) &&
                        typeof season === 'number' &&
                        seasons.indexOf(season) === index;
                });
            const selectedSeason = seasons.includes(state.selectedSeason) ?
                state.selectedSeason
                :
                seasons.length > 0 ?
                    seasons[0]
                    :
                    null;
            return {
                ...state,
                seasons,
                selectedSeason
            };
        }
        case 'season-changed': {
            const selectedSeason = state.seasons.includes(action.season) ?
                action.season
                :
                state.season;
            return {
                ...state,
                selectedSeason
            };
        }
        default: {
            return state;
        }
    }
};

const useSeasons = (metaItem) => {
    const [{ selectedSeason, seasons }, dispatch] = React.useReducer(
        seasonsReducer,
        [metaItem],
        (metaItem) => {
            const videos = metaItem && Array.isArray(metaItem.videos) ? metaItem.videos : [];
            return seasonsReducer({}, {
                type: 'videos-changed',
                videos
            });
        }
    );
    const setSeason = React.useCallback((season) => {
        dispatch({
            type: 'season-changed',
            season
        });
    }, []);
    React.useEffect(() => {
        const videos = metaItem && Array.isArray(metaItem.videos) ? metaItem.videos : [];
        dispatch({
            type: 'videos-changed',
            videos
        });
    }, [metaItem]);
    return [selectedSeason, seasons, setSeason];
};

module.exports = useSeasons;
