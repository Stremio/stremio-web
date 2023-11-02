// Copyright (C) 2017-2023 Smart code 203358507

const React = require('react');
const PropTypes = require('prop-types');
const classnames = require('classnames');
const { default: Icon } = require('@stremio/stremio-icons/react');
const { Button, Image, useProfile, platform, useStreamingServer, useToast } = require('stremio/common');
const { useServices } = require('stremio/services');
const StreamPlaceholder = require('./StreamPlaceholder');
const styles = require('./styles');

const Stream = ({ className, videoId, videoReleased, addonName, name, description, thumbnail, progress, deepLinks, ...props }) => {
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
    const markVideoAsWatched = React.useCallback(() => {
        if (typeof videoId === 'string') {
            core.transport.dispatch({
                action: 'MetaDetails',
                args: {
                    action: 'MarkVideoAsWatched',
                    args: [{ id: videoId, released: videoReleased }, true]
                }
            });
        }
    }, [videoId, videoReleased]);
    const onClick = React.useCallback((event) => {
        if (href === null) {
            // link does not lead to the player, it is expected to
            // open with local video player through the streaming server
            markVideoAsWatched();
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
        } else if (profile.settings.playerType && profile.settings.playerType !== 'internal') {
            markVideoAsWatched();
            toast.show({
                type: 'success',
                title: 'Stream opened in external player',
                timeout: 4000
            });
        }
        if (typeof props.onClick === 'function') {
            props.onClick(event);
        }
    }, [href, deepLinks, props.onClick, profile, toast, markVideoAsWatched]);
    const forceDownload = React.useMemo(() => {
        // we only do this in one case to force the download
        // of a M3U playlist generated in the browser
        return href === deepLinks.externalPlayer.href ? deepLinks.externalPlayer.fileName : false;
    }, [href]);
    const renderThumbnailFallback = React.useCallback(() => (
        <Icon className={styles['placeholder-icon']} name={'ic_broken_link'} />
    ), []);
    return (
        <Button href={href} download={forceDownload} {...props} onClick={onClick} className={classnames(className, styles['stream-container'])} title={addonName}>
            <div className={styles['info-container']}>
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
                {
                    progress !== null && !isNaN(progress) && progress > 0 ?
                        <div className={styles['progress-bar-container']}>
                            <div className={styles['progress-bar']} style={{ width: `${progress}%` }} />
                            <div className={styles['progress-bar-background']} />
                        </div>
                        :
                        null
                }
            </div>
            <div className={styles['description-container']} title={description}>{description}</div>
            <Icon className={styles['icon']} name={'play'} />
        </Button>
    );
};

Stream.Placeholder = StreamPlaceholder;

Stream.propTypes = {
    className: PropTypes.string,
    videoId: PropTypes.string,
    videoReleased: PropTypes.instanceOf(Date),
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
                choose: PropTypes.shape({
                    ios: PropTypes.string,
                    android: PropTypes.string,
                    windows: PropTypes.string,
                    macos: PropTypes.string,
                    linux: PropTypes.string
                }),
                vlc: PropTypes.shape({
                    ios: PropTypes.string,
                    android: PropTypes.string,
                    windows: PropTypes.string,
                    macos: PropTypes.string,
                    linux: PropTypes.string
                }),
                outplayer: PropTypes.shape({
                    ios: PropTypes.string,
                    android: PropTypes.string,
                    windows: PropTypes.string,
                    macos: PropTypes.string,
                    linux: PropTypes.string
                }),
                infuse: PropTypes.shape({
                    ios: PropTypes.string,
                    android: PropTypes.string,
                    windows: PropTypes.string,
                    macos: PropTypes.string,
                    linux: PropTypes.string
                }),
                justplayer: PropTypes.shape({
                    ios: PropTypes.string,
                    android: PropTypes.string,
                    windows: PropTypes.string,
                    macos: PropTypes.string,
                    linux: PropTypes.string
                }),
                mxplayer: PropTypes.shape({
                    ios: PropTypes.string,
                    android: PropTypes.string,
                    windows: PropTypes.string,
                    macos: PropTypes.string,
                    linux: PropTypes.string
                }),
            })
        })
    }),
    onClick: PropTypes.func
};

module.exports = Stream;
