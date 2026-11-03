// Copyright (C) 2017-2026 Smart code 203358507

import { useCallback, useEffect, useMemo, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { CONSTANTS, getKeyboardShortcutKeys, languages, useFileDropListener, useInterval, useShortcut, useTimeout, useToast } from 'stremio/common';
import {
    getSubtitleDelayStepMultiplier,
    snapSubtitleDelay,
    SUBTITLES_DELAY_REPEAT_DELAY_MS,
    SUBTITLES_DELAY_REPEAT_INTERVAL_MS,
    SUBTITLES_DELAY_STEP_MS,
} from './subtitleDelay';

const withFallbackLabels = (tracks?: SubtitleTrack[] | null): SubtitleTrack[] => {
    if (!Array.isArray(tracks)) {
        return [];
    }

    return tracks.map((track) => ({
        ...track,
        label: track.label || track.url || '',
    }));
};

const findTrackById = (tracks: SubtitleTrack[], id?: string | null) => {
    if (!id) {
        return undefined;
    }

    return tracks.find((track) => track.id === id);
};

const normalizeLanguage = (language?: string | null) => {
    if (!language) {
        return undefined;
    }

    const value = language.trim();
    const normalized = languages.find(value) ?? languages.find(value.toLowerCase());

    return normalized?.code;
};

const findTrackByLanguage = (tracks: SubtitleTrack[], language?: string | null) => {
    const languageCode = normalizeLanguage(language);
    if (!languageCode) {
        return undefined;
    }

    return tracks.find((track) => normalizeLanguage(track.lang) === languageCode);
};

type SubtitleCandidate = {
    source: SubtitleSource,
    id?: string,
    language?: string,
};

type ResolvedSubtitleCandidate = {
    source: SubtitleSource,
    rank: number,
    track: SubtitleTrack,
};

type SubtitleDelayHold = {
    direction: number,
    key: string,
    repeated: boolean,
    startedAt: number,
    stream: unknown,
    value: number,
};

const candidateMatchesTrack = (
    candidate: SubtitleCandidate,
    source: SubtitleSource,
    track: SubtitleTrack,
) => {
    if (candidate.source !== source || (candidate.id && candidate.id !== track.id)) {
        return false;
    }

    return !candidate.language || normalizeLanguage(track.lang) === candidate.language;
};

const resolveCandidate = (
    candidate: SubtitleCandidate,
    subtitlesTracks: SubtitleTrack[],
    extraSubtitlesTracks: SubtitleTrack[],
) => {
    const tracks = candidate.source === 'embedded' ? subtitlesTracks : extraSubtitlesTracks;
    const track = candidate.id ?
        findTrackById(tracks, candidate.id)
        :
        findTrackByLanguage(tracks, candidate.language);

    return track && (!candidate.language || normalizeLanguage(track.lang) === candidate.language) ?
        track
        :
        undefined;
};

const buildCandidates = (
    savedTrack: SubtitlesTrackState | null | undefined,
    subtitlesEnabled: boolean | undefined,
    globalLanguage: string | null,
) => {
    const candidates: SubtitleCandidate[] = [];
    const languagesOrder: string[] = [];
    const savedLanguage = normalizeLanguage(savedTrack?.language);
    const savedSource: SubtitleSource | undefined = savedTrack ?
        (savedTrack.embedded ? 'embedded' : 'external')
        :
        undefined;
    const sources: SubtitleSource[] = savedSource === 'external' ?
        ['external', 'embedded']
        :
        ['embedded', 'external'];

    const addLanguage = (language?: string) => {
        if (language && !languagesOrder.includes(language)) {
            languagesOrder.push(language);
        }
    };

    if (savedSource && savedTrack?.id) {
        candidates.push({
            source: savedSource,
            id: savedTrack.id,
            ...(savedLanguage ? { language: savedLanguage } : {}),
        });
    }

    addLanguage(savedLanguage);
    addLanguage(normalizeLanguage(globalLanguage));
    if (subtitlesEnabled) {
        addLanguage(normalizeLanguage(CONSTANTS.DEFAULT_SUBTITLES_LANGUAGE));
    }

    // Keep language ahead of source so the selected language can cross source types.
    languagesOrder.forEach((language) => {
        sources.forEach((source) => candidates.push({ source, language }));
    });

    return candidates;
};

const resolveBestCandidate = (
    candidates: SubtitleCandidate[],
    subtitlesTracks: SubtitleTrack[],
    extraSubtitlesTracks: SubtitleTrack[],
): ResolvedSubtitleCandidate | undefined => {
    for (let rank = 0; rank < candidates.length; rank++) {
        const candidate = candidates[rank];
        const track = resolveCandidate(candidate, subtitlesTracks, extraSubtitlesTracks);
        if (track) {
            return { source: candidate.source, rank, track };
        }
    }

    return undefined;
};

const findCandidateRank = (
    candidates: SubtitleCandidate[],
    source: SubtitleSource,
    track: SubtitleTrack,
) => {
    return candidates.findIndex((candidate) => candidateMatchesTrack(candidate, source, track));
};

const useSubtitles = ({
    player,
    video,
    settings,
    streamStateChanged,
    menusOpen,
    closeMenus,
    closeSubtitlesMenu,
    toggleSubtitlesMenu,
}: UseSubtitlesArgs): UseSubtitlesResult => {
    const { t } = useTranslation();
    const { setSubtitlesTrack, setExtraSubtitlesTrack, setSubtitlesDelay, setSubtitlesSize, setSubtitlesOffset } = video;
    const toast = useToast();
    const videoRef = useRef(video);
    const settingsRef = useRef(settings);
    const trackSelectionLocked = useRef(false);
    const appliedTrack = useRef<{ id: string, source: SubtitleSource } | null>(null);
    const subtitleDelayHold = useRef<SubtitleDelayHold | null>(null);
    const subtitleDelayInterval = useInterval(SUBTITLES_DELAY_REPEAT_INTERVAL_MS);
    const subtitleDelayTimeout = useTimeout(SUBTITLES_DELAY_REPEAT_DELAY_MS);

    videoRef.current = video;
    settingsRef.current = settings;

    const streamSubtitles = useMemo(() => {
        return withFallbackLabels(player.selected?.stream.subtitles);
    }, [player.selected]);

    const externalSubtitles = useMemo(() => {
        return withFallbackLabels(player.subtitles);
    }, [player.subtitles]);

    const allTracks = useMemo(() => {
        return video.state.subtitlesTracks.concat(video.state.extraSubtitlesTracks);
    }, [video.state.subtitlesTracks, video.state.extraSubtitlesTracks]);

    const hasTracks = allTracks.length > 0;
    const applySubtitleStyle = useCallback(() => {
        const currentSettings = settingsRef.current;
        const currentVideo = videoRef.current;

        currentVideo.setSubtitlesSize(currentSettings.subtitlesSize);
        currentVideo.setSubtitlesOffset(currentSettings.subtitlesOffset);
        currentVideo.setSubtitlesTextColor(currentSettings.subtitlesTextColor);
        currentVideo.setSubtitlesBackgroundColor(currentSettings.subtitlesBackgroundColor);
        currentVideo.setSubtitlesOutlineColor(currentSettings.subtitlesOutlineColor);
    }, []);

    const rememberTrack = useCallback((track: SubtitleTrack, embedded: boolean) => {
        streamStateChanged({
            subtitleTrack: {
                id: track.id,
                embedded,
                language: track.lang,
            },
            subtitlesEnabled: true,
        });
    }, [streamStateChanged]);

    const disableSubtitles = useCallback(() => {
        trackSelectionLocked.current = true;
        appliedTrack.current = null;
        setSubtitlesTrack(null);
        setExtraSubtitlesTrack(null);
        streamStateChanged({ subtitlesEnabled: false });
    }, [streamStateChanged, setSubtitlesTrack, setExtraSubtitlesTrack]);

    const selectEmbeddedTrack = useCallback((track: SubtitleTrack | null) => {
        if (!track) {
            disableSubtitles();
            return;
        }

        trackSelectionLocked.current = true;
        appliedTrack.current = { id: track.id, source: 'embedded' };
        setSubtitlesTrack(track.id);
        rememberTrack(track, true);
    }, [disableSubtitles, rememberTrack, setSubtitlesTrack]);

    const selectExtraTrack = useCallback((track: SubtitleTrack | null) => {
        if (!track) {
            disableSubtitles();
            return;
        }

        trackSelectionLocked.current = true;
        appliedTrack.current = { id: track.id, source: 'external' };
        setExtraSubtitlesTrack(track.id);
        rememberTrack(track, false);
    }, [disableSubtitles, rememberTrack, setExtraSubtitlesTrack]);

    const changeDelay = useCallback((delay: number) => {
        setSubtitlesDelay(delay);
        streamStateChanged({ subtitleDelay: delay });
    }, [streamStateChanged, setSubtitlesDelay]);

    const finishSubtitleDelayHold = useCallback((applyStep: boolean) => {
        const hold = subtitleDelayHold.current;
        subtitleDelayInterval.cancel();
        subtitleDelayTimeout.cancel();
        subtitleDelayHold.current = null;

        if (applyStep && hold && !hold.repeated) {
            const delay = hold.value + hold.direction * SUBTITLES_DELAY_STEP_MS;
            changeDelay(snapSubtitleDelay(delay, hold.direction));
        }
    }, [changeDelay]);

    const startSubtitleDelayHold = useCallback((combo: number, key: string, repeat: boolean) => {
        if (repeat || subtitleDelayHold.current) return;

        const hold = {
            direction: combo === 1 ? 1 : -1,
            key: key.toUpperCase(),
            repeated: false,
            startedAt: performance.now(),
            stream: videoRef.current.state.stream,
            value: videoRef.current.state.extraSubtitlesDelay ?? 0,
        };
        subtitleDelayHold.current = hold;

        subtitleDelayTimeout.start(() => subtitleDelayInterval.start(() => {
            if (subtitleDelayHold.current !== hold) return;
            if (videoRef.current.state.stream !== hold.stream) {
                finishSubtitleDelayHold(false);
                return;
            }

            hold.repeated = true;
            const multiplier = getSubtitleDelayStepMultiplier(performance.now() - hold.startedAt);
            const delay = hold.value + hold.direction * SUBTITLES_DELAY_STEP_MS * multiplier;
            hold.value = snapSubtitleDelay(delay, hold.direction);
            changeDelay(hold.value);
        }));
    }, [changeDelay, finishSubtitleDelayHold]);

    useEffect(() => {
        const onKeyUp = (event: KeyboardEvent) => {
            const key = subtitleDelayHold.current?.key;
            if (!key) return;

            const keys = getKeyboardShortcutKeys(event);
            if (keys.includes(`Key${key}`) || keys.includes(key)) {
                finishSubtitleDelayHold(true);
            }
        };
        const onBlur = () => finishSubtitleDelayHold(false);

        document.addEventListener('keyup', onKeyUp);
        window.addEventListener('blur', onBlur);
        return () => {
            document.removeEventListener('keyup', onKeyUp);
            window.removeEventListener('blur', onBlur);
        };
    }, [finishSubtitleDelayHold]);

    useEffect(() => {
        if (menusOpen) finishSubtitleDelayHold(false);
    }, [finishSubtitleDelayHold, menusOpen]);

    const changeSize = useCallback((size: number) => {
        setSubtitlesSize(size);
        streamStateChanged({ subtitleSize: size });
    }, [streamStateChanged, setSubtitlesSize]);

    const updateSize = useCallback((delta: number) => {
        const sizes = CONSTANTS.SUBTITLES_SIZES as number[];
        const sizeIndex = sizes.indexOf(video.state.subtitlesSize ?? -1);
        const nextIndex = Math.max(0, Math.min(sizes.length - 1, sizeIndex + delta));

        changeSize(sizes[nextIndex]);
    }, [changeSize, video.state.subtitlesSize]);

    const changeOffset = useCallback((offset: number) => {
        setSubtitlesOffset(offset);
        streamStateChanged({ subtitleOffset: offset });
    }, [streamStateChanged, setSubtitlesOffset]);

    const onSubtitlesDrop = useCallback((file: File, buffer: ArrayBuffer) => {
        videoRef.current.addLocalSubtitles(file.name, buffer);
    }, []);

    useFileDropListener(CONSTANTS.SUPPORTED_LOCAL_SUBTITLES, onSubtitlesDrop);

    useEffect(() => {
        if (video.state.stream !== null) {
            video.addExtraSubtitlesTracks(externalSubtitles);
        }
    }, [externalSubtitles, video.state.stream]);

    useEffect(() => {
        trackSelectionLocked.current = false;
        appliedTrack.current = null;
    }, [video.state.stream]);

    useEffect(() => {
        if (trackSelectionLocked.current) {
            return;
        }

        const subtitlesEnabled = player.streamState?.subtitlesEnabled;

        if (subtitlesEnabled === false || (!subtitlesEnabled && settings.subtitlesLanguage === null)) {
            if (video.state.selectedSubtitlesTrackId !== null ||
                video.state.selectedExtraSubtitlesTrackId !== null) {
                setSubtitlesTrack(null);
                setExtraSubtitlesTrack(null);
            }
            appliedTrack.current = null;
            return;
        }

        const candidates = buildCandidates(player.streamState?.subtitleTrack, subtitlesEnabled, settings.subtitlesLanguage);
        const bestCandidate = resolveBestCandidate(
            candidates,
            video.state.subtitlesTracks,
            video.state.extraSubtitlesTracks,
        );
        const selectedSource = video.state.selectedSubtitlesTrackId !== null ?
            'embedded'
            :
            video.state.selectedExtraSubtitlesTrackId !== null ?
                'external'
                :
                undefined;
        const selectedTrack = selectedSource === 'embedded' ?
            findTrackById(video.state.subtitlesTracks, video.state.selectedSubtitlesTrackId)
            :
            selectedSource === 'external' ?
                findTrackById(video.state.extraSubtitlesTracks, video.state.selectedExtraSubtitlesTrackId)
                :
                undefined;

        if (!bestCandidate) {
            if (subtitlesEnabled && selectedTrack) {
                setSubtitlesTrack(null);
                setExtraSubtitlesTrack(null);
            }
            appliedTrack.current = null;
            return;
        }

        const selectedRank = selectedTrack && selectedSource ?
            findCandidateRank(candidates, selectedSource, selectedTrack)
            :
            -1;
        const trackToApply = selectedRank === bestCandidate.rank && selectedTrack && selectedSource ?
            { source: selectedSource, track: selectedTrack }
            :
            bestCandidate;

        // Reapply once per stream even if the controller already reports the same track.
        if (appliedTrack.current?.id === trackToApply.track.id &&
            appliedTrack.current.source === trackToApply.source) {
            return;
        }

        trackToApply.source === 'embedded' ?
            setSubtitlesTrack(trackToApply.track.id)
            :
            setExtraSubtitlesTrack(trackToApply.track.id);

        const delay = player.streamState?.subtitleDelay;
        // Selecting an external track resets its delay in stremio-video.
        if (trackToApply.source === 'external' && typeof delay === 'number') {
            setSubtitlesDelay(delay);
        }
        appliedTrack.current = {
            id: trackToApply.track.id,
            source: trackToApply.source,
        };
    }, [
        player.streamState,
        settings.subtitlesLanguage,
        setSubtitlesTrack,
        setExtraSubtitlesTrack,
        setSubtitlesDelay,
        video.state.extraSubtitlesTracks,
        video.state.selectedExtraSubtitlesTrackId,
        video.state.selectedSubtitlesTrackId,
        video.state.stream,
        video.state.subtitlesTracks,
    ]);

    useEffect(() => {
        if (video.state.stream === null) {
            return;
        }

        const delay = player.streamState?.subtitleDelay;
        if (typeof delay === 'number') {
            setSubtitlesDelay(delay);
        }

        const size = player.streamState?.subtitleSize;
        if (typeof size === 'number') {
            setSubtitlesSize(size);
        }

        const offset = player.streamState?.subtitleOffset;
        if (typeof offset === 'number') {
            setSubtitlesOffset(offset);
        }
    }, [player.streamState, video.state.stream, setSubtitlesDelay, setSubtitlesSize, setSubtitlesOffset]);

    useEffect(() => {
        if (!hasTracks) {
            closeSubtitlesMenu();
        }
    }, [closeSubtitlesMenu, hasTracks]);

    useEffect(() => {
        const onSubtitlesTrackLoaded = () => {
            toast.show({
                type: 'success',
                title: t('PLAYER_SUBTITLES_LOADED'),
                message: t('PLAYER_SUBTITLES_LOADED_EMBEDDED'),
                timeout: 3000,
            });
        };

        const onExtraSubtitlesTrackLoaded = (track: SubtitleTrack) => {
            toast.show({
                type: 'success',
                title: t('PLAYER_SUBTITLES_LOADED'),
                message: track.exclusive ?
                    t('PLAYER_SUBTITLES_LOADED_EXCLUSIVE')
                    :
                    track.local ?
                        t('PLAYER_SUBTITLES_LOADED_LOCAL')
                        :
                        t('PLAYER_SUBTITLES_LOADED_ORIGIN', { origin: track.origin }),
                timeout: 3000,
            });
        };

        const onExtraSubtitlesTrackAdded = (track: SubtitleTrack) => {
            if (track.local) {
                videoRef.current.setExtraSubtitlesTrack(track.id);
            }
        };

        video.events.on('subtitlesTrackLoaded', onSubtitlesTrackLoaded);
        video.events.on('extraSubtitlesTrackLoaded', onExtraSubtitlesTrackLoaded);
        video.events.on('extraSubtitlesTrackAdded', onExtraSubtitlesTrackAdded);
        video.events.on('implementationChanged', applySubtitleStyle);

        return () => {
            video.events.off('subtitlesTrackLoaded', onSubtitlesTrackLoaded);
            video.events.off('extraSubtitlesTrackLoaded', onExtraSubtitlesTrackLoaded);
            video.events.off('extraSubtitlesTrackAdded', onExtraSubtitlesTrackAdded);
            video.events.off('implementationChanged', applySubtitleStyle);
        };
    }, [applySubtitleStyle, t, toast, video.events]);

    useShortcut('subtitlesDelay', startSubtitleDelayHold, !menusOpen);

    useShortcut('subtitlesSize', useCallback((combo) => {
        combo === 1 ? updateSize(1) : updateSize(-1);
    }, [updateSize]), !menusOpen);

    useShortcut('toggleSubtitles', useCallback(() => {
        const subtitlesEnabled = video.state.selectedSubtitlesTrackId !== null ||
            video.state.selectedExtraSubtitlesTrackId !== null;

        if (subtitlesEnabled) {
            disableSubtitles();
            return;
        }

        const candidates = buildCandidates(player.streamState?.subtitleTrack, true, settings.subtitlesLanguage);
        const bestCandidate = resolveBestCandidate(
            candidates,
            video.state.subtitlesTracks,
            video.state.extraSubtitlesTracks,
        );
        if (!bestCandidate) {
            trackSelectionLocked.current = false;
            appliedTrack.current = null;
            streamStateChanged({ subtitlesEnabled: true });
            return;
        }

        bestCandidate.source === 'embedded' ?
            selectEmbeddedTrack(bestCandidate.track)
            :
            selectExtraTrack(bestCandidate.track);
    }, [
        disableSubtitles,
        player.streamState,
        selectEmbeddedTrack,
        selectExtraTrack,
        settings.subtitlesLanguage,
        streamStateChanged,
        video.state.extraSubtitlesTracks,
        video.state.selectedExtraSubtitlesTrackId,
        video.state.selectedSubtitlesTrackId,
        video.state.subtitlesTracks,
    ]), !menusOpen);

    useShortcut('subtitlesMenu', useCallback(() => {
        closeMenus();
        if (hasTracks) {
            toggleSubtitlesMenu();
        }
    }, [closeMenus, hasTracks, toggleSubtitlesMenu]));

    const menuProps = useMemo(() => ({
        subtitlesLanguage: settings.subtitlesLanguage,
        interfaceLanguage: settings.interfaceLanguage,
        subtitlesTracks: video.state.subtitlesTracks,
        selectedSubtitlesTrackId: video.state.selectedSubtitlesTrackId,
        subtitlesOffset: video.state.subtitlesOffset,
        subtitlesSize: video.state.subtitlesSize,
        extraSubtitlesTracks: video.state.extraSubtitlesTracks,
        selectedExtraSubtitlesTrackId: video.state.selectedExtraSubtitlesTrackId,
        extraSubtitlesOffset: video.state.extraSubtitlesOffset,
        extraSubtitlesDelay: video.state.extraSubtitlesDelay,
        extraSubtitlesSize: video.state.extraSubtitlesSize,
        assSubtitlesStylingActive: video.state.assSubtitlesStylingActive,
        onSubtitlesTrackSelected: selectEmbeddedTrack,
        onExtraSubtitlesTrackSelected: selectExtraTrack,
        onSubtitlesOffsetChanged: changeOffset,
        onSubtitlesSizeChanged: changeSize,
        onExtraSubtitlesOffsetChanged: changeOffset,
        onExtraSubtitlesDelayChanged: changeDelay,
        onExtraSubtitlesSizeChanged: changeSize,
    }), [
        changeDelay,
        changeOffset,
        changeSize,
        selectEmbeddedTrack,
        selectExtraTrack,
        settings.interfaceLanguage,
        settings.subtitlesLanguage,
        video.state.extraSubtitlesDelay,
        video.state.extraSubtitlesOffset,
        video.state.extraSubtitlesSize,
        video.state.extraSubtitlesTracks,
        video.state.assSubtitlesStylingActive,
        video.state.selectedExtraSubtitlesTrackId,
        video.state.selectedSubtitlesTrackId,
        video.state.subtitlesOffset,
        video.state.subtitlesSize,
        video.state.subtitlesTracks,
    ]);

    return {
        streamSubtitles,
        allSubtitleTracks: allTracks,
        extraSubtitleTracks: video.state.extraSubtitlesTracks,
        selectedExtraSubtitleTrackId: video.state.selectedExtraSubtitlesTrackId,
        subtitlesMenuProps: menuProps,
    };
};

export default useSubtitles;
