// Copyright (C) 2017-2023 Smart code 203358507

const React = require('react');
const PropTypes = require('prop-types');
const classnames = require('classnames');
const { useTranslation } = require('react-i18next');
const { useToast, platform } = require('stremio/common');
const { useServices } = require('stremio/services');
const Option = require('./Option');
const styles = require('./styles');

const OptionsMenu = ({ className, stream, playbackDevices }) => {
    const { t } = useTranslation();
    const { core } = useServices();
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
    const downloadVideoLink = React.useMemo(() => {
        if (streamingUrl) {
            const parsedUrl = new URL(streamingUrl);
            parsedUrl.searchParams.set('download', '1');
            return parsedUrl.href;
        } else if (downloadUrl) {
            return downloadUrl;
        }

        return null;
    }, [streamingUrl, downloadUrl]);
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
        if (downloadVideoLink) {
            window.open(downloadVideoLink, '_blank');
        }
    }, [downloadVideoLink]);
    const onCopyDownloadLinkButtonClick = React.useCallback(() => {
        if (downloadVideoLink) {
            navigator.clipboard.writeText(downloadVideoLink)
                .then(() => {
                    toast.show({
                        type: 'success',
                        title: 'Copied',
                        message: t('PLAYER_COPY_DOWNLOAD_LINK_SUCCESS', {defaultValue: 'Download link was copied to your clipboard'}),
                        timeout: 3000
                    });
                })
                .catch((e) => {
                    console.error(e);
                    toast.show({
                        type: 'error',
                        title: t('Error'),
                        message: `${t('PLAYER_COPY_DOWNLOAD_LINK_ERROR', {defaultValue: 'Failed to copy download link'})}: ${downloadVideoLink}`,
                        timeout: 3000
                    });
                });
        }
    }, [downloadVideoLink]);
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
    const opneInNplayer = React.useCallback(() => {
        window.open('nplayer-' + streamingUrl, '_blank');
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
                !!(streamingUrl || downloadUrl) &&
                <Option
                    icon={'link'}
                    label={t('CTX_COPY_VIDEO_DOWNLOAD_LINK', {defaultValue: 'Copy video download link'})}
                    disabled={stream === null}
                    onClick={onCopyDownloadLinkButtonClick}
                />
            }
            {
                platform.name === 'ios' &&
                <Option
                    icon={'play-outline'}
                    label={t('PLAYER_OPEN_IN_NPLAYER', {defaultValue: 'Open in nPlayer'})}
                    disabled={stream === null}
                    onClick={opneInNplayer}
                />
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
    playbackDevices: PropTypes.array
};

module.exports = OptionsMenu;
