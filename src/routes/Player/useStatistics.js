// Copyright (C) 2017-2023 Smart code 203358507

const React = require('react');
const { useCore } = require('stremio/core');

const useStatistics = (player, streamingServer) => {
    const core = useCore();

    const [progress, setProgress] = React.useState(0);

    const stream = React.useMemo(() => {
        if (player.stream?.type === 'Ready') {
            return player.stream.content;
        } else {
            return null;
        }
    }, [player.stream]);

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

    React.useEffect(() => {
        statistics && setProgress(() => {
            const MB = 1024 * 1024;
            const peerScore = Math.min(1, statistics.peers / 8) * 20;

            const minDownload = Math.min(8 * MB, Math.max(2 * MB, statistics.streamLen * 0.008));
            const downloadedScore = Math.min(1, statistics.downloaded / minDownload) * 70;

            const speedScore = Math.min(1, statistics.downloadSpeed / (1 * MB)) * 10;

            return Math.min(99, peerScore + downloadedScore + speedScore);
        });
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

    React.useEffect(() => {
        setProgress(infoHash ? 0 : 100);
    }, [infoHash]);

    return {
        infoHash,
        peers,
        speed,
        completed,
        progress,
    };
};

module.exports = useStatistics;
