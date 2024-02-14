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
    onMenuChange,
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
                <Control
                    icon={typeof paused !== 'boolean' || paused ? 'play' : 'pause'}
                    title={paused ? t('PLAYER_PLAY') : t('PLAYER_PAUSE')}
                    disabled={typeof paused !== 'boolean'}
                    onClick={onPlayPauseRequested}
                />
                {
                    nextVideo ?
                        <Control
                            disabled={typeof paused !== 'boolean'}
                            icon={'next'}
                            title={t('PLAYER_NEXT_VIDEO')}
                            onClick={onNextVideoRequested}
                        />
                        :
                        null
                }
                <Control
                    disabled={typeof muted !== 'boolean'}
                    icon={volumeIcon}
                    title={muted ? t('PLAYER_UNMUTE') : t('PLAYER_MUTE')}
                    onClick={onMuteButtonClick}
                />
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
                    <Control icon={'network'} disabled={!statistics || statistics.infoHash === null || !stream} shortcut={'KeyD'} onMenuChange={onMenuChange}>
                        <StatisticsMenu {...statistics} />
                    </Control>
                    <Control icon={'speed'} disabled={!playbackSpeed} shortcut={'KeyR'} onMenuChange={onMenuChange}>
                        <SpeedMenu
                            playbackSpeed={playbackSpeed}
                            onChange={onPlaybackSpeedChangeRequested}
                        />
                    </Control>
                    <Control icon={'about'} disabled={!metaItem || !stream} shortcut={'KeyI'} onMenuChange={onMenuChange}>
                        <InfoMenu
                            stream={stream}
                            addon={addon}
                            metaItem={metaItem}
                        />
                    </Control>
                    <Control icon={'cast'} disabled={!chromecastServiceActive} onClick={onChromecastButtonClick} />
                    <Control icon={'subtitles'} disabled={tracks.length === 0} shortcut={'KeyS'} onMenuChange={onMenuChange}>
                        <SubtitlesMenu
                            audioTracks={audioTracks}
                            selectedAudioTrackId={selectedAudioTrackId}
                            subtitlesTracks={subtitlesTracks}
                            selectedSubtitlesTrackId={selectedSubtitlesTrackId}
                            subtitlesOffset={subtitlesOffset}
                            subtitlesSize={subtitlesSize}
                            extraSubtitlesTracks={extraSubtitlesTracks}
                            selectedExtraSubtitlesTrackId={selectedExtraSubtitlesTrackId}
                            extraSubtitlesOffset={extraSubtitlesOffset}
                            extraSubtitlesDelay={extraSubtitlesDelay}
                            extraSubtitlesSize={extraSubtitlesSize}
                            onSubtitlesTrackSelected={onSubtitlesTrackSelected}
                            onExtraSubtitlesTrackSelected={onExtraSubtitlesTrackSelected}
                            onAudioTrackSelected={onAudioTrackSelected}
                            onSubtitlesOffsetChanged={onSubtitlesOffsetChanged}
                            onSubtitlesSizeChanged={onSubtitlesSizeChanged}
                            onExtraSubtitlesOffsetChanged={onSubtitlesOffsetChanged}
                            onExtraSubtitlesDelayChanged={onExtraSubtitlesDelayChanged}
                            onExtraSubtitlesSizeChanged={onSubtitlesSizeChanged}
                        />
                    </Control>
                    {
                        metaItem?.videos?.length > 0 ?
                            <Control icon={'episodes'} shortcut={'KeyV'} onMenuChange={onMenuChange}>
                                <VideosMenu
                                    metaItem={metaItem}
                                    seriesInfo={seriesInfo}
                                />
                            </Control>
                            :
                            null
                    }
                    <Control icon={'more-horizontal'} onMenuChange={onMenuChange}>
                        <OptionsMenu
                            stream={stream}
                            playbackDevices={playbackDevices}
                        />
                    </Control>
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
    onMenuChange: PropTypes.func,
};

module.exports = ControlBar;
