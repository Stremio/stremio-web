const React = require('react');

const useSeasons = (metaItem) => {
    const seasons = React.useMemo(() => {
        return metaItem !== null ?
            metaItem.videos
                .map(({ season }) => season)
                .filter((season, index, seasons) => {
                    return season !== null &&
                        !isNaN(season) &&
                        seasons.indexOf(season) === index;
                })
            :
            [];
    }, [metaItem]);
    const [season, setSeason] = React.useState(seasons[0]);
    const setPrevSeason = React.useCallback(() => {
        const seasonIndex = seasons.indexOf(season);
        if (seasonIndex > 0) {
            setSeason(seasons[seasonIndex - 1]);
        }
    }, [seasons, season]);
    const setNextSeason = React.useCallback(() => {
        const seasonIndex = seasons.indexOf(season);
        if (seasonIndex < seasons.length - 1) {
            setSeason(seasons[seasonIndex + 1]);
        }
    }, [seasons, season]);
    React.useEffect(() => {
        setSeason(seasons[0]);
    }, [seasons]);
    return [season, seasons, setSeason, setPrevSeason, setNextSeason];
};

module.exports = useSeasons;
