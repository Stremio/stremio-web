// Copyright (C) 2017-2023 Smart code 203358507

const React = require('react');
const { useServices } = require('stremio/services');

const useStatistics = (player, streamingServer) => {
    const { core } = useServices();

    const stream = React.useMemo(() => {
        return player.selected?.stream ?
            player.selected.stream
            :
            null;
    }, [player.selected]);

    const infoHash = React.useMemo(() => {
        return stream?.infoHash ?
            stream?.infoHash
            :
            null;
    }, [stream]);

    const statistics = React.useMemo(() => {
        return streamingServer.statistics?.type === 'Ready' ?
            streamingServer.statistics.content
            :
            null;
    }, [streamingServer.statistics]);

    const peers = React.useMemo(() => {
        return statistics?.peers ?
            statistics.peers
            :
            0;
    }, [statistics]);

    const speed = React.useMemo(() => {
        return statistics?.downloadSpeed ?
            parseFloat((statistics.downloadSpeed / 1000 / 1000).toFixed(2))
            :
            0;
    }, [statistics]);

    const completed = React.useMemo(() => {
        return statistics?.streamProgress ?
            parseFloat((statistics.streamProgress * 100).toFixed(2))
            :
            0;
    }, [statistics]);

    const getStatistics = React.useCallback(() => {
        if (stream) {
            const { infoHash, fileIdx } = stream;
            if (typeof infoHash === 'string' && typeof fileIdx === 'number') {
                core.transport.dispatch({
                    action: 'StreamingServer',
                    args: {
                        action: 'GetStatistics',
                        args: {
                            infoHash,
                            fileIdx,
                        }
                    }
                });
            }
        }
    }, [stream]);

    React.useEffect(() => {
        getStatistics();
        const interval = setInterval(getStatistics, 5000);
        return () => clearInterval(interval);
    }, [getStatistics]);

    return {
        infoHash,
        peers,
        speed,
        completed,
    };
};

module.exports = useStatistics;
