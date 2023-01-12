// Copyright (C) 2017-2022 Smart code 203358507

const React = require('react');
const PropTypes = require('prop-types');
const classnames = require('classnames');
const Icon = require('@stremio/stremio-icons/dom');
const { Button, useToast } = require('stremio/common');
const { useServices } = require('stremio/services');
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
            <Button className={classnames(styles['option-container'], { 'disabled': stream === null })} disabled={stream === null} onClick={onCopyStreamButtonClick}>
                <Icon className={styles['icon']} icon={'ic_link'} />
                <div className={styles['label']}>Copy Stream Link</div>
            </Button>
            <Button className={classnames(styles['option-container'], { 'disabled': stream === null })} disabled={stream === null}onClick={onDownloadVideoButtonClick}>
                <Icon className={styles['icon']} icon={'ic_downloads'} />
                <div className={styles['label']}>Download Video</div>
            </Button>
            {
                !stream.infoHash && externalPlayers.map(({ id, name }) => (
                    <ExternalPlayerButton
                        key={id}
                        id={id}
                        name={name}
                        disabled={stream === null}
                        onExternalPlayRequested={onExternalPlayRequested}
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

const ExternalPlayerButton = ({ id, name, disabled, onExternalPlayRequested }) => {
    const onClick = React.useCallback(() => {
        if (typeof onExternalPlayRequested === 'function') {
            onExternalPlayRequested(id);
        }
    }, [onExternalPlayRequested, id]);
    return (
        <Button className={classnames(styles['option-container'], { 'disabled': disabled })} disabled={disabled} onClick={onClick}>
            <Icon className={styles['icon']} icon={'ic_vlc'} />
            <div className={styles['label']}>Play in {name}</div>
        </Button>
    );
};

ExternalPlayerButton.propTypes = {
    id: PropTypes.string,
    name: PropTypes.string,
    disabled: PropTypes.bool,
    onExternalPlayRequested: PropTypes.func,
};

module.exports = OptionsMenu;
