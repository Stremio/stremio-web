import React, { Component, Fragment } from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import debounce from 'lodash.debounce';
import { Slider } from 'stremio-common';
import styles from './styles';

class VolumeBar extends Component {
    constructor(props) {
        super(props);

        this.state = {
            volume: null
        };
    }

    shouldComponentUpdate(nextProps, nextState) {
        return nextState.volume !== this.state.volume ||
            nextProps.volume !== this.props.volume ||
            nextProps.className !== this.props.className;
    }

    componentWillUnmount() {
        this.resetVolumeDebounced.cancel();
    }

    toogleVolumeMute = () => {
        this.props.volume === 0 ? this.props.unmute() : this.props.mute();
    }

    resetVolumeDebounced = debounce(() => {
        this.setState({ volume: null });
    }, 100)

    onSlide = (volume) => {
        this.resetVolumeDebounced.cancel();
        this.setState({ volume });
    }

    onComplete = (volume) => {
        this.resetVolumeDebounced();
        this.setState({ volume });
        this.props.setVolume(volume);
    }

    onCancel = () => {
        this.resetVolumeDebounced.cancel();
        this.setState({ volume: null });
    }

    render() {
        if (this.props.volume === null) {
            return null;
        }

        const volume = this.state.volume !== null ? this.state.volume : this.props.volume;
        const icon = volume === 0 ? 'ic_volume0' :
            volume < 30 ? 'ic_volume1' :
                volume < 70 ? 'ic_volume2' :
                    'ic_volume3';
        return (
            <div className={classnames(styles['volume-bar-container'], this.props.className)}>
                {React.createElement(this.props.toggleButtonComponent, { icon, onClick: this.toogleVolumeMute }, null)}
                <Slider
                    className={styles['slider']}
                    value={volume}
                    minimumValue={0}
                    maximumValue={100}
                    orientation={'horizontal'}
                    onSlide={this.onSlide}
                    onComplete={this.onComplete}
                    onCancel={this.onCancel}
                />
            </div>
        );
    }
}

VolumeBar.propTypes = {
    className: PropTypes.string,
    volume: PropTypes.number,
    toggleButtonComponent: PropTypes.oneOfType([PropTypes.object, PropTypes.func]).isRequired,
    setVolume: PropTypes.func.isRequired
};

export default VolumeBar;



// if (this.props.volume === null) {
//     return null;
// }

// const icon = this.props.volume === 0 ? 'ic_volume0' :
//     this.props.volume < 50 ? 'ic_volume1' :
//         this.props.volume < 100 ? 'ic_volume2' :
//             'ic_volume3';
// return (
//     <Fragment>
//         <div className={styles['control-bar-button']} onClick={this.toogleVolumeMute}>
//             <Icon className={styles['icon']} icon={icon} />
//         </div>
//         <VolumeSlider
//             className={styles['volume-slider']}
//             volume={this.props.volume}
//             setVolume={this.setVolume}
//         />
//     </Fragment>
// );