// Copyright (C) 2017-2023 Smart code 203358507

import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { deepEqual } from 'fast-equals';
import { useServices } from 'stremio/services';

const CACHE_SIZES = [0, 2147483648, 5368709120, 10737418240, null];

const cacheSizeToString = (size: number | null) => {
    return size === null ?
        'Infinite'
        :
        size === 0 ?
            'No caching'
            :
            `${Math.ceil(((size / 1024 / 1024 / 1024) + Number.EPSILON) * 100) / 100}GiB`;
};

type TorrentProfile = {
    btDownloadSpeedHardLimit: number,
    btDownloadSpeedSoftLimit: number,
    btHandshakeTimeout: number,
    btMaxConnections: number,
    btMinPeersForStable: number,
    btRequestTimeout: number
};

const TORRENT_PROFILES: Record<string, TorrentProfile> = {
    default: {
        btDownloadSpeedHardLimit: 3670016,
        btDownloadSpeedSoftLimit: 2621440,
        btHandshakeTimeout: 20000,
        btMaxConnections: 55,
        btMinPeersForStable: 5,
        btRequestTimeout: 4000
    },
    soft: {
        btDownloadSpeedHardLimit: 1677721.6,
        btDownloadSpeedSoftLimit: 1677721.6,
        btHandshakeTimeout: 20000,
        btMaxConnections: 35,
        btMinPeersForStable: 5,
        btRequestTimeout: 4000
    },
    fast: {
        btDownloadSpeedHardLimit: 39321600,
        btDownloadSpeedSoftLimit: 4194304,
        btHandshakeTimeout: 20000,
        btMaxConnections: 200,
        btMinPeersForStable: 10,
        btRequestTimeout: 4000
    },
    'ultra fast': {
        btDownloadSpeedHardLimit: 78643200,
        btDownloadSpeedSoftLimit: 8388608,
        btHandshakeTimeout: 25000,
        btMaxConnections: 400,
        btMinPeersForStable: 10,
        btRequestTimeout: 6000
    }
};

const useStreamingOptions = (streamingServer: StreamingServer) => {
    const { core } = useServices();
    const { t } = useTranslation();
    // TODO combine those useMemo in one

    const settings = useMemo(() => (
        streamingServer?.settings?.type === 'Ready' ?
            streamingServer.settings.content as StreamingServerSettings : null
    ), [streamingServer.settings]);

    const networkInfo = useMemo(() => (
        streamingServer?.networkInfo?.type === 'Ready' ?
            streamingServer.networkInfo.content as NetworkInfo : null
    ), [streamingServer.networkInfo]);

    const deviceInfo = useMemo(() => (
        streamingServer?.deviceInfo?.type === 'Ready' ?
            streamingServer.deviceInfo.content as DeviceInfo : null
    ), [streamingServer.deviceInfo]);

    const streamingServerRemoteUrlInput = useMemo(() => ({
        value: streamingServer.remoteUrl,
    }), [streamingServer.remoteUrl]);

    const remoteEndpointSelect = useMemo(() => {
        if (!settings || !networkInfo) {
            return null;
        }

        return {
            options: [
                {
                    label: t('SETTINGS_DISABLED'),
                    value: '',
                },
                ...networkInfo.availableInterfaces.map((address) => ({
                    label: address,
                    value: address,
                }))
            ],
            value: settings.remoteHttps,
            onSelect: (value: string | null) => {
                core.transport.dispatch({
                    action: 'StreamingServer',
                    args: {
                        action: 'UpdateSettings',
                        args: {
                            ...settings,
                            remoteHttps: value,
                        }
                    }
                });
            }
        };
    }, [settings, networkInfo]);

    const cacheSizeSelect = useMemo(() => {
        if (!settings) {
            return null;
        }

        return {
            options: CACHE_SIZES.map((size) => ({
                label: cacheSizeToString(size),
                value: JSON.stringify(size)
            })),
            value: JSON.stringify(settings.cacheSize),
            title: () => {
                return cacheSizeToString(settings.cacheSize);
            },
            onSelect: (value: any) => {
                core.transport.dispatch({
                    action: 'StreamingServer',
                    args: {
                        action: 'UpdateSettings',
                        args: {
                            ...settings,
                            cacheSize: JSON.parse(value),
                        }
                    }
                });
            }
        };
    }, [settings]);

    const torrentProfileSelect = useMemo(() => {
        if (!settings) {
            return null;
        }

        const selectedTorrentProfile = {
            btDownloadSpeedHardLimit: settings.btDownloadSpeedHardLimit,
            btDownloadSpeedSoftLimit: settings.btDownloadSpeedSoftLimit,
            btHandshakeTimeout: settings.btHandshakeTimeout,
            btMaxConnections: settings.btMaxConnections,
            btMinPeersForStable: settings.btMinPeersForStable,
            btRequestTimeout: settings.btRequestTimeout
        };
        const isCustomTorrentProfileSelected = Object.values(TORRENT_PROFILES).every((torrentProfile) => {
            return !deepEqual(torrentProfile, selectedTorrentProfile);
        });
        return {
            options: Object.keys(TORRENT_PROFILES)
                .map((profileName) => ({
                    label: t('TORRENT_PROFILE_' + profileName.replace(' ', '_').toUpperCase()),
                    value: JSON.stringify(TORRENT_PROFILES[profileName])
                }))
                .concat(
                    isCustomTorrentProfileSelected ?
                        [{
                            label: 'custom',
                            value: JSON.stringify(selectedTorrentProfile)
                        }]
                        :
                        []
                ),
            value: JSON.stringify(selectedTorrentProfile),
            onSelect: (value: any) => {
                core.transport.dispatch({
                    action: 'StreamingServer',
                    args: {
                        action: 'UpdateSettings',
                        args: {
                            ...settings,
                            ...JSON.parse(value),
                        }
                    }
                });
            }
        };
    }, [settings]);

    const transcodingProfileSelect = useMemo(() => {
        if (!settings || !deviceInfo) {
            return null;
        }

        return {
            options: [
                {
                    label: t('SETTINGS_DISABLED'),
                    value: null,
                },
                ...deviceInfo.availableHardwareAccelerations.map((name) => ({
                    label: name,
                    value: name,
                }))
            ],
            value: settings.transcodeProfile,
            onSelect: (value: string | null) => {
                core.transport.dispatch({
                    action: 'StreamingServer',
                    args: {
                        action: 'UpdateSettings',
                        args: {
                            ...settings,
                            transcodeProfile: value,
                        }
                    }
                });
            }
        };
    }, [settings, deviceInfo]);

    return {
        streamingServerRemoteUrlInput,
        remoteEndpointSelect,
        cacheSizeSelect,
        torrentProfileSelect,
        transcodingProfileSelect,
    };
};

export default useStreamingOptions;
