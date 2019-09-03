const React = require('react');

const useStreams = (metaItem) => {
    const streams = React.useMemo(() => {
        return metaItem !== null ?
            [
                {
                    id: '1',
                    addon: 'Google',
                    description: 'Google sample videos'
                },
                {
                    id: '2',
                    addon: 'Stremio',
                    description: 'Stremio demo videos',
                    progress: 0.3
                }
            ]
            :
            [];
    }, [metaItem]);
    return streams;
};

module.exports = useStreams;
