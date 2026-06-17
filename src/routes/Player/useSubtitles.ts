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

const findTrackByLanguage = (tracks: SubtitleTrack[], language?: string | null) => {
    if (!language) {
        return undefined;
    }

    const languageCode = languages.toCode(language);

    return tracks.find((track) => {
        return track.lang === language || languages.toCode(track.lang) === languageCode;
    });
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
    const toast = useToast();
    const videoRef = useRef(video);
    const settingsRef = useRef(settings);
    const defaultTrackSelected = useRef(false);
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
        lastSelectedTrack.current = { id: track.id, embedded };
        streamStateChanged({
            subtitleTrack: {
                id: track.id,
                embedded,
                lang: track.lang,
            },
        });
    }, [streamStateChanged]);

    const disableSubtitles = useCallback(() => {
        defaultTrackSelected.current = true;
        video.setSubtitlesTrack(null);
        video.setExtraSubtitlesTrack(null);
        streamStateChanged({ subtitleTrack: null });
    }, [streamStateChanged, video]);

    const selectEmbeddedTrack = useCallback((track: SubtitleTrack | null) => {
        if (!track) {
            disableSubtitles();
            return;
        }

        defaultTrackSelected.current = true;
        video.setSubtitlesTrack(track.id);
        rememberTrack(track, true);
    }, [disableSubtitles, rememberTrack, video]);

    const selectExtraTrack = useCallback((track: SubtitleTrack | null) => {
        if (!track) {
            disableSubtitles();
            return;
        }

        defaultTrackSelected.current = true;
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
        if (defaultTrackSelected.current) {
            return;
        }

        if (settings.subtitlesLanguage === null) {
            video.setSubtitlesTrack(null);
            video.setExtraSubtitlesTrack(null);
            defaultTrackSelected.current = true;
            return;
        }

        const savedTrack = player.streamState?.subtitleTrack;
        const savedTrackId = savedTrack?.id;
        const savedLanguage = savedTrack?.lang;
        const savedExternalTrack = Boolean(savedTrackId && savedTrack?.embedded === false);
        const embeddedTrack = savedTrackId ?
            findTrackById(video.state.subtitlesTracks, savedTrackId)
            :
            findTrackByLanguage(video.state.subtitlesTracks, savedLanguage ?? settings.subtitlesLanguage);
        const extraTrack = savedTrackId ?
            findTrackById(video.state.extraSubtitlesTracks, savedTrackId)
            :
            findTrackByLanguage(video.state.extraSubtitlesTracks, savedLanguage ?? settings.subtitlesLanguage);

        if (embeddedTrack?.id) {
            if (video.state.selectedSubtitlesTrackId !== embeddedTrack.id ||
                video.state.selectedExtraSubtitlesTrackId !== null) {
                video.setSubtitlesTrack(embeddedTrack.id);
            }

            defaultTrackSelected.current = true;
            return;
        }

        if (extraTrack?.id) {
            if (video.state.selectedExtraSubtitlesTrackId !== extraTrack.id ||
                video.state.selectedSubtitlesTrackId !== null) {
                video.setExtraSubtitlesTrack(extraTrack.id);
            }

            if (savedExternalTrack) {
                defaultTrackSelected.current = true;
            }
        }
    }, [
        player.streamState,
        settings.subtitlesLanguage,
        video.state.extraSubtitlesTracks,
        video.state.selectedExtraSubtitlesTrackId,
        video.state.selectedSubtitlesTrackId,
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
        defaultTrackSelected.current = false;
        lastSelectedTrack.current = null;
    }, [video.state.stream]);

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
                lastSelectedTrack.current = {
                    id: video.state.selectedSubtitlesTrackId,
                    embedded: true,
                };
            } else if (video.state.selectedExtraSubtitlesTrackId) {
                lastSelectedTrack.current = {
                    id: video.state.selectedExtraSubtitlesTrackId,
                    embedded: false,
                };
            }

            video.setSubtitlesTrack(null);
            video.setExtraSubtitlesTrack(null);
            return;
        }

        const savedTrack = player.streamState?.subtitleTrack ?? lastSelectedTrack.current;
        if (savedTrack?.id) {
            savedTrack.embedded ?
                video.setSubtitlesTrack(savedTrack.id)
                :
                video.setExtraSubtitlesTrack(savedTrack.id);
        }
    }, [
        player.streamState,
        video.state.selectedExtraSubtitlesTrackId,
        video.state.selectedSubtitlesTrackId,
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
