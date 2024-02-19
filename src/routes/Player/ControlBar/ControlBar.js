// Copyright (C) 2017-2024 Smart code 203358507

const React = require('react');
const PropTypes = require('prop-types');
const classnames = require('classnames');
const { t } = require('i18next');
const { useBinaryState } = require('stremio/common');
const { useServices } = require('stremio/services');
const useStatistics = require('./useStatistics');
const SeekBar = require('./SeekBar');
const VolumeSlider = require('./VolumeSlider');
const { StatisticsMenu, SpeedMenu, InfoMenu, VideosMenu, SubtitlesMenu, OptionsMenu } = require('./Menus');
const { default: Control } = require('./Control');
const styles = require('./styles');

const ControlBar = ({
    className,
    video,
    player,
    streamingServer,
    onPlayPauseRequested,
    onNextVideoRequested,
    onMuteRequested,
    onUnmuteRequested,
    onVolumeChangeRequested,
    onSeekRequested,
    onPlaybackSpeedChangeRequested,
    onSubtitlesTrackSelected,
    onExtraSubtitlesTrackSelected,
    onAudioTrackSelected,
    onSubtitlesOffsetChanged,
    onSubtitlesSizeChanged,
    onExtraSubtitlesDelayChanged,
    onExtraSubtitlesSizeChanged,
    activeMenuId,
    toggleMenu,
    ...props
}) => {
    const { chromecast } = useServices();
    const statistics = useStatistics(player, streamingServer);

    const [chromecastServiceActive, setChromecastServiceActive] = React.useState(() => chromecast.active);
    const [mobileMenuOpen, , , toogleMobileMenu] = useBinaryState(false);

    const {
        subtitlesTracks,
        extraSubtitlesTracks,
        audioTracks,
        selectedAudioTrackId,
        selectedSubtitlesTrackId,
        selectedExtraSubtitlesTrackId,
        subtitlesOffset,
        subtitlesSize,
        extraSubtitlesOffset,
        extraSubtitlesDelay,
        extraSubtitlesSize,
    } = video.state;

    const { paused, buffered, muted, volume, time, duration, playbackSpeed } = video.state;
    const { seriesInfo, nextVideo, addon } = player;

    const tracks = React.useMemo(() => {
        return subtitlesTracks && extraSubtitlesTracks && audioTracks ? subtitlesTracks.concat(extraSubtitlesTracks).concat(audioTracks): [];
    }, [subtitlesTracks, extraSubtitlesTracks, audioTracks]);

    const metaItem = React.useMemo(() => {
        return player.metaItem !== null && player.metaItem.type === 'Ready' ? player.metaItem.content : null;
    }, [player]);

    const stream = React.useMemo(() => {
        return player.selected !== null ? player.selected.stream : null;
    }, [player]);

    const playbackDevices = React.useMemo(() => {
        return streamingServer.playbackDevices !== null && streamingServer.playbackDevices.type === 'Ready' ? streamingServer.playbackDevices.content : [];
    }, [streamingServer]);

    const onMuteButtonClick = React.useCallback(() => {
        muted ? onUnmuteRequested() : onMuteRequested();
    }, [muted, onMuteRequested, onUnmuteRequested]);

    const onChromecastButtonClick = React.useCallback(() => {
        chromecast.transport.requestSession();
    }, []);

    const volumeIcon = React.useMemo(() => {
        return (typeof muted === 'boolean' && muted) ? 'volume-mute' :
            (volume === null || isNaN(volume)) ? 'volume-off' :
                volume < 30 ? 'volume-low' :
                    volume < 70 ? 'volume-medium' :
                        'volume-high';
    }, [muted, volume]);

    const menus = [
        {
            id: 'playPause',
            icon: typeof paused !== 'boolean' || paused ? 'play' : 'pause',
            title: paused ? t('PLAYER_PLAY') : t('PLAYER_PAUSE'),
            disabled: typeof paused !== 'boolean',
            onClick: onPlayPauseRequested,
        },
        nextVideo && {
            id: 'nextVideo',
            icon: 'next',
            title: t('PLAYER_NEXT_VIDEO'),
            disabled: typeof paused !== 'boolean',
            onClick: onNextVideoRequested,
            condition: nextVideo,
        },
        {
            id: 'mute',
            icon: muted ? 'volume-mute' : volumeIcon,
            title: muted ? t('PLAYER_UNMUTE') : t('PLAYER_MUTE'),
            onClick: onMuteButtonClick,
        },
    ].filter(Boolean);

    const controlMenus = [
        {
            id: 'statistics',
            icon: 'network',
            disabled: !statistics || statistics.infoHash === null || !stream,
            shortcut: 'KeyD',
            component: StatisticsMenu,
            props: statistics,
        },
        {
            id: 'speed',
            icon: 'speed',
            disabled: !playbackSpeed,
            shortcut: 'KeyR',
            component: SpeedMenu,
            props: {
                playbackSpeed,
                onChange: onPlaybackSpeedChangeRequested,
            },
        },
        {
            id: 'info',
            icon: 'about',
            disabled: !metaItem || !stream,
            shortcut: 'KeyI',
            component: InfoMenu,
            props: {
                stream,
                addon,
                metaItem,
            },
        },
        {
            id: 'chromecast',
            icon: 'cast',
            disabled: !chromecastServiceActive,
            onClick: onChromecastButtonClick,
        },
        {
            id: 'subtitles',
            icon: 'subtitles',
            disabled: tracks.length === 0,
            shortcut: 'KeyS',
            component: SubtitlesMenu,
            props: {
                subtitlesTracks,
                extraSubtitlesTracks,
                audioTracks,
                selectedAudioTrackId,
                selectedSubtitlesTrackId,
                selectedExtraSubtitlesTrackId,
                subtitlesOffset,
                subtitlesSize,
                extraSubtitlesOffset,
                extraSubtitlesDelay,
                extraSubtitlesSize,
                onSubtitlesTrackSelected,
                onExtraSubtitlesTrackSelected,
                onAudioTrackSelected,
                onSubtitlesOffsetChanged,
                onSubtitlesSizeChanged,
                onExtraSubtitlesDelayChanged,
                onExtraSubtitlesSizeChanged
            },
        },
        metaItem?.videos?.length > 0 && {
            id: 'episodes',
            icon: 'episodes',
            shortcut: 'KeyV',
            component: VideosMenu,
            props: {
                metaItem,
                seriesInfo,
            },
        },
        {
            id: 'options',
            icon: 'more-horizontal',
            component: OptionsMenu,
            props: {
                stream,
                playbackDevices,
            },
        },
    ].filter(Boolean);

    React.useEffect(() => {
        const onStateChanged = () => setChromecastServiceActive(chromecast.active);
        chromecast.on('stateChanged', onStateChanged);
        return () => chromecast.off('stateChanged', onStateChanged);
    }, []);

    return (
        <div {...props} className={classnames(className, styles['control-bar-container'])}>
            <SeekBar
                className={styles['seek-bar']}
                time={time}
                duration={duration}
                buffered={buffered}
                onSeekRequested={onSeekRequested}
            />
            <div className={styles['control-bar-buttons-container']}>
                {menus.map((menu) => {
                    const MenuComponent = menu.component;

                    return (
                        <Control {...menu} key={menu.id}>
                            {
                                MenuComponent ?
                                    <MenuComponent {...menu.props} />
                                    :
                                    null
                            }
                        </Control>
                    );
                })}
                <VolumeSlider
                    className={styles['volume-slider']}
                    volume={volume}
                    onVolumeChangeRequested={onVolumeChangeRequested}
                />
                <div className={styles['spacing']} />
                <Control
                    className={styles['menu-button']}
                    icon={'more-vertical'}
                    onClick={toogleMobileMenu}
                />
                <div className={classnames(styles['controls-menu-container'], { 'open': mobileMenuOpen })}>
                    {
                        controlMenus.map((controlMenu) => {
                            const isMenuActive = activeMenuId === controlMenu.id;
                            const ControlMenuComponent = controlMenu.component;

                            return (
                                <Control
                                    {...controlMenu}
                                    key={controlMenu.id}
                                    isActive={isMenuActive}
                                    toggleMenu={toggleMenu}
                                >
                                    {
                                        ControlMenuComponent ?
                                            <ControlMenuComponent {...controlMenu.props} />
                                            :
                                            null
                                    }
                                </Control>
                            );
                        }
                        )}
                </div>
            </div>
        </div>
    );
};

ControlBar.propTypes = {
    className: PropTypes.string,
    video: PropTypes.object,
    player: PropTypes.object,
    streamingServer: PropTypes.object,
    onPlayPauseRequested: PropTypes.func,
    onNextVideoRequested: PropTypes.func,
    onMuteRequested: PropTypes.func,
    onUnmuteRequested: PropTypes.func,
    onVolumeChangeRequested: PropTypes.func,
    onSeekRequested: PropTypes.func,
    onPlaybackSpeedChangeRequested: PropTypes.func,
    onSubtitlesTrackSelected: PropTypes.func,
    onExtraSubtitlesTrackSelected: PropTypes.func,
    onAudioTrackSelected: PropTypes.func,
    onSubtitlesOffsetChanged: PropTypes.func,
    onSubtitlesSizeChanged: PropTypes.func,
    onExtraSubtitlesDelayChanged: PropTypes.func,
    onExtraSubtitlesSizeChanged: PropTypes.func,
    onMenuChange: PropTypes.func,
    activeMenuId: PropTypes.string,
    toggleMenu: PropTypes.func,
};

module.exports = ControlBar;
