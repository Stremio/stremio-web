// Copyright (C) 2017-2022 Smart code 203358507

const React = require('react');
const PropTypes = require('prop-types');
const classnames = require('classnames');
const { useToast } = require('stremio/common');
const { useServices } = require('stremio/services');
const Option = require('./Option');
const styles = require('./styles');

const OptionsMenu = ({ className, stream, playbackDevices }) => {
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
    const onCopyStreamButtonClick = React.useCallback(() => {
        if (streamingUrl || downloadUrl) {
            navigator.clipboard.writeText(streamingUrl || downloadUrl)
                .then(() => {
                    toast.show({
                        type: 'success',
                        title: 'Copied',
                        message: 'Stream link was copied to your clipboard',
                        timeout: 3000
                    });
                })
                .catch((e) => {
                    console.error(e);
                    toast.show({
                        type: 'error',
                        title: 'Error',
                        message: `Failed to copy stream link: ${streamingUrl || downloadUrl}`,
                        timeout: 3000
                    });
                });
        }
    }, [streamingUrl, downloadUrl]);
    const onDownloadVideoButtonClick = React.useCallback(() => {
        if (streamingUrl || downloadUrl) {
            window.open(streamingUrl || downloadUrl);
        }
    }, [streamingUrl, downloadUrl]);
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
                        icon={'ic_link'}
                        label={'Copy Stream Link'}
                        disabled={stream === null}
                        onClick={onCopyStreamButtonClick}
                    />
                    :
                    null
            }
            {
                streamingUrl || downloadUrl ?
                    <Option
                        icon={'ic_downloads'}
                        label={'Download Video'}
                        disabled={stream === null}
                        onClick={onDownloadVideoButtonClick}
                    />
                    :
                    null
            }
            {
                streamingUrl && externalDevices.map(({ id, name }) => (
                    <Option
                        key={id}
                        icon={'ic_vlc'}
                        label={`Play in ${name}`}
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
