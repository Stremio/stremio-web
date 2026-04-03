// Copyright (C) 2017-2023 Smart code 203358507

const React = require('react');
const { createPortal } = require('react-dom');
const PropTypes = require('prop-types');
const classnames = require('classnames');
const debounce = require('lodash.debounce');
const { useRouteFocused } = require('stremio-router');
const { useBinaryState } = require('stremio/common');
const { Button, Slider } = require('stremio/components');
const formatTime = require('./formatTime').default;
const { findThumbnailCue } = require('./parseThumbnailVtt');
const useThumbnailCues = require('./useThumbnailCues').default;
const styles = require('./styles');

const PREVIEW_EXIT_MS = 180;
const PREVIEW_MAX_WIDTH_PX = 200;
const PREVIEW_MAX_HEIGHT_PX = 135;

const SeekBar = ({ className, time, duration, buffered, thumbnailsVttUrl, onSeekRequested }) => {
    const disabled = time === null || isNaN(time) || duration === null || isNaN(duration);
    const routeFocused = useRouteFocused();
    const [seekTime, setSeekTime] = React.useState(null);
    const [preview, setPreview] = React.useState(null);
    const [previewUiVisible, setPreviewUiVisible] = React.useState(false);
    const previewDismissTimerRef = React.useRef(null);
    const prevPreviewRef = React.useRef(null);
    const seekTrackRef = React.useRef(null);
    const [spriteSize, setSpriteSize] = React.useState({ width: 0, height: 0 });

    const { cues } = useThumbnailCues(
        typeof thumbnailsVttUrl === 'string' && thumbnailsVttUrl.length > 0 ? thumbnailsVttUrl : null
    );

    const [remainingTimeMode,,, toggleRemainingTimeMode] = useBinaryState(false);
    const resetTimeDebounced = React.useCallback(debounce(() => {
        setSeekTime(null);
    }, 1500), []);
    const onSlide = React.useCallback((time) => {
        resetTimeDebounced.cancel();
        setSeekTime(time);
    }, []);
    const onComplete = React.useCallback((time) => {
        resetTimeDebounced();
        setSeekTime(time);
        if (typeof onSeekRequested === 'function') {
            onSeekRequested(time);
        }
    }, [onSeekRequested]);

    const onPreviewTimeChange = React.useCallback((timeMs, clientX, clientY) => {
        if (timeMs === null || clientX === null) {
            if (previewDismissTimerRef.current !== null) {
                clearTimeout(previewDismissTimerRef.current);
                previewDismissTimerRef.current = null;
            }
            setPreviewUiVisible(false);
            previewDismissTimerRef.current = window.setTimeout(() => {
                previewDismissTimerRef.current = null;
                setPreview(null);
            }, PREVIEW_EXIT_MS);
            return;
        }

        if (previewDismissTimerRef.current !== null) {
            clearTimeout(previewDismissTimerRef.current);
            previewDismissTimerRef.current = null;
        }
        setPreview({ timeMs, clientX, clientY });
    }, []);

    React.useLayoutEffect(() => {
        if (preview === null) {
            setPreviewUiVisible(false);
            prevPreviewRef.current = null;
            return;
        }

        const wasAbsent = prevPreviewRef.current === null;
        prevPreviewRef.current = preview;

        if (wasAbsent) {
            setPreviewUiVisible(false);
            let raf2 = 0;
            const raf1 = requestAnimationFrame(() => {
                raf2 = requestAnimationFrame(() => {
                    setPreviewUiVisible(true);
                });
            });
            return () => {
                cancelAnimationFrame(raf1);
                if (raf2 !== 0) {
                    cancelAnimationFrame(raf2);
                }
            };
        }

        setPreviewUiVisible(true);
    }, [preview]);

    const previewCue = React.useMemo(() => {
        if (preview === null || cues.length === 0) {
            return null;
        }

        const tSec = preview.timeMs / 1000;
        return findThumbnailCue(cues, tSec);
    }, [preview, cues]);

    const resolvedImageUrl = React.useMemo(() => {
        if (previewCue === null || typeof thumbnailsVttUrl !== 'string') {
            return null;
        }

        try {
            return new URL(previewCue.url, thumbnailsVttUrl).href;
        } catch {
            return previewCue.url;
        }
    }, [previewCue, thumbnailsVttUrl]);

    React.useEffect(() => {
        if (resolvedImageUrl === null) {
            setSpriteSize({ width: 0, height: 0 });
            return;
        }

        const img = new Image();
        img.onload = () => {
            setSpriteSize({ width: img.naturalWidth, height: img.naturalHeight });
        };
        img.onerror = () => {
            setSpriteSize({ width: 0, height: 0 });
        };
        img.src = resolvedImageUrl;
    }, [resolvedImageUrl]);

    React.useLayoutEffect(() => {
        if (!routeFocused || disabled) {
            resetTimeDebounced.cancel();
            setSeekTime(null);
            setPreviewUiVisible(false);
            if (previewDismissTimerRef.current !== null) {
                clearTimeout(previewDismissTimerRef.current);
                previewDismissTimerRef.current = null;
            }
            setPreview(null);
        }
    }, [routeFocused, disabled]);
    React.useEffect(() => {
        return () => {
            resetTimeDebounced.cancel();
            if (previewDismissTimerRef.current !== null) {
                clearTimeout(previewDismissTimerRef.current);
            }
        };
    }, []);

    const hasThumbnailsVttUrl = typeof thumbnailsVttUrl === 'string' && thumbnailsVttUrl.length > 0;
    const showImagePreview = hasThumbnailsVttUrl && preview !== null && previewCue !== null && resolvedImageUrl !== null && spriteSize.width > 0;
    const showTimeOnlyPreview = preview !== null && !showImagePreview;

    let previewBubble = null;
    const buildPortalStyle = () => {
        if (preview === null || typeof document === 'undefined') {
            return null;
        }

        const trackRect = seekTrackRef.current?.getBoundingClientRect();
        const top = trackRect && trackRect.height > 0 ?
            trackRect.top
            :
            (typeof preview.clientY === 'number' ? preview.clientY : 0);
        return {
            position: 'fixed',
            left: preview.clientX,
            top,
            right: 'auto',
            bottom: 'auto',
            maxWidth: 'none',
            transform: 'translate(-50%, calc(-100% - 0.5rem))',
            zIndex: 10000,
            pointerEvents: 'none',
        };
    };

    const portalStyle = buildPortalStyle();

    const previewCardClass = classnames(styles['seek-preview-card'], {
        [styles['seek-preview-card-visible']]: previewUiVisible,
    });

    if (showImagePreview && portalStyle !== null && previewCue !== null && resolvedImageUrl !== null) {
        const rawW = previewCue.w > 0 ? previewCue.w : Math.min(160, spriteSize.width);
        const rawH = previewCue.h > 0 ? previewCue.h : Math.min(90, spriteSize.height);
        const previewScale = Math.min(
            PREVIEW_MAX_WIDTH_PX / Math.max(rawW, 1),
            PREVIEW_MAX_HEIGHT_PX / Math.max(rawH, 1)
        );
        const w = rawW * previewScale;
        const h = rawH * previewScale;
        previewBubble = createPortal(
            (
                <div className={styles['seek-preview']} style={portalStyle}>
                    <div className={previewCardClass}>
                        <div className={styles['seek-preview-frame']}>
                            <div
                                className={styles['seek-preview-image-wrap']}
                                style={{ width: `${w}px`, height: `${h}px` }}
                            >
                                <img
                                    alt=""
                                    className={styles['seek-preview-image']}
                                    src={resolvedImageUrl}
                                    style={{
                                        width: `${spriteSize.width * previewScale}px`,
                                        height: `${spriteSize.height * previewScale}px`,
                                        marginLeft: `${-previewCue.x * previewScale}px`,
                                        marginTop: `${-previewCue.y * previewScale}px`,
                                    }}
                                />
                                <div className={styles['seek-preview-time']}>
                                    {formatTime(preview.timeMs)}
                                </div>
                            </div>
                        </div>
                        <span className={styles['seek-preview-caret']} aria-hidden={true} />
                    </div>
                </div>
            ),
            document.body
        );
    } else if (showTimeOnlyPreview && portalStyle !== null) {
        previewBubble = createPortal(
            (
                <div className={styles['seek-preview']} style={portalStyle}>
                    <div className={previewCardClass}>
                        <div className={classnames(styles['seek-preview-frame'], styles['seek-preview-frame-time-only'])}>
                            <div className={styles['seek-preview-time']}>
                                {formatTime(preview.timeMs)}
                            </div>
                        </div>
                        <span className={styles['seek-preview-caret']} aria-hidden={true} />
                    </div>
                </div>
            ),
            document.body
        );
    }

    return (
        <div className={classnames(className, styles['seek-bar-container'], { 'active': seekTime !== null })}>
            <div className={styles['label']}>{formatTime(seekTime !== null ? seekTime : time)}</div>
            <div ref={seekTrackRef} className={styles['seek-bar-track']}>
                {previewBubble}
                <Slider
                    className={classnames(styles['slider'], { 'active': seekTime !== null })}
                    value={
                        !disabled ?
                            seekTime !== null ? seekTime : time
                            :
                            0
                    }
                    buffered={buffered}
                    minimumValue={0}
                    maximumValue={duration}
                    disabled={disabled}
                    onSlide={onSlide}
                    onComplete={onComplete}
                    onPreviewTimeChange={onPreviewTimeChange}
                />
            </div>
            <Button onClick={toggleRemainingTimeMode} tabIndex={-1}>
                <div className={styles['label']}>
                    {remainingTimeMode && duration !== null && !isNaN(duration)
                        ? formatTime(duration - time, '-')
                        : formatTime(duration) }
                </div>
            </Button>
        </div>
    );
};

SeekBar.propTypes = {
    className: PropTypes.string,
    time: PropTypes.number,
    duration: PropTypes.number,
    buffered: PropTypes.number,
    thumbnailsVttUrl: PropTypes.string,
    onSeekRequested: PropTypes.func
};

module.exports = SeekBar;
