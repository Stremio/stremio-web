// Copyright (C) 2017-2023 Smart code 203358507

const React = require('react');
const VolumeSlider = require('../ControlBar/VolumeSlider');
const { default: Icon } = require('@stremio/stremio-icons/react');
const { default: classNames } = require('classnames');
const PropTypes = require('prop-types');
const styles = require('./styles');

const VolumeChangeIndicator = ({ muted, onVolumeChangeRequested, volume }) => {
    return (
        <div className={classNames(styles['layer'], styles['volume-change-indicator'])}>
            <Icon name={
                (typeof muted === 'boolean' && muted) ? 'volume-mute' :
                    (volume === null || isNaN(volume)) ? 'volume-off' :
                        volume < 30 ? 'volume-low' :
                            volume < 70 ? 'volume-medium' :
                                'volume-high'
            } className={styles['volume-icon']} />
            <VolumeSlider volume={volume} onVolumeChangeRequested={onVolumeChangeRequested} className={styles['volume-slider']} />
        </div>
    );
};

module.exports = VolumeChangeIndicator;

VolumeChangeIndicator.propTypes = {
    muted: PropTypes.bool,
    onVolumeChangeRequested: PropTypes.func,
    volume: PropTypes.number
};
