const isEqual = require('lodash.isequal');
const { useServices } = require('stremio/services');
const { useDeepEqualMemo } = require('stremio/common');

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
        btDownloadSpeedHardLimit: 2621440,
        btDownloadSpeedSoftLimit: 1677721.6,
        btHandshakeTimeout: 20000,
        btMaxConnections: 35,
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
    }
};

const useStreaminServerSettingsInputs = (streaminServer) => {
    const { core } = useServices();
    const cacheSizeSelect = useDeepEqualMemo(() => {
        if (streaminServer.settings === null || streaminServer.settings.type !== 'Ready') {
            return null;
        }

        return {
            options: CACHE_SIZES.map((size) => ({
                label: cacheSizeToString(size),
                value: JSON.stringify(size)
            })),
            selected: [JSON.stringify(streaminServer.settings.content.cacheSize)],
            renderLabelText: () => {
                return cacheSizeToString(streaminServer.settings.content.cacheSize);
            },
            onSelect: (event) => {
                core.dispatch({
                    action: 'StreamingServer',
                    args: {
                        action: 'UpdateSettings',
                        args: {
                            ...streaminServer.settings.content,
                            cacheSize: JSON.parse(event.value)
                        }
                    }
                });
            }
        };
    }, [streaminServer.settings]);
    const torrentProfileSelect = useDeepEqualMemo(() => {
        if (streaminServer.settings === null || streaminServer.settings.type !== 'Ready') {
            return null;
        }

        const selectedTorrentProfile = {
            btDownloadSpeedHardLimit: streaminServer.settings.content.btDownloadSpeedHardLimit,
            btDownloadSpeedSoftLimit: streaminServer.settings.content.btDownloadSpeedSoftLimit,
            btHandshakeTimeout: streaminServer.settings.content.btHandshakeTimeout,
            btMaxConnections: streaminServer.settings.content.btMaxConnections,
            btMinPeersForStable: streaminServer.settings.content.btMinPeersForStable,
            btRequestTimeout: streaminServer.settings.content.btRequestTimeout
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
            renderLabelText: () => {
                return Object.keys(TORRENT_PROFILES).reduce((result, profileName) => {
                    if (isEqual(TORRENT_PROFILES[profileName], selectedTorrentProfile)) {
                        return profileName;
                    }

                    return result;
                }, 'custom');
            },
            onSelect: (event) => {
                core.dispatch({
                    action: 'StreamingServer',
                    args: {
                        action: 'UpdateSettings',
                        args: {
                            ...streaminServer.settings.content,
                            ...JSON.parse(event.value)
                        }
                    }
                });
            }
        };
    }, [streaminServer.settings]);
    return { cacheSizeSelect, torrentProfileSelect };
};

module.exports = useStreaminServerSettingsInputs;
