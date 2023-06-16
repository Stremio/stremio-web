// Copyright (C) 2017-2023 Smart code 203358507

const React = require('react');
const PropTypes = require('prop-types');
const classnames = require('classnames');
const Icon = require('@stremio/stremio-icons/dom');
const { Button, Image, PlayIconCircleCentered, useProfile, platform, useStreamingServer, useToast } = require('stremio/common');
const { useServices } = require('stremio/services');
const StreamPlaceholder = require('./StreamPlaceholder');
const styles = require('./styles');

const Stream = ({ className, addonName, name, description, thumbnail, progress, deepLinks, ...props }) => {
    const profile = useProfile();
    const streamingServer = useStreamingServer();
    const { core } = useServices();
    const toast = useToast();
    const href = React.useMemo(() => {
        const haveStreamingServer = streamingServer.settings !== null && streamingServer.settings.type === 'Ready';
        return deepLinks ?
            profile.settings.playerType && profile.settings.playerType !== 'internal' ?
                platform.isMobile() || !haveStreamingServer ?
                    (deepLinks.externalPlayer.openPlayer || {})[platform.name] || deepLinks.externalPlayer.href
                    : null
                :
                typeof deepLinks.player === 'string' ?
                    deepLinks.player
                    :
                    null
            :
            null;
    }, [deepLinks, profile, streamingServer]);
    const onClick = React.useCallback((e) => {
        if (href === null) {
            // link does not lead to the player, it is expected to
            // open with local video player through the streaming server
            core.transport.dispatch({
                action: 'StreamingServer',
                args: {
                    action: 'PlayOnDevice',
                    args: {
                        device: 'vlc',
                        source: deepLinks.externalPlayer.streaming
                    }
                }
            });
        } else if (profile.settings.playerType === 'external') {
            toast.show({
                type: 'success',
                title: 'Stream opened in external player',
                timeout: 4000
            });
        }
        props.onClick(e);
    }, [href, deepLinks, props.onClick, profile, toast]);
    const forceDownload = React.useMemo(() => {
        // we only do this in one case to force the download
        // of a M3U playlist generated in the browser
        return href === deepLinks.externalPlayer.href ? deepLinks.externalPlayer.fileName : false;
    }, [href]);
    const renderThumbnailFallback = React.useCallback(() => (
        <Icon className={styles['placeholder-icon']} icon={'ic_broken_link'} />
    ), []);
    return (
        <Button href={href} download={forceDownload} {...props} onClick={onClick} className={classnames(className, styles['stream-container'])} title={addonName}>
            {
                typeof thumbnail === 'string' && thumbnail.length > 0 ?
                    <div className={styles['thumbnail-container']} title={name || addonName}>
                        <Image
                            className={styles['thumbnail']}
                            src={thumbnail}
                            alt={' '}
                            renderFallback={renderThumbnailFallback}
                        />
                    </div>
                    :
                    <div className={styles['addon-name-container']} title={name || addonName}>
                        <div className={styles['addon-name']}>{name || addonName}</div>
                    </div>
            }
            <div className={styles['info-container']} title={description}>{description}</div>
            <PlayIconCircleCentered className={styles['play-icon']} />
            {
                progress !== null && !isNaN(progress) && progress > 0 ?
                    <div className={styles['progress-bar-container']}>
                        <div className={styles['progress-bar']} style={{ width: `${Math.min(progress, 1) * 100}%` }} />
                    </div>
                    :
                    null
            }
        </Button>
    );
};

Stream.Placeholder = StreamPlaceholder;

Stream.propTypes = {
    className: PropTypes.string,
    addonName: PropTypes.string,
    name: PropTypes.string,
    description: PropTypes.string,
    thumbnail: PropTypes.string,
    progress: PropTypes.number,
    deepLinks: PropTypes.shape({
        player: PropTypes.string,
        externalPlayer: PropTypes.shape({
            href: PropTypes.string,
            fileName: PropTypes.string,
            streaming: PropTypes.string,
            openPlayer: PropTypes.shape({
                choose: {
                    ios: PropTypes.string,
                    android: PropTypes.string,
                    windows: PropTypes.string,
                    macos: PropTypes.string,
                    linux: PropTypes.string
                },
                vlc: {
                    ios: PropTypes.string,
                    android: PropTypes.string,
                    windows: PropTypes.string,
                    macos: PropTypes.string,
                    linux: PropTypes.string
                },
                outplayer: {
                    ios: PropTypes.string,
                    android: PropTypes.string,
                    windows: PropTypes.string,
                    macos: PropTypes.string,
                    linux: PropTypes.string
                },
                infuse: {
                    ios: PropTypes.string,
                    android: PropTypes.string,
                    windows: PropTypes.string,
                    macos: PropTypes.string,
                    linux: PropTypes.string
                },
                justplayer: {
                    ios: PropTypes.string,
                    android: PropTypes.string,
                    windows: PropTypes.string,
                    macos: PropTypes.string,
                    linux: PropTypes.string
                },
                mxplayer: {
                    ios: PropTypes.string,
                    android: PropTypes.string,
                    windows: PropTypes.string,
                    macos: PropTypes.string,
                    linux: PropTypes.string
                },
            })
        })
    }),
    onClick: PropTypes.func
};

module.exports = Stream;
