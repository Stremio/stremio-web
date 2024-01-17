// Copyright (C) 2017-2023 Smart code 203358507

const React = require('react');
const VolumeSlider = require('../ControlBar/VolumeSlider');
const { default: Icon } = require('@stremio/stremio-icons/react');
const { default: classNames } = require('classnames');
const PropTypes = require('prop-types');
const styles = require('./styles');
const { useBinaryState } = require('stremio/common');

const VolumeChangeIndicator = React.memo(({ muted, onVolumeChangeRequested, volume }) => {
    const [volumeIndicatorOpen, openVolumeIndicator, closeVolumeIndicator] = useBinaryState(false);
    const volumeChangeTimeout = React.useRef(null);
    const prevVolume = React.useRef(volume);

    React.useEffect(() => {
        if (prevVolume.current !== volume) {
            openVolumeIndicator();
            if (volumeChangeTimeout.current) clearTimeout(volumeChangeTimeout.current);
            volumeChangeTimeout.current = setTimeout(closeVolumeIndicator, 1500);
        }

        prevVolume.current = volume;
    }, [volume]);

    React.useEffect(() => {
        return () => {
            if (volumeChangeTimeout.current) clearTimeout(volumeChangeTimeout.current);
        };
    }, []);

    return (
        <React.Fragment>
            {
                volumeIndicatorOpen ?
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
                    :
                    null
            }
        </React.Fragment>
    );
});

VolumeChangeIndicator.displayName = 'VolumeChangeIndicator';

module.exports = VolumeChangeIndicator;

VolumeChangeIndicator.propTypes = {
    muted: PropTypes.bool,
    onVolumeChangeRequested: PropTypes.func,
    volume: PropTypes.number
};
