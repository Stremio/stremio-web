// Copyright (C) 2017-2024 Smart code 203358507

const React = require('react');
const PropTypes = require('prop-types');
const classnames = require('classnames');
const { useTranslation } = require('react-i18next');
const { default: Icon } = require('@stremio/stremio-icons/react');
const { Button, Slider } = require('stremio/components');
const styles = require('./styles');

const MIN_SPEED = 0.25;
const MAX_SPEED = 2;
const SPEED_STEP = 0.25;
const PRESETS = [0.5, 1, 1.25, 1.5, 2];

const snap = (value) => {
    const clamped = Math.min(MAX_SPEED, Math.max(MIN_SPEED, value));
    return Math.round(clamped / SPEED_STEP) * SPEED_STEP;
};

const formatPreset = (value) => value % 1 === 0 ? value.toFixed(1) : String(value);

const SpeedMenu = React.memo(React.forwardRef(({ className, playbackSpeed, onPlaybackSpeedChanged }, ref) => {
    const { t } = useTranslation();
    const speed = typeof playbackSpeed === 'number' && !isNaN(playbackSpeed) ? snap(playbackSpeed) : 1;
    const [sliding, setSliding] = React.useState(null);
    const displaySpeed = sliding !== null ? snap(sliding) : speed;
    const canDecrease = displaySpeed > MIN_SPEED;
    const canIncrease = displaySpeed < MAX_SPEED;
    const onMouseDown = React.useCallback((event) => {
        event.nativeEvent.speedMenuClosePrevented = true;
    }, []);
    const setSpeed = React.useCallback((value) => {
        if (typeof onPlaybackSpeedChanged === 'function') {
            onPlaybackSpeedChanged(snap(value));
        }
    }, [onPlaybackSpeedChanged]);
    const onDecrease = React.useCallback(() => {
        if (canDecrease) {
            setSpeed(displaySpeed - SPEED_STEP);
        }
    }, [canDecrease, displaySpeed, setSpeed]);
    const onIncrease = React.useCallback(() => {
        if (canIncrease) {
            setSpeed(displaySpeed + SPEED_STEP);
        }
    }, [canIncrease, displaySpeed, setSpeed]);
    const onSlide = React.useCallback((value) => {
        setSliding(value);
        setSpeed(value);
    }, [setSpeed]);
    const onComplete = React.useCallback((value) => {
        setSliding(null);
        setSpeed(value);
    }, [setSpeed]);
    return (
        <div ref={ref} className={classnames(className, styles['speed-menu-container'])} onMouseDown={onMouseDown}>
            <div className={styles['title']}>
                { t('PLAYBACK_SPEED') }
            </div>
            <div className={styles['readout']}>
                <div className={styles['value']}>{ displaySpeed.toFixed(2) }x</div>
                <div className={styles['descriptor']}>
                    { displaySpeed === 1 ? t('PLAYBACK_SPEED_NORMAL', 'Normal') : ' ' }
                </div>
            </div>
            <div className={styles['stepper']}>
                <Button
                    className={classnames(styles['step-button'], { 'disabled': !canDecrease })}
                    title={t('SETTINGS_SHORTCUT_DECREASE_PLAYBACK_SPEED')}
                    disabled={!canDecrease}
                    onClick={onDecrease}
                >
                    <Icon className={styles['icon']} name={'remove'} />
                </Button>
                <Slider
                    className={styles['slider']}
                    value={sliding !== null ? sliding : speed}
                    minimumValue={MIN_SPEED}
                    maximumValue={MAX_SPEED}
                    onSlide={onSlide}
                    onComplete={onComplete}
                />
                <Button
                    className={classnames(styles['step-button'], { 'disabled': !canIncrease })}
                    title={t('SETTINGS_SHORTCUT_INCREASE_PLAYBACK_SPEED')}
                    disabled={!canIncrease}
                    onClick={onIncrease}
                >
                    <Icon className={styles['icon']} name={'add'} />
                </Button>
            </div>
            <div className={styles['presets']}>
                {
                    PRESETS.map((preset) => (
                        <Button
                            key={preset}
                            className={classnames(styles['preset'], { 'selected': displaySpeed === preset })}
                            onClick={() => setSpeed(preset)}
                        >
                            { formatPreset(preset) }
                        </Button>
                    ))
                }
            </div>
        </div>
    );
}));

SpeedMenu.propTypes = {
    className: PropTypes.string,
    playbackSpeed: PropTypes.number,
    onPlaybackSpeedChanged: PropTypes.func,
};

module.exports = SpeedMenu;
