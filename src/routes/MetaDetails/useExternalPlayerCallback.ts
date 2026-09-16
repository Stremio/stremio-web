// Copyright (C) 2017-2026 Smart code 203358507

import React from 'react';
import { useSearchParams } from 'react-router-dom';
import { useCore } from 'stremio/core';

type UrlParams = {
    type?: string,
    id?: string,
    videoId?: string,
};

const useExternalPlayerCallback = (
    urlParams: UrlParams,
    metaDetails: MetaDetails,
) => {
    const core = useCore();
    const [searchParams, setSearchParams] = useSearchParams();
    const callbackRef = React.useRef<string | null>(null);

    React.useEffect(() => {
        const position = searchParams.get('position');
        if (position === null || position === '') {
            return;
        }

        const positionNumber = Number(position);
        const time = Math.round(positionNumber * 1000);
        const streamPath = metaDetails.selected?.streamPath ?? null;
        const callbackKey = [
            urlParams.type,
            urlParams.id,
            urlParams.videoId,
            time,
            searchParams.get('lastPlayedUrl')
        ].join(':');
        if (
            !Number.isFinite(positionNumber) ||
            positionNumber < 0 ||
            streamPath === null ||
            metaDetails.libraryItem === null ||
            callbackRef.current === callbackKey
        ) {
            return;
        }

        callbackRef.current = callbackKey;
        core.transport.dispatch({
            action: 'MetaDetails',
            args: {
                action: 'ExternalPlayerProgressChanged',
                args: {
                    time
                }
            }
        });
        const nextSearchParams = new URLSearchParams(searchParams);
        nextSearchParams.delete('position');
        nextSearchParams.delete('lastPlayedUrl');
        setSearchParams(nextSearchParams, { replace: true });
    }, [urlParams, searchParams, setSearchParams, metaDetails]);
};

export default useExternalPlayerCallback;
