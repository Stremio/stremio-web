// Copyright (C) 2017-2026 Smart code 203358507

import { useEffect } from 'react';
import { useCore } from 'stremio/core';

const getLoadingProgress = (infoHash: string | null, statistics: Statistics | null) => {
    if (infoHash === null) {
        return 100;
    }
    if (statistics === null) {
        return 0;
    }

    const MB = 1024 * 1024;
    const peerScore = Math.min(1, statistics.peers / 8) * 20;
    const minDownload = Math.min(8 * MB, Math.max(2 * MB, statistics.streamLen * 0.008));
    const downloadedScore = Math.min(1, statistics.downloaded / minDownload) * 70;
    const speedScore = Math.min(1, statistics.downloadSpeed / MB) * 10;

    return Math.min(99, peerScore + downloadedScore + speedScore);
};

const useStatistics = (player: Player, streamingServer: StreamingServer) => {
    const core = useCore();
    const stream = player.stream?.type === 'Ready' ? player.stream.content : null;
    const infoHash = stream?.infoHash ?? null;
    const fileIdx = stream?.fileIdx ?? null;

    const statisticsValue = streamingServer.statistics?.type === 'Ready' ? streamingServer.statistics.content : null;
    const statistics = infoHash !== null && statisticsValue?.infoHash.toLowerCase() === infoHash.toLowerCase() ? statisticsValue : null;

    useEffect(() => {
        if (infoHash === null || fileIdx === null) {
            return undefined;
        }

        const requestStatistics = () => {
            void core.transport.dispatch({
                action: 'StreamingServer',
                args: {
                    action: 'GetStatistics',
                    args: {
                        infoHash,
                        fileIdx,
                    },
                },
            });
        };

        requestStatistics();
        const interval = window.setInterval(requestStatistics, 5000);

        return () => window.clearInterval(interval);
    }, [core.transport, fileIdx, infoHash]);

    return {
        infoHash,
        peers: statistics?.peers ?? 0,
        speed: statistics ? Number((statistics.downloadSpeed / 1000 / 1000).toFixed(2)) : 0,
        completed: statistics ? Number((statistics.streamProgress * 100).toFixed(2)) : 0,
        progress: getLoadingProgress(infoHash, statistics),
    };
};

export default useStatistics;
