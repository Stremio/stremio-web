// Copyright (C) 2017-2026 Smart code 203358507

import { useMemo } from 'react';

type StreamGroup = {
    addon: Addon,
    streams: Stream[],
};

type StreamsByAddon = {
    groups: StreamGroup[],
    loadingCount: number,
    allErrored: boolean,
    total: number,
};

const useStreamsByAddon = (streams: MetaDetails['streams']): StreamsByAddon => {
    return useMemo(() => {
        const groups: StreamGroup[] = [];
        let loadingCount = 0;
        let total = 0;
        streams.forEach(({ addon, content }) => {
            if (content.type === 'Loading') {
                loadingCount++;
            } else if (content.type === 'Ready' && content.content.length > 0) {
                groups.push({ addon, streams: content.content });
                total += content.content.length;
            }
        });

        return {
            groups,
            loadingCount,
            allErrored: streams.length > 0 && streams.every(({ content }) => content.type === 'Err'),
            total,
        };
    }, [streams]);
};

export type { StreamGroup };
export default useStreamsByAddon;
