const React = require('react');

const usePlaylist = (player) => {
    return React.useMemo(() => {
        if (player.selected === null || typeof player.selected.stream.url !== 'string') {
            return null;
        }

        const name = `${player.title}.m3u`;
        const m3u = `#EXTM3U\n\n#EXTINF:0,${encodeURIComponent(player.title)}\n${encodeURI(player.selected.stream.url)}`;
        const href = `data:application/octet-stream;charset=utf-8;base64,${window.btoa(m3u)}`;
        return { name, href };
    }, [player]);
};

module.exports = usePlaylist;
