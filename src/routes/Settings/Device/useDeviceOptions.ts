// Copyright (C) 2017-2026 Smart code 203358507

import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { useCore } from 'stremio/core';
import useMpvConfig from './useMpvConfig';

const useDeviceOptions = (profile: Profile) => {
    const { t } = useTranslation();
    const core = useCore();
    const mpvConfigSelect = useMpvConfig();

    const surroundSoundToggle = useMemo(() => ({
        checked: profile.settings.surroundSound,
        onClick: () => {
            core.transport.dispatch({
                action: 'Ctx',
                args: {
                    action: 'UpdateSettings',
                    args: {
                        ...profile.settings,
                        surroundSound: !profile.settings.surroundSound
                    }
                }
            });
        }
    }), [profile.settings]);

    const hardwareDecodingToggle = useMemo(() => ({
        checked: profile.settings.hardwareDecoding,
        onClick: () => {
            core.transport.dispatch({
                action: 'Ctx',
                args: {
                    action: 'UpdateSettings',
                    args: {
                        ...profile.settings,
                        hardwareDecoding: !profile.settings.hardwareDecoding
                    }
                }
            });
        }
    }), [profile.settings]);

    const gpuVideoProcessingToggle = useMemo(() => ({
        checked: profile.settings.gpuVideoProcessing,
        onClick: () => {
            core.transport.dispatch({
                action: 'Ctx',
                args: {
                    action: 'UpdateSettings',
                    args: {
                        ...profile.settings,
                        gpuVideoProcessing: !profile.settings.gpuVideoProcessing
                    }
                }
            });
        }
    }), [profile.settings]);

    const videoModeSelect = useMemo(() => ({
        options: [
            {
                value: null,
                label: t('SETTINGS_VIDEO_MODE_DEFAULT'),
            },
            {
                value: 'legacy',
                label: t('SETTINGS_VIDEO_MODE_LEGACY'),
            }
        ],
        value: profile.settings.videoMode,
        title: () => {
            return profile.settings.videoMode === 'legacy' ?
                t('SETTINGS_VIDEO_MODE_LEGACY')
                :
                t('SETTINGS_VIDEO_MODE_DEFAULT');
        },
        onSelect: (value: string | null) => {
            core.transport.dispatch({
                action: 'Ctx',
                args: {
                    action: 'UpdateSettings',
                    args: {
                        ...profile.settings,
                        videoMode: value,
                    }
                }
            });
        }
    }), [profile.settings]);

    const pauseOnMinimizeToggle = useMemo(() => ({
        checked: profile.settings.pauseOnMinimize,
        onClick: () => {
            core.transport.dispatch({
                action: 'Ctx',
                args: {
                    action: 'UpdateSettings',
                    args: {
                        ...profile.settings,
                        pauseOnMinimize: !profile.settings.pauseOnMinimize,
                    }
                }
            });
        }
    }), [profile.settings]);

    const quitOnCloseToggle = useMemo(() => ({
        checked: profile.settings.quitOnClose,
        onClick: () => {
            core.transport.dispatch({
                action: 'Ctx',
                args: {
                    action: 'UpdateSettings',
                    args: {
                        ...profile.settings,
                        quitOnClose: !profile.settings.quitOnClose
                    }
                }
            });
        }
    }), [profile.settings]);

    const escExitFullscreenToggle = useMemo(() => ({
        checked: profile.settings.escExitFullscreen,
        onClick: () => {
            core.transport.dispatch({
                action: 'Ctx',
                args: {
                    action: 'UpdateSettings',
                    args: {
                        ...profile.settings,
                        escExitFullscreen: !profile.settings.escExitFullscreen
                    }
                }
            });
        }
    }), [profile.settings]);

    const discordRpcToggle = useMemo(() => ({
        checked: profile.settings.discordRpcEnabled === true,
        onClick: () => {
            core.transport.dispatch({
                action: 'Ctx',
                args: {
                    action: 'UpdateSettings',
                    args: {
                        ...profile.settings,
                        discordRpcEnabled: !profile.settings.discordRpcEnabled
                    }
                }
            });
        }
    }), [profile.settings]);

    return {
        surroundSoundToggle,
        hardwareDecodingToggle,
        gpuVideoProcessingToggle,
        videoModeSelect,
        pauseOnMinimizeToggle,
        quitOnCloseToggle,
        escExitFullscreenToggle,
        discordRpcToggle,
        mpvConfigSelect,
    };
};

export default useDeviceOptions;
