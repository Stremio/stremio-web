// Copyright (C) 2017-2023 Smart code 203358507

const React = require('react');
const { useTranslation } = require('react-i18next');
const isEqual = require('lodash.isequal');
const { useServices } = require('stremio/services');

const CACHE_SIZES = [0, 2147483648, 5368709120, 10737418240, null];

const cacheSizeToString = (size) => {
    return size === null ?
        'Infinite'
        :
        size === 0 ?
            'No caching'
            :
            `${Math.ceil(((size / 1024 / 1024 / 1024) + Number.EPSILON) * 100) / 100}GiB`;
};

const TORRENT_PROFILES = {
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

const useStreamingServerSettingsInputs = (streamingServer) => {
    const { core } = useServices();
    const { t } = useTranslation();
    // TODO combine those useMemo in one

    const streamingServerRemoteUrlInput = React.useMemo(() => ({
        value: streamingServer.remoteUrl,
    }), [streamingServer.remoteUrl]);

    const remoteEndpointSelect = React.useMemo(() => {
        if (streamingServer.settings?.type !== 'Ready' || streamingServer.networkInfo?.type !== 'Ready') {
            return null;
        }

        return {
            options: [
                {
                    label: t('SETTINGS_DISABLED'),
                    value: null,
                },
                ...streamingServer.networkInfo.content.availableInterfaces.map((address) => ({
                    label: address,
                    value: address,
                }))
            ],
            selected: [streamingServer.settings.content.remoteHttps],
            onSelect: (event) => {
                core.transport.dispatch({
                    action: 'StreamingServer',
                    args: {
                        action: 'UpdateSettings',
                        args: {
                            ...streamingServer.settings.content,
                            remoteHttps: event.value,
                        }
                    }
                });
            }
        };
    }, [streamingServer.settings, streamingServer.networkInfo]);

    const cacheSizeSelect = React.useMemo(() => {
        if (streamingServer.settings === null || streamingServer.settings.type !== 'Ready') {
            return null;
        }

        return {
            options: CACHE_SIZES.map((size) => ({
                label: cacheSizeToString(size),
                value: JSON.stringify(size)
            })),
            selected: [JSON.stringify(streamingServer.settings.content.cacheSize)],
            renderLabelText: () => {
                return cacheSizeToString(streamingServer.settings.content.cacheSize);
            },
            onSelect: (event) => {
                core.transport.dispatch({
                    action: 'StreamingServer',
                    args: {
                        action: 'UpdateSettings',
                        args: {
                            ...streamingServer.settings.content,
                            cacheSize: JSON.parse(event.value),
                        }
                    }
                });
            }
        };
    }, [streamingServer.settings]);
    const torrentProfileSelect = React.useMemo(() => {
        if (streamingServer.settings === null || streamingServer.settings.type !== 'Ready') {
            return null;
        }

        const selectedTorrentProfile = {
            btDownloadSpeedHardLimit: streamingServer.settings.content.btDownloadSpeedHardLimit,
            btDownloadSpeedSoftLimit: streamingServer.settings.content.btDownloadSpeedSoftLimit,
            btHandshakeTimeout: streamingServer.settings.content.btHandshakeTimeout,
            btMaxConnections: streamingServer.settings.content.btMaxConnections,
            btMinPeersForStable: streamingServer.settings.content.btMinPeersForStable,
            btRequestTimeout: streamingServer.settings.content.btRequestTimeout
        };
        const isCustomTorrentProfileSelected = Object.values(TORRENT_PROFILES).every((torrentProfile) => {
            return !isEqual(torrentProfile, selectedTorrentProfile);
        });
        return {
            options: Object.keys(TORRENT_PROFILES)
                .map((profileName) => ({
                    label: profileName,
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
            selected: [JSON.stringify(selectedTorrentProfile)],
            onSelect: (event) => {
                core.transport.dispatch({
                    action: 'StreamingServer',
                    args: {
                        action: 'UpdateSettings',
                        args: {
                            ...streamingServer.settings.content,
                            ...JSON.parse(event.value),
                        }
                    }
                });
            }
        };
    }, [streamingServer.settings]);
    const transcodingProfileSelect = React.useMemo(() => {
        if (streamingServer.settings?.type !== 'Ready' || streamingServer.deviceInfo?.type !== 'Ready') {
            return null;
        }

        return {
            options: [
                {
                    label: t('SETTINGS_DISABLED'),
                    value: null,
                },
                ...streamingServer.deviceInfo.content.availableHardwareAccelerations.map((name) => ({
                    label: name,
                    value: name,
                }))
            ],
            selected: [streamingServer.settings.content.transcodeProfile],
            onSelect: (event) => {
                core.transport.dispatch({
                    action: 'StreamingServer',
                    args: {
                        action: 'UpdateSettings',
                        args: {
                            ...streamingServer.settings.content,
                            transcodeProfile: event.value,
                        }
                    }
                });
            }
        };
    }, [streamingServer.settings, streamingServer.deviceInfo]);
    return { streamingServerRemoteUrlInput, remoteEndpointSelect, cacheSizeSelect, torrentProfileSelect, transcodingProfileSelect };
};

module.exports = useStreamingServerSettingsInputs;
