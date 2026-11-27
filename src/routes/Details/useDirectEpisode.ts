// Copyright (C) 2017-2026 Smart code 203358507

import { useEffect, useRef, useState } from 'react';
import { useLocation } from 'react-router';
import useEpisodeNavigation from './useEpisodeNavigation';

const useDirectEpisode = (video: Video | null, videoId: string | undefined, metaItem: MetaItemMetaDetails | null, streams: MetaDetails['streams']) => {
    const location = useLocation();
    const { fromVideos, insertVideos } = useEpisodeNavigation();
    const directVideo = video !== null && video.id === videoId && !fromVideos && !metaItem?.behaviorHints.defaultVideoId ? video : null;
    const [shownStreams, setShownStreams] = useState(streams);
    if (directVideo === null && shownStreams !== streams) {
        setShownStreams(streams);
    }

    const insertedVideosKeyRef = useRef<string | null>(null);
    useEffect(() => {
        if (directVideo !== null && insertedVideosKeyRef.current !== location.key) {
            insertedVideosKeyRef.current = location.key;
            insertVideos(directVideo);
        }
    }, [directVideo, location.key, insertVideos]);

    return shownStreams;
};

export default useDirectEpisode;
