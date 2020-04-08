// Copyright (C) 2017-2020 Smart code 203358507

const React = require('react');

const reducer = (state, action) => {
    switch (action.type) {
        case 'videos-changed': {
            const seasons = action.videos
                .map(({ season }) => season)
                .filter((season, index, seasons) => {
                    return season !== null &&
                        !isNaN(season) &&
                        typeof season === 'number' &&
                        seasons.indexOf(season) === index;
                })
                .sort((a, b) => a - b);
            const selectedSeason = seasons.includes(state.selectedSeason) ?
                state.selectedSeason
                :
                seasons.length > 0 ?
                    seasons[0]
                    :
                    null;
            return {
                ...state,
                videos: action.videos,
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

const initializer = (videos) => {
    const initialState = {
        videos: [],
        seasons: [],
        selectedSeason: null
    };
    const initAction = {
        type: 'videos-changed',
        videos
    };

    return reducer(initialState, initAction);
};

const useSelectableSeasons = (videos) => {
    const [state, dispatch] = React.useReducer(
        reducer,
        videos,
        initializer
    );
    const selectSeason = React.useCallback((season) => {
        dispatch({
            type: 'season-changed',
            season
        });
    }, []);
    const videosForSeason = React.useMemo(() => {
        return state.videos
            .filter((video) => {
                return state.selectedSeason === null || video.season === state.selectedSeason;
            })
            .sort((a, b) => {
                return a.episode - b.episode;
            });
    }, [state.videos, state.selectedSeason]);
    React.useEffect(() => {
        dispatch({
            type: 'videos-changed',
            videos
        });
    }, [videos]);
    return [state.seasons, state.selectedSeason, videosForSeason, selectSeason];
};

module.exports = useSelectableSeasons;
