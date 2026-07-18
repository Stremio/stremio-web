// Copyright (C) 2017-2026 Smart code 203358507

import { useCallback, useEffect, useMemo, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { CONSTANTS, languages, onFileDrop, onShortcut, useToast } from 'stremio/common';

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
    sessionPreference: SubtitlePreference | null,
    savedTrack: SubtitlesTrackState | null | undefined,
    globalLanguage: string | null,
) => {
    const candidates: SubtitleCandidate[] = [];
    const languagesOrder: string[] = [];
    const sessionEnabled = sessionPreference?.enabled === true;
    const sessionLanguage = normalizeLanguage(sessionPreference?.language);
    const savedLanguage = normalizeLanguage(savedTrack?.language);
    const savedSource = savedTrack ? (savedTrack.embedded ? 'embedded' : 'external') : undefined;
    const preferredSource = sessionEnabled ? sessionPreference.source : savedSource;
    const sources: SubtitleSource[] = preferredSource === 'external' ?
        ['external', 'embedded']
        :
        ['embedded', 'external'];

    const addLanguage = (language?: string) => {
        if (language && !languagesOrder.includes(language)) {
            languagesOrder.push(language);
        }
    };

    if (savedTrack?.id && (!sessionEnabled ||
        !sessionPreference.source || sessionPreference.source === savedSource)) {
        candidates.push({
            source: savedSource as SubtitleSource,
            id: savedTrack.id,
            ...(sessionLanguage ? { language: sessionLanguage } : {}),
        });
    }

    if (sessionEnabled) {
        addLanguage(sessionLanguage ?? savedLanguage);
    } else {
        addLanguage(savedLanguage);
    }
    addLanguage(normalizeLanguage(globalLanguage));
    if (sessionEnabled) {
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
    subtitlePreferenceChanged,
    menusOpen,
    closeMenus,
    closeSubtitlesMenu,
    toggleSubtitlesMenu,
}: UseSubtitlesArgs): UseSubtitlesResult => {
    const { t } = useTranslation();
    const toast = useToast();
    const videoRef = useRef(video);
    const settingsRef = useRef(settings);
    const trackSelectionLocked = useRef(false);
    const appliedTrack = useRef<{ id: string, source: SubtitleSource } | null>(null);
    const lastSelectedTrack = useRef<SelectedSubtitleTrack | null>(null);

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
        const language = normalizeLanguage(track.lang);
        lastSelectedTrack.current = {
            id: track.id,
            embedded,
            ...(language ? { language } : {}),
        };
        streamStateChanged({
            subtitleTrack: {
                id: track.id,
                embedded,
                language: track.lang,
            },
        });
        subtitlePreferenceChanged({
            enabled: true,
            source: embedded ? 'embedded' : 'external',
            ...(language ? { language } : {}),
        });
    }, [streamStateChanged, subtitlePreferenceChanged]);

    const disableSubtitles = useCallback(() => {
        const selectedTrack = video.state.selectedSubtitlesTrackId !== null ?
            findTrackById(video.state.subtitlesTracks, video.state.selectedSubtitlesTrackId)
            :
            findTrackById(video.state.extraSubtitlesTracks, video.state.selectedExtraSubtitlesTrackId);
        const selectedSource = video.state.selectedSubtitlesTrackId !== null ?
            'embedded'
            :
            video.state.selectedExtraSubtitlesTrackId !== null ?
                'external'
                :
                undefined;
        const source = player.subtitlePreference?.source ?? selectedSource;
        const language = player.subtitlePreference?.language ?? normalizeLanguage(selectedTrack?.lang);

        trackSelectionLocked.current = true;
        appliedTrack.current = null;
        video.setSubtitlesTrack(null);
        video.setExtraSubtitlesTrack(null);
        streamStateChanged({ subtitleTrack: null });
        subtitlePreferenceChanged({
            enabled: false,
            ...(source ? { source } : {}),
            ...(language ? { language } : {}),
        });
    }, [player.subtitlePreference, streamStateChanged, subtitlePreferenceChanged, video]);

    const selectEmbeddedTrack = useCallback((track: SubtitleTrack | null) => {
        if (!track) {
            disableSubtitles();
            return;
        }

        trackSelectionLocked.current = true;
        appliedTrack.current = { id: track.id, source: 'embedded' };
        video.setSubtitlesTrack(track.id);
        rememberTrack(track, true);
    }, [disableSubtitles, rememberTrack, video]);

    const selectExtraTrack = useCallback((track: SubtitleTrack | null) => {
        if (!track) {
            disableSubtitles();
            return;
        }

        trackSelectionLocked.current = true;
        appliedTrack.current = { id: track.id, source: 'external' };
        video.setExtraSubtitlesTrack(track.id);
        rememberTrack(track, false);
    }, [disableSubtitles, rememberTrack, video]);

    const changeDelay = useCallback((delay: number) => {
        video.setSubtitlesDelay(delay);
        streamStateChanged({ subtitleDelay: delay });
    }, [streamStateChanged, video]);

    const increaseDelay = useCallback(() => {
        changeDelay((video.state.extraSubtitlesDelay ?? 0) + 250);
    }, [changeDelay, video.state.extraSubtitlesDelay]);

    const decreaseDelay = useCallback(() => {
        changeDelay((video.state.extraSubtitlesDelay ?? 0) - 250);
    }, [changeDelay, video.state.extraSubtitlesDelay]);

    const changeSize = useCallback((size: number) => {
        video.setSubtitlesSize(size);
        streamStateChanged({ subtitleSize: size });
    }, [streamStateChanged, video]);

    const updateSize = useCallback((delta: number) => {
        const sizes = CONSTANTS.SUBTITLES_SIZES as number[];
        const sizeIndex = sizes.indexOf(video.state.subtitlesSize ?? -1);
        const nextIndex = Math.max(0, Math.min(sizes.length - 1, sizeIndex + delta));

        changeSize(sizes[nextIndex]);
    }, [changeSize, video.state.subtitlesSize]);

    const changeOffset = useCallback((offset: number) => {
        video.setSubtitlesOffset(offset);
        streamStateChanged({ subtitleOffset: offset });
    }, [streamStateChanged, video]);

    onFileDrop(CONSTANTS.SUPPORTED_LOCAL_SUBTITLES, (file: File, buffer: ArrayBuffer) => {
        videoRef.current.addLocalSubtitles(file.name, buffer);
    });

    useEffect(() => {
        if (video.state.stream !== null) {
            video.addExtraSubtitlesTracks(externalSubtitles);
        }
    }, [externalSubtitles, video.state.stream]);

    useEffect(() => {
        trackSelectionLocked.current = false;
        appliedTrack.current = null;
        lastSelectedTrack.current = null;
    }, [video.state.stream]);

    useEffect(() => {
        if (trackSelectionLocked.current) {
            return;
        }

        const sessionPreference = player.subtitlePreference;
        const sessionEnabled = sessionPreference?.enabled === true;

        if (sessionPreference?.enabled === false || (!sessionEnabled && settings.subtitlesLanguage === null)) {
            if (video.state.selectedSubtitlesTrackId !== null ||
                video.state.selectedExtraSubtitlesTrackId !== null) {
                video.setSubtitlesTrack(null);
                video.setExtraSubtitlesTrack(null);
            }
            appliedTrack.current = null;
            return;
        }

        const savedTrack = player.streamState?.subtitleTrack;
        const candidates = buildCandidates(sessionPreference, savedTrack, settings.subtitlesLanguage);
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
            if (sessionEnabled && selectedTrack) {
                video.setSubtitlesTrack(null);
                video.setExtraSubtitlesTrack(null);
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
            video.setSubtitlesTrack(trackToApply.track.id)
            :
            video.setExtraSubtitlesTrack(trackToApply.track.id);
        appliedTrack.current = {
            id: trackToApply.track.id,
            source: trackToApply.source,
        };
    }, [
        player.subtitlePreference,
        player.streamState,
        settings.subtitlesLanguage,
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
            video.setSubtitlesDelay(delay);
        }

        const size = player.streamState?.subtitleSize;
        if (typeof size === 'number') {
            video.setSubtitlesSize(size);
        }

        const offset = player.streamState?.subtitleOffset;
        if (typeof offset === 'number') {
            video.setSubtitlesOffset(offset);
        }
    }, [player.streamState, video.state.stream]);

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

    onShortcut('subtitlesDelay', (combo) => {
        combo === 1 ? increaseDelay() : decreaseDelay();
    }, [increaseDelay, decreaseDelay], !menusOpen);

    onShortcut('subtitlesSize', (combo) => {
        combo === 1 ? updateSize(1) : updateSize(-1);
    }, [updateSize], !menusOpen);

    onShortcut('toggleSubtitles', () => {
        const subtitlesEnabled = video.state.selectedSubtitlesTrackId !== null ||
            video.state.selectedExtraSubtitlesTrackId !== null;

        if (subtitlesEnabled) {
            if (video.state.selectedSubtitlesTrackId) {
                const track = findTrackById(
                    video.state.subtitlesTracks,
                    video.state.selectedSubtitlesTrackId,
                );
                const language = normalizeLanguage(track?.lang);
                lastSelectedTrack.current = {
                    id: video.state.selectedSubtitlesTrackId,
                    embedded: true,
                    ...(language ? { language } : {}),
                };
            } else if (video.state.selectedExtraSubtitlesTrackId) {
                const track = findTrackById(
                    video.state.extraSubtitlesTracks,
                    video.state.selectedExtraSubtitlesTrackId,
                );
                const language = normalizeLanguage(track?.lang);
                lastSelectedTrack.current = {
                    id: video.state.selectedExtraSubtitlesTrackId,
                    embedded: false,
                    ...(language ? { language } : {}),
                };
            }

            disableSubtitles();
            return;
        }

        const savedTrack = player.streamState?.subtitleTrack ?? lastSelectedTrack.current;
        const source = player.subtitlePreference?.source ??
            (savedTrack ? (savedTrack.embedded ? 'embedded' : 'external') : undefined);
        const language = player.subtitlePreference?.language ?? normalizeLanguage(savedTrack?.language);

        trackSelectionLocked.current = false;
        appliedTrack.current = null;
        subtitlePreferenceChanged({
            enabled: true,
            ...(source ? { source } : {}),
            ...(language ? { language } : {}),
        });
    }, [
        disableSubtitles,
        player.subtitlePreference,
        player.streamState,
        subtitlePreferenceChanged,
        video.state.extraSubtitlesTracks,
        video.state.selectedExtraSubtitlesTrackId,
        video.state.selectedSubtitlesTrackId,
        video.state.subtitlesTracks,
    ], !menusOpen);

    onShortcut('subtitlesMenu', () => {
        closeMenus();
        if (hasTracks) {
            toggleSubtitlesMenu();
        }
    }, [closeMenus, hasTracks, toggleSubtitlesMenu]);

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
