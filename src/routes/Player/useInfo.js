const React = require('react');

const useInfo = (player, profile) => {
    const info = React.useMemo(() => {
        if (player.selected === null) {
            return null;
        }

        const stream = player.selected.stream;
        const addon = stream.addon;
        const metaItem = player.meta_resource !== null && player.meta_resource.content.type === 'Ready' ?
            player.meta_resource.content.content
            :
            null;
        const video = metaItem !== null ?
            metaItem.videos.reduce((result, video) => {
                if (video.id === player.selected.video_id) {
                    return video;
                }

                return result;
            }, null)
            :
            null;
        const streamTitle = typeof stream.title === 'string' ? stream.title : '';
        const metaItemTitle = metaItem !== null ? metaItem.name : '';
        const videoTitle = video !== null && typeof video.title === 'string' && video.title.length > 0 ? video.title : '';
        const seriesInfo = video !== null && !isNaN(video.season) && !isNaN(video.episode) ? `${video.season}x${video.episode}` : '';
        const title = metaItemTitle.length > 0 ?
            metaItemTitle
                .concat(videoTitle.length > 0 || seriesInfo.length > 0 ? ' -' : '')
                .concat(videoTitle.length > 0 ? ` ${videoTitle}` : '')
                .concat(seriesInfo.length > 0 ? ` (${seriesInfo})` : '')
            :
            streamTitle;
        return { stream, addon, metaItem, title };
    }, [player, profile]);
    return info;
};

module.exports = useInfo;
