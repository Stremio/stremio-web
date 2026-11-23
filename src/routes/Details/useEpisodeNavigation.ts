// Copyright (C) 2017-2026 Smart code 203358507

import { useCallback } from 'react';
import { useLocation, useNavigate } from 'react-router';
import { toPath } from 'stremio-router';

type HistoryState = {
    from?: unknown,
    fromVideos?: boolean,
} | null;

const getVideosPath = (video: Video) => {
    const query = typeof video.season === 'number' ? `?${new URLSearchParams({ season: String(video.season) })}` : '';
    return toPath(`${video.deepLinks.metaDetailsVideos}${query}`);
};

const useEpisodeNavigation = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const state = location.state as HistoryState;
    const fromVideos = state?.fromVideos === true;

    const openEpisode = useCallback((href: string) => {
        navigate(toPath(href), { state: { ...state, fromVideos: true } });
    }, [navigate, state]);

    const openVideos = useCallback((video: Video) => {
        if (fromVideos) {
            navigate(-1);
        } else {
            navigate(getVideosPath(video), { replace: true, state: { from: state?.from } });
        }
    }, [navigate, fromVideos, state]);

    const insertVideos = useCallback((video: Video) => {
        navigate(getVideosPath(video), { replace: true, state: { from: state?.from } });
        navigate(`${location.pathname}${location.search}`, { state: { ...state, fromVideos: true } });
    }, [navigate, location.pathname, location.search, state]);

    return { fromVideos, openEpisode, openVideos, insertVideos };
};

export default useEpisodeNavigation;
