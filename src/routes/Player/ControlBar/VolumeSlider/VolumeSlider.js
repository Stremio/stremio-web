import React, { Component } from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import debounce from 'lodash.debounce';
import { Slider } from 'stremio-common';
import styles from './styles';

class VolumeSlider extends Component {
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
        return (
            <Slider
                className={classnames(styles['slider'], this.props.className)}
                value={volume}
                minimumValue={0}
                maximumValue={100}
                orientation={'horizontal'}
                onSlide={this.onSlide}
                onComplete={this.onComplete}
                onCancel={this.onCancel}
            />
        );
    }
}

VolumeSlider.propTypes = {
    className: PropTypes.string,
    volume: PropTypes.number,
    setVolume: PropTypes.func.isRequired
};

export default VolumeSlider;
