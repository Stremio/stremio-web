// Copyright (C) 2017-2022 Smart code 203358507

const React = require('react');
const PropTypes = require('prop-types');
const classnames = require('classnames');
const { Multiselect } = require('stremio/common');
const styles = require('./styles');

const RATES = Array.from(Array(8).keys(), (n) => n * 0.25 + 0.25).reverse();

const SpeedMenu = ({ className, playbackSpeed, onPlaybackSpeedChanged }) => {
    const onMouseDown = React.useCallback((event) => {
        event.nativeEvent.speedMenuClosePrevented = true;
    }, []);
    const onOptionSelect = React.useCallback((event) => {
        if (typeof onPlaybackSpeedChanged === 'function' && event.value) {
            onPlaybackSpeedChanged(parseFloat(event.value));
        }
    }, [onPlaybackSpeedChanged]);
    const selectableOptions = React.useMemo(() => ({
        title: 'Playback Speed',
        options: RATES.map((rate) => ({
            value: `${rate}`,
            label: `${rate}x`,
            title: `${rate}x`
        })),
        selected: [`${playbackSpeed}`],
        renderLabelText: () => `${playbackSpeed}x`,
        onSelect: onOptionSelect
    }), [playbackSpeed, onOptionSelect]);
    return (
        <div className={classnames(className, styles['speed-menu-container'])} onMouseDown={onMouseDown}>
            <div className={styles['title']}>
                Playback Speed
            </div>
            <Multiselect
                {...selectableOptions}
                className={styles['select-input-container']}
            />
        </div>
    );
};

SpeedMenu.propTypes = {
    className: PropTypes.string,
    playbackSpeed: PropTypes.number,
    onPlaybackSpeedChanged: PropTypes.func,
};

module.exports = SpeedMenu;
