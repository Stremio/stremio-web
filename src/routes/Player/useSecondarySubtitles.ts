// Copyright (C) 2017-2026 Smart code 203358507

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import type { SubtitleTrack, VideoController } from './useSubtitles.d';
import { languages } from 'stremio/common';

const STORAGE_KEY = 'secondary_subtitles_v1';
const DEFAULT_PREFERENCES = { enabled: false, language: '', offset: 95 };

const readPreferences = () => {
    try {
        const value = JSON.parse(localStorage.getItem(STORAGE_KEY) || 'null');
        if (value && typeof value.enabled === 'boolean' && typeof value.language === 'string' &&
            typeof value.offset === 'number' && Number.isFinite(value.offset) && value.offset >= 0 && value.offset <= 100) {
            return { enabled: value.enabled, language: value.language, offset: value.offset };
        }
    } catch { /* Storage is optional. */ }
    return DEFAULT_PREFERENCES;
};

const sameTrack = (left: SubtitleTrack | null, right: SubtitleTrack | null) => (
    !!left && !!right && left.id === right.id && !!left.embedded === !!right.embedded
);

const useSecondarySubtitles = (video: VideoController) => {
    const [preferences, setPreferences] = useState(readPreferences);
    const selectionLocked = useRef(false);
    const previousStream = useRef(video.state.stream);
    const supported = video.state.manifest?.props.includes('secondarySubtitlesTrack') === true;
    const selected = video.state.secondarySubtitlesTrack;
    const { setSecondarySubtitlesTrack, setSecondarySubtitlesOffset, setSecondarySubtitlesDelay } = video;
    const primary = video.state.subtitlesTracks.find((track) => track.id === video.state.selectedSubtitlesTrackId) ||
        video.state.extraSubtitlesTracks.find((track) => track.id === video.state.selectedExtraSubtitlesTrackId) || null;

    const tracks = useMemo(() => {
        if (!supported) return [];
        return video.state.subtitlesTracks.filter((track) => track.secondarySupported)
            .concat(video.state.extraSubtitlesTracks.filter((track) => !track.local && /^https?:\/\//i.test(track.url || '')))
            .filter((track) => !sameTrack(track, primary));
    }, [supported, video.state.subtitlesTracks, video.state.extraSubtitlesTracks, primary]);

    const remember = useCallback((update: Partial<typeof DEFAULT_PREFERENCES>) => {
        setPreferences((previous) => {
            const next = { ...previous, ...update };
            try { localStorage.setItem(STORAGE_KEY, JSON.stringify(next)); } catch { /* Storage is optional. */ }
            return next;
        });
    }, []);

    const select = useCallback((track: SubtitleTrack | null) => {
        if (!supported || (track && sameTrack(track, primary))) return;
        selectionLocked.current = true;
        setSecondarySubtitlesTrack(track);
        remember({ enabled: track !== null, ...(track ? { language: languages.toCode(track.lang) } : {}) });
    }, [supported, primary, setSecondarySubtitlesTrack, remember]);

    const clearForPrimary = useCallback((track: SubtitleTrack | null) => {
        if (supported && (!track || sameTrack(track, selected))) {
            selectionLocked.current = true;
            setSecondarySubtitlesTrack(null);
        }
    }, [supported, selected, setSecondarySubtitlesTrack]);

    useEffect(() => {
        if (previousStream.current !== video.state.stream) {
            previousStream.current = video.state.stream;
            selectionLocked.current = false;
        }
        if (!supported || video.state.stream === null) return;
        setSecondarySubtitlesOffset(preferences.offset);
        if (selectionLocked.current || !preferences.enabled || !primary) return;
        const track = tracks.find((item) => languages.toCode(item.lang) === preferences.language);
        if (track) {
            selectionLocked.current = true;
            setSecondarySubtitlesTrack(track);
        }
    }, [supported, video.state.stream, preferences, primary, tracks, setSecondarySubtitlesTrack, setSecondarySubtitlesOffset]);

    const changeOffset = useCallback((offset: number) => {
        setSecondarySubtitlesOffset(offset);
        remember({ offset });
    }, [setSecondarySubtitlesOffset, remember]);

    const menuProps = useMemo(() => ({
        secondarySubtitlesSupported: supported,
        secondarySubtitlesTracks: tracks,
        secondarySubtitlesTrack: selected,
        secondarySubtitlesLoading: video.state.secondarySubtitlesLoading,
        secondarySubtitlesOffset: video.state.secondarySubtitlesOffset,
        secondarySubtitlesDelay: video.state.secondarySubtitlesDelay,
        onSecondarySubtitlesTrackSelected: select,
        onSecondarySubtitlesOffsetChanged: changeOffset,
        onSecondarySubtitlesDelayChanged: setSecondarySubtitlesDelay,
    }), [supported, tracks, selected, video.state.secondarySubtitlesLoading, video.state.secondarySubtitlesOffset,
        video.state.secondarySubtitlesDelay, select, changeOffset, setSecondarySubtitlesDelay]);

    return { clearForPrimary, menuProps };
};

export default useSecondarySubtitles;
