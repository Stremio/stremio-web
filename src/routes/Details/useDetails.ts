// Copyright (C) 2017-2026 Smart code 203358507

import { useMemo } from 'react';
import { useModelState } from 'stremio/common';

type Params = {
    type?: string,
    id?: string,
    videoId?: string,
};

const useDetails = ({ type, id, videoId }: Params): MetaDetails => {
    const action = useMemo(() => {
        if (typeof type !== 'string' || typeof id !== 'string') {
            return { action: 'Unload' };
        }

        return {
            action: 'Load',
            args: {
                model: 'MetaDetails',
                args: {
                    metaPath: {
                        resource: 'meta',
                        type,
                        id,
                        extra: [],
                    },
                    streamPath: typeof videoId === 'string' && videoId.length > 0 ?
                        {
                            resource: 'stream',
                            type,
                            id: videoId,
                            extra: [],
                        }
                        :
                        null,
                    guessStream: true,
                },
            },
        };
    }, [type, id, videoId]);

    return useModelState({ model: 'meta_details', action }) as MetaDetails;
};

export default useDetails;
