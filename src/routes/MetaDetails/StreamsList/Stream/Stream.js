// Copyright (C) 2017-2022 Smart code 203358507

const React = require('react');
const PropTypes = require('prop-types');
const classnames = require('classnames');
const Icon = require('@stremio/stremio-icons/dom');
const { useServices } = require('stremio/services');
const { Button, Image, PlayIconCircleCentered, platform, useProfile, useToast } = require('stremio/common');
const StreamPlaceholder = require('./StreamPlaceholder');
const styles = require('./styles');

const Stream = ({ className, addonName, name, description, thumbnail, progress, deepLinks }) => {
    const { core } = useServices();
    const profile = useProfile();
    const toast = useToast();
    const onClick = React.useCallback(() => {
        if (deepLinks.externalPlayer.openPlayer) {
            if (platform.isMobile() && deepLinks.externalPlayer.openPlayer[platform.name]) {
                window.location = deepLinks.externalPlayer.openPlayer[platform.name];
                toast.show({
                    type: 'success',
                    title: `Stream opened in ${profile.settings.playerType}`,
                    timeout: 4000
                });
            } else if (typeof deepLinks.externalPlayer.streaming === 'string') {
                core.transport.dispatch({
                    action: 'StreamingServer',
                    args: {
                        action: 'PlayOnDevice',
                        args: {
                            device: profile.settings.playerType,
                            source: deepLinks.externalPlayer.streaming,
                        }
                    }
                });
            }
        } else if (typeof deepLinks.player === 'string') {
            window.location = deepLinks.player;
        }
    }, [deepLinks, profile.settings]);
    const renderThumbnailFallback = React.useCallback(() => (
        <Icon className={styles['placeholder-icon']} icon={'ic_broken_link'} />
    ), []);
    return (
        <Button className={classnames(className, styles['stream-container'])} title={addonName} onClick={onClick}>
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
                ios: PropTypes.string,
                android: PropTypes.string,
                windows: PropTypes.string,
                macos: PropTypes.string,
                linux: PropTypes.string,
                tizen: PropTypes.string,
                webos: PropTypes.string,
                chromeos: PropTypes.string,
                roku: PropTypes.string,
            })
        })
    }),
};

module.exports = Stream;
