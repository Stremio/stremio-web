// Copyright (C) 2017-2023 Smart code 203358507

const React = require('react');
const PropTypes = require('prop-types');
const classnames = require('classnames');
const { useTranslation } = require('react-i18next');
const Option = require('./Option');
const styles = require('./styles');

const RATES = Array.from(Array(8).keys(), (n) => n * 0.25 + 0.25).reverse();

const SpeedMenu = ({ className, playbackSpeed, onPlaybackSpeedChanged }) => {
    const { t } = useTranslation();
    const onMouseDown = React.useCallback((event) => {
        event.nativeEvent.speedMenuClosePrevented = true;
    }, []);
    const onOptionSelect = React.useCallback((value) => {
        if (typeof onPlaybackSpeedChanged === 'function') {
            onPlaybackSpeedChanged(value);
        }
    }, [onPlaybackSpeedChanged]);
    return (
        <div className={classnames(className, styles['speed-menu-container'])} onMouseDown={onMouseDown}>
            <div className={styles['title']}>
                { t('PLAYBACK_SPEED') }
            </div>
            <div className={styles['options-container']}>
                {
                    RATES.map((rate) => (
                        <Option
                            className={styles['option']}
                            key={rate}
                            value={rate}
                            selected={rate === playbackSpeed}
                            onSelect={onOptionSelect}
                        />
                    ))
                }
            </div>
        </div>
    );
};

SpeedMenu.propTypes = {
    className: PropTypes.string,
    playbackSpeed: PropTypes.number,
    onPlaybackSpeedChanged: PropTypes.func,
};

module.exports = SpeedMenu;
