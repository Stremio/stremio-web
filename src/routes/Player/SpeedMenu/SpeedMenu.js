// Copyright (C) 2017-2023 Smart code 203358507

const React = require('react');
const PropTypes = require('prop-types');
const classnames = require('classnames');
const { useTranslation } = require('react-i18next');
const Button = require('stremio/components/Button').default;
const Slider = require('stremio/components/Slider');

const styles = require('./styles');
const RATES = [0.25, 0.5, 1, 1.5, 2, 2.5, 3, 4];

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

    return (
        <div ref={ref} className={classnames(className, styles['speed-menu-container'])} onMouseDown={onMouseDown}>
            <div className={styles['title']}>
                { t('PLAYBACK_SPEED') }
            </div>

            <div className={styles['main-container']}>
                <div className={styles['top-container']}>
                    <div className={styles['speed-title']}>
                        {playbackSpeed}x
                    </div>

                    <Slider
                        className={styles['slider']}
                        value={playbackSpeed}
                        minimumValue={0.1}
                        maximumValue={4}
                        stepValue={0.1}
                        onSlide={onSpeedChanged}
                        onComplete={onSpeedChanged}
                    />
                </div>

                <div className={styles['options-container']}>
                    {
                        RATES.map((rate) => (
                            <Button className={classnames(styles['speed-button'], {[styles['active']]: rate === playbackSpeed})} data-rate={rate} key={rate} onClick={onSpeedButtonClick}>
                                {rate}x
                            </Button>
                        ))
                    }
                </div>
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
