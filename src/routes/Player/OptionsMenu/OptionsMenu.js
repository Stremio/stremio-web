// Copyright (C) 2017-2023 Smart code 203358507

const React = require('react');
const PropTypes = require('prop-types');
const classnames = require('classnames');
const magnet = require('magnet-uri');
const { useTranslation } = require('react-i18next');
const { usePlatform, useToast } = require('stremio/common');
const { useServices } = require('stremio/services');
const Option = require('./Option');
const styles = require('./styles');

const OptionsMenu = ({ className, stream, playbackDevices, extraSubtitlesTracks, selectedExtraSubtitlesTrackId }) => {
    const { t } = useTranslation();
    const { core } = useServices();
    const platform = usePlatform();
    const toast = useToast();
    const [streamingUrl, downloadUrl] = React.useMemo(() => {
        return stream !== null ?
            stream.deepLinks &&
            stream.deepLinks.externalPlayer &&
            [stream.deepLinks.externalPlayer.streaming, stream.deepLinks.externalPlayer.download]
            :
            [null, null];
    }, [stream]);
    const externalDevices = React.useMemo(() => {
        return playbackDevices.filter(({ type }) => type === 'external');
    }, [playbackDevices]);

    const subtitlesTrackUrl = React.useMemo(() => {
        const track = extraSubtitlesTracks?.find(({ id }) => id === selectedExtraSubtitlesTrackId);
        return track?.fallbackUrl ?? track?.url ?? null;
    }, [extraSubtitlesTracks, selectedExtraSubtitlesTrackId]);

    const magnetLink = React.useMemo(() => {
        if (stream === null || typeof stream.infoHash !== 'string' || stream.infoHash.length === 0) {
            return null;
        }
        const params = { xt: `urn:btih:${stream.infoHash}` };
        if (typeof stream.name === 'string' && stream.name.length > 0) {
            params.dn = stream.name;
        }
        if (Array.isArray(stream.sources) && stream.sources.length > 0) {
            params.tr = stream.sources.filter((s) => typeof s === 'string' && s.length > 0);
        }
        return magnet.encode(params);
    }, [stream]);

    const onCopyMagnetLinkClick = React.useCallback(() => {
        if (magnetLink) {
            navigator.clipboard.writeText(magnetLink)
                .then(() => {
                    toast.show({
                        type: 'success',
                        title: 'Copied',
                        message: t('PLAYER_COPY_MAGNET_LINK_SUCCESS', 'Magnet link was copied to your clipboard'),
                        timeout: 3000
                    });
                })
                .catch((e) => {
                    console.error(e);
                    toast.show({
                        type: 'error',
                        title: t('Error'),
                        message: t('PLAYER_COPY_MAGNET_LINK_ERROR', 'Failed to copy magnet link'),
                        timeout: 3000
                    });
                });
        }
    }, [magnetLink]);

    const onCopyStreamButtonClick = React.useCallback(() => {
        if (streamingUrl || downloadUrl) {
            navigator.clipboard.writeText(streamingUrl || downloadUrl)
                .then(() => {
                    toast.show({
                        type: 'success',
                        title: 'Copied',
                        message: t('PLAYER_COPY_STREAM_SUCCESS'),
                        timeout: 3000
                    });
                })
                .catch((e) => {
                    console.error(e);
                    toast.show({
                        type: 'error',
                        title: t('Error'),
                        message: `${t('PLAYER_COPY_STREAM_ERROR')}: ${streamingUrl || downloadUrl}`,
                        timeout: 3000
                    });
                });
        }
    }, [streamingUrl, downloadUrl]);
    const onDownloadVideoButtonClick = React.useCallback(() => {
        if (downloadUrl || streamingUrl ) {
            platform.openExternal(downloadUrl || streamingUrl);
        }
    }, [streamingUrl, downloadUrl]);

    const onDownloadSubtitlesClick = React.useCallback(() => {
        subtitlesTrackUrl && platform.openExternal(subtitlesTrackUrl);
    }, [subtitlesTrackUrl]);

    const onExternalDeviceRequested = React.useCallback((deviceId) => {
        if (streamingUrl) {
            core.transport.dispatch({
                action: 'StreamingServer',
                args: {
                    action: 'PlayOnDevice',
                    args: {
                        device: deviceId,
                        source: streamingUrl,
                    }
                }
            });
        }
    }, [streamingUrl]);
    const onMouseDown = React.useCallback((event) => {
        event.nativeEvent.optionsMenuClosePrevented = true;
    }, []);

    return (
        <div className={classnames(className, styles['options-menu-container'])} onMouseDown={onMouseDown}>
            {
                streamingUrl || downloadUrl ?
                    <Option
                        icon={'link'}
                        label={t('CTX_COPY_STREAM_LINK')}
                        disabled={stream === null}
                        onClick={onCopyStreamButtonClick}
                    />
                    :
                    null
            }
            {
                streamingUrl || downloadUrl ?
                    <Option
                        icon={'download'}
                        label={t('CTX_DOWNLOAD_VIDEO')}
                        disabled={stream === null}
                        onClick={onDownloadVideoButtonClick}
                    />
                    :
                    null
            }
            {
                magnetLink ?
                    <Option
                        icon={'magnet-link'}
                        label={t('CTX_COPY_MAGNET_LINK', 'Copy magnet link')}
                        disabled={stream === null}
                        onClick={onCopyMagnetLinkClick}
                    />
                    :
                    null
            }
            {
                subtitlesTrackUrl ?
                    <Option
                        icon={'download'}
                        label={t('CTX_DOWNLOAD_SUBS')}
                        disabled={stream === null}
                        onClick={onDownloadSubtitlesClick}
                    />
                    :
                    null
            }
            {
                streamingUrl && externalDevices.map(({ id, name }) => (
                    <Option
                        key={id}
                        icon={'vlc'}
                        label={t('PLAYER_PLAY_IN', { device: name })}
                        deviceId={id}
                        disabled={stream === null}
                        onClick={onExternalDeviceRequested}
                    />
                ))
            }
        </div>
    );
};

OptionsMenu.propTypes = {
    className: PropTypes.string,
    stream: PropTypes.object,
    playbackDevices: PropTypes.array,
    extraSubtitlesTracks: PropTypes.array,
    selectedExtraSubtitlesTrackId: PropTypes.string,
};

module.exports = OptionsMenu;
