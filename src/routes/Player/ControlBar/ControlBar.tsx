// Copyright (C) 2017-2023 Smart code 203358507

import React, { forwardRef, useCallback, useEffect, useState } from 'react';
import classnames from 'classnames';
import Icon from '@stremio/stremio-icons/react';
import { Button } from 'stremio/components';
import { useServices } from 'stremio/services';
import SeekBar from './SeekBar';
import VolumeSlider from './VolumeSlider';
import styles from './styles.less';
import { useBinaryState, usePlatform } from 'stremio/common';
import { t } from 'i18next';

type StreamForControlBar = {
    thumbnails?: string,
    infoHash?: string,
    fileIdx?: string | number,
} | null;

type StatisticsForControlBar = {
    type: string,
} | null;

type MetaItemForControlBar = {
    content?: {
        videos?: unknown[],
    },
} | null;

export type ControlBarProps = {
    className?: string,
    paused?: boolean | null,
    time?: number | null,
    duration?: number | null,
    buffered?: number | null,
    volume?: number | null,
    muted?: boolean | null,
    playbackSpeed?: number | null,
    subtitlesTracks?: unknown[] | null,
    audioTracks?: unknown[] | null,
    metaItem?: MetaItemForControlBar,
    nextVideo?: object | null,
    stream?: StreamForControlBar,
    statistics?: StatisticsForControlBar,
    onPlayRequested?: () => void,
    onPauseRequested?: () => void,
    onNextVideoRequested?: () => void,
    onMuteRequested?: () => void,
    onUnmuteRequested?: () => void,
    onVolumeChangeRequested?: (volume: number) => void,
    onSeekRequested?: (time: number) => void,
    onToggleSubtitlesMenu?: () => void,
    onToggleAudioMenu?: () => void,
    onToggleSpeedMenu?: () => void,
    onToggleSideDrawer?: () => void,
    onToggleOptionsMenu?: () => void,
    onToggleStatisticsMenu?: () => void,
    onTouchEnd?: (event: React.TouchEvent) => void,
} & Omit<React.HTMLAttributes<HTMLDivElement>, 'onTouchEnd'>;

const ControlBar = forwardRef<HTMLDivElement, ControlBarProps>(({
    className,
    paused,
    time,
    duration,
    buffered,
    volume,
    muted,
    playbackSpeed,
    subtitlesTracks,
    audioTracks,
    metaItem,
    nextVideo,
    stream,
    statistics,
    onPlayRequested,
    onPauseRequested,
    onNextVideoRequested,
    onMuteRequested,
    onUnmuteRequested,
    onVolumeChangeRequested,
    onSeekRequested,
    onToggleSubtitlesMenu,
    onToggleAudioMenu,
    onToggleSpeedMenu,
    onToggleSideDrawer,
    onToggleOptionsMenu,
    onToggleStatisticsMenu,
    onTouchEnd,
    ...props
}, ref) => {
    const { chromecast } = useServices();
    const platform = usePlatform();
    const [chromecastServiceActive, setChromecastServiceActive] = useState(() => chromecast.active);
    const [buttonsMenuOpen, , , toggleButtonsMenu] = useBinaryState(false);
    const onSubtitlesButtonMouseDown = useCallback((event: React.MouseEvent) => {
        (event.nativeEvent as typeof event.nativeEvent & { subtitlesMenuClosePrevented?: boolean }).subtitlesMenuClosePrevented = true;
    }, []);
    const onAudioButtonMouseDown = useCallback((event: React.MouseEvent) => {
        (event.nativeEvent as typeof event.nativeEvent & { audioMenuClosePrevented?: boolean }).audioMenuClosePrevented = true;
    }, []);
    const onSpeedButtonMouseDown = useCallback((event: React.MouseEvent) => {
        (event.nativeEvent as typeof event.nativeEvent & { speedMenuClosePrevented?: boolean }).speedMenuClosePrevented = true;
    }, []);
    const onVideosButtonMouseDown = useCallback((event: React.MouseEvent) => {
        (event.nativeEvent as typeof event.nativeEvent & { videosMenuClosePrevented?: boolean }).videosMenuClosePrevented = true;
    }, []);
    const onOptionsButtonMouseDown = useCallback((event: React.MouseEvent) => {
        (event.nativeEvent as typeof event.nativeEvent & { optionsMenuClosePrevented?: boolean }).optionsMenuClosePrevented = true;
    }, []);
    const onStatisticsButtonMouseDown = useCallback((event: React.MouseEvent) => {
        (event.nativeEvent as typeof event.nativeEvent & { statisticsMenuClosePrevented?: boolean }).statisticsMenuClosePrevented = true;
    }, []);
    const onPlayPauseButtonClick = useCallback(() => {
        if (paused) {
            if (typeof onPlayRequested === 'function') {
                onPlayRequested();
            }
        } else {
            if (typeof onPauseRequested === 'function') {
                onPauseRequested();
            }
        }
    }, [paused, onPlayRequested, onPauseRequested]);
    const onNextVideoButtonClick = useCallback(() => {
        if (nextVideo !== null && typeof onNextVideoRequested === 'function') {
            onNextVideoRequested();
        }
    }, [nextVideo, onNextVideoRequested]);
    const onMuteButtonClick = useCallback(() => {
        if (muted) {
            if (typeof onUnmuteRequested === 'function') {
                onUnmuteRequested();
            }
        } else {
            if (typeof onMuteRequested === 'function') {
                onMuteRequested();
            }
        }
    }, [muted, onMuteRequested, onUnmuteRequested]);
    const onChromecastButtonClick = useCallback(() => {
        chromecast.transport.requestSession();
    }, [chromecast]);
    useEffect(() => {
        const onStateChanged = () => {
            setChromecastServiceActive(chromecast.active);
        };
        chromecast.on('stateChanged', onStateChanged);
        return () => {
            chromecast.off('stateChanged', onStateChanged);
        };
    }, [chromecast]);
    return (
        <div
            ref={ref}
            {...props}
            onTouchStart={props.onMouseOver as React.TouchEventHandler<HTMLDivElement> | undefined}
            onTouchMove={props.onMouseMove as React.TouchEventHandler<HTMLDivElement> | undefined}
            onTouchEnd={onTouchEnd}
            className={classnames(className, styles['control-bar-container'])}
        >
            <SeekBar
                className={styles['seek-bar']}
                time={time}
                duration={duration}
                buffered={buffered}
                thumbnailsVttUrl={stream?.thumbnails}
                onSeekRequested={onSeekRequested}
            />
            <div className={styles['control-bar-buttons-container']}>
                <Button className={classnames(styles['control-bar-button'], { 'disabled': typeof paused !== 'boolean' })} title={paused ? t('PLAYER_PLAY') : t('PLAYER_PAUSE')} tabIndex={-1} onClick={onPlayPauseButtonClick}>
                    <Icon className={styles['icon']} name={typeof paused !== 'boolean' || paused ? 'play' : 'pause'} />
                </Button>
                {
                    nextVideo !== null ?
                        <Button className={classnames(styles['control-bar-button'])} title={t('PLAYER_NEXT_VIDEO')} tabIndex={-1} onClick={onNextVideoButtonClick}>
                            <Icon className={styles['icon']} name={'next'} />
                        </Button>
                        :
                        null
                }
                <Button className={classnames(styles['control-bar-button'], { 'disabled': typeof muted !== 'boolean' })} title={muted ? t('PLAYER_UNMUTE') : t('PLAYER_MUTE')} tabIndex={-1} onClick={onMuteButtonClick}>
                    <Icon
                        className={styles['icon']}
                        name={
                            (typeof muted === 'boolean' && muted) ? 'volume-mute' :
                                (volume === null || isNaN(volume as number)) ? 'volume-off' :
                                    volume === 0 ? 'volume-mute' :
                                        (volume as number) < 30 ? 'volume-low' :
                                            (volume as number) < 70 ? 'volume-medium' :
                                                'volume-high'
                        }
                    />
                </Button>
                {
                    !platform.isMobile ?
                        <VolumeSlider
                            className={styles['volume-slider']}
                            volume={volume}
                            muted={muted}
                            onVolumeChangeRequested={onVolumeChangeRequested}
                        />
                        : null
                }
                <div className={styles['spacing']} />
                <Button className={styles['control-bar-buttons-menu-button']} onClick={toggleButtonsMenu}>
                    <Icon className={styles['icon']} name={'more-vertical'} />
                </Button>
                <div className={classnames(styles['control-bar-buttons-menu-container'], { 'open': buttonsMenuOpen })}>
                    <Button className={classnames(styles['control-bar-button'], { 'disabled': statistics === null || statistics === undefined || statistics.type === 'Err' || stream === null || stream === undefined || typeof stream.infoHash !== 'string' || typeof stream.fileIdx !== 'number' })} tabIndex={-1} onMouseDown={onStatisticsButtonMouseDown} onClick={onToggleStatisticsMenu}>
                        <Icon className={styles['icon']} name={'network'} />
                    </Button>
                    <Button className={classnames(styles['control-bar-button'], { 'disabled': playbackSpeed === null })} tabIndex={-1} onMouseDown={onSpeedButtonMouseDown} onClick={onToggleSpeedMenu}>
                        <Icon className={styles['icon']} name={'speed'} />
                    </Button>
                    <Button className={classnames(styles['control-bar-button'], { 'disabled': !chromecastServiceActive })} tabIndex={-1} onClick={onChromecastButtonClick}>
                        <Icon className={styles['icon']} name={'cast'} />
                    </Button>
                    <Button className={classnames(styles['control-bar-button'], { 'disabled': !Array.isArray(subtitlesTracks) || subtitlesTracks.length === 0 })} tabIndex={-1} onMouseDown={onSubtitlesButtonMouseDown} onClick={onToggleSubtitlesMenu}>
                        <Icon className={styles['icon']} name={'subtitles'} />
                    </Button>
                    <Button className={classnames(styles['control-bar-button'], { 'disabled': !Array.isArray(audioTracks) || audioTracks.length === 0 })} tabIndex={-1} onMouseDown={onAudioButtonMouseDown} onClick={onToggleAudioMenu}>
                        <Icon className={styles['icon']} name={'audio-tracks'} />
                    </Button>
                    {
                        (metaItem?.content?.videos?.length ?? 0) > 0 ?
                            <Button className={styles['control-bar-button']} tabIndex={-1} onMouseDown={onVideosButtonMouseDown} onClick={onToggleSideDrawer}>
                                <Icon className={styles['icon']} name={'episodes'} />
                            </Button>
                            :
                            null
                    }
                    <Button className={classnames(styles['control-bar-button'], { 'disabled': !stream })} tabIndex={-1} onMouseDown={onOptionsButtonMouseDown} onClick={onToggleOptionsMenu}>
                        <Icon className={styles['icon']} name={'more-horizontal'} />
                    </Button>
                </div>
            </div>
        </div>
    );
});

ControlBar.displayName = 'ControlBar';

export default ControlBar;
