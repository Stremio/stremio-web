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
    React.useEffect(() => {
        setSeason(seasons[0]);
    }, [seasons]);
    return [season, seasons, setSeason];
};

module.exports = useSeasons;
