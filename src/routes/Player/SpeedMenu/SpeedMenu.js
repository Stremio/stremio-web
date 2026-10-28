// Copyright (C) 2017-2023 Smart code 203358507

const React = require('react');
const PropTypes = require('prop-types');
const classnames = require('classnames');
const { useTranslation } = require('react-i18next');
const { default: Icon } = require('@stremio/stremio-icons/react');
const Button = require('stremio/components/Button').default;
const Slider = require('stremio/components/Slider');

const styles = require('./styles');
const RATES = [0.5, 1, 1.25, 1.5, 1.75, 2, 4];
const MIN_RATE = 0.1;
const MAX_RATE = 4;
const RATE_STEP = 0.05;

const SpeedMenu = React.memo(React.forwardRef(({ className, playbackSpeed, onPlaybackSpeedChanged }, ref) => {
    const { t } = useTranslation();
    const onMouseDown = React.useCallback((event) => {
        event.nativeEvent.speedMenuClosePrevented = true;
    }, []);
    const onSpeedChanged = React.useCallback((value) => {
        if (typeof onPlaybackSpeedChanged === 'function') {
            onPlaybackSpeedChanged(value);
        }
    }, [onPlaybackSpeedChanged]);
    const onSpeedButtonClick = React.useCallback((event) => {
        onSpeedChanged(Number(event.currentTarget.dataset.rate));
    }, [onSpeedChanged]);
    const onStepButtonClick = React.useCallback((event) => {
        const rate = parseFloat((playbackSpeed + Number(event.currentTarget.dataset.step)).toFixed(2));
        onSpeedChanged(Math.min(MAX_RATE, Math.max(MIN_RATE, rate)));
    }, [playbackSpeed, onSpeedChanged]);

    return (
        <div ref={ref} className={classnames(className, styles['speed-menu-container'])} onMouseDown={onMouseDown}>
            <div className={styles['title']}>
                { t('PLAYBACK_SPEED') }
            </div>

            <div className={styles['speed-title']}>
                {playbackSpeed?.toFixed(2)}x
            </div>

            <div className={styles['slider-container']}>
                <Button className={styles['step-button']} title={t('SETTINGS_SHORTCUT_DECREASE_PLAYBACK_SPEED')} disabled={playbackSpeed <= MIN_RATE} data-step={-RATE_STEP} onClick={onStepButtonClick}>
                    <Icon className={styles['icon']} name={'remove'} />
                </Button>

                <Slider
                    className={styles['slider']}
                    value={playbackSpeed}
                    minimumValue={MIN_RATE}
                    maximumValue={MAX_RATE}
                    stepValue={RATE_STEP}
                    onSlide={onSpeedChanged}
                    onComplete={onSpeedChanged}
                />

                <Button className={styles['step-button']} title={t('SETTINGS_SHORTCUT_INCREASE_PLAYBACK_SPEED')} disabled={playbackSpeed >= MAX_RATE} data-step={RATE_STEP} onClick={onStepButtonClick}>
                    <Icon className={styles['icon']} name={'add'} />
                </Button>
            </div>

            <div className={styles['options-container']}>
                {
                    RATES.map((rate) => (
                        <Button className={classnames(styles['speed-button'], {[styles['active']]: rate === playbackSpeed})} data-rate={rate} key={rate} onClick={onSpeedButtonClick}>
                            {Number.isInteger(rate) ? rate.toFixed(1) : rate}
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
