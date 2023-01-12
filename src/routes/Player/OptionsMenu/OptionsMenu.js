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
    const streamUrl = React.useMemo(() => {
        return stream !== null ?
            stream.deepLinks &&
            stream.deepLinks.externalPlayer &&
            typeof stream.deepLinks.externalPlayer.download === 'string' ?
                stream.deepLinks.externalPlayer.download
                :
                null
            :
            null;
    }, [stream]);
    const externalPlayers = React.useMemo(() => {
        return playbackDevices.filter(({ type }) => type === 'external');
    }, [playbackDevices]);
    const onCopyStreamButtonClick = React.useCallback(() => {
        if (streamUrl !== null) {
            navigator.clipboard.writeText(streamUrl)
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
                        message: `Failed to copy stream link: ${streamUrl}`,
                        timeout: 3000
                    });
                });
        }
    }, [streamUrl]);
    const onDownloadVideoButtonClick = React.useCallback(() => {
        if (streamUrl !== null) {
            window.open(streamUrl);
        }
    }, [streamUrl]);
    const onExternalPlayRequested = React.useCallback((deviceId) => {
        if (streamUrl !== null) {
            core.transport.dispatch({
                action: 'StreamingServer',
                args: {
                    action: 'PlayOnDevice',
                    args: {
                        device: deviceId,
                        source: streamUrl,
                    }
                }
            });
        }
    }, [streamUrl]);
    const onMouseDown = React.useCallback((event) => {
        event.nativeEvent.optionsMenuClosePrevented = true;
    }, []);
    return (
        <div className={classnames(className, styles['options-menu-container'])} onMouseDown={onMouseDown}>
            <Option
                icon={'ic_link'}
                label={'Copy Stream Link'}
                disabled={stream === null}
                onClick={onCopyStreamButtonClick}
            />
            <Option
                icon={'ic_downloads'}
                label={'Download Video'}
                disabled={stream === null}
                onClick={onDownloadVideoButtonClick}
            />
            {
                !stream.infoHash && externalPlayers.map(({ id, name }) => (
                    <Option
                        key={id}
                        icon={'ic_vlc'}
                        label={`Play in ${name}`}
                        playerId={id}
                        disabled={stream === null}
                        onClick={onExternalPlayRequested}
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
