const React = require('react');
const PropTypes = require('prop-types');
const classnames = require('classnames');
const debounce = require('lodash.debounce');
const { Slider } = require('stremio-common');
const styles = require('./styles');

class VolumeSlider extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            volume: null
        };
    }

    shouldComponentUpdate(nextProps, nextState) {
        return nextState.volume !== this.state.volume ||
            nextProps.className !== this.props.className ||
            nextProps.volume !== this.props.volume;
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
        this.props.dispatch('setProp', 'volume', volume);
    }

    onCancel = () => {
        this.resetVolumeDebounced.cancel();
        this.setState({ volume: null });
    }

    render() {
        const volume = this.state.volume !== null ? this.state.volume : this.props.volume;
        return (
            <div className={classnames(this.props.className, styles['volume-slider-container'], { 'active': this.state.volume !== null })}>
                <Slider
                    className={styles['volume-slider']}
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

VolumeSlider.propTypes = {
    className: PropTypes.string,
    volume: PropTypes.number,
    dispatch: PropTypes.func.isRequired
};

module.exports = VolumeSlider;
