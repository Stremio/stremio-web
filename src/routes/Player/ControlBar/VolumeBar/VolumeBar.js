const React = require('react');
const PropTypes = require('prop-types');
const classnames = require('classnames');
const debounce = require('lodash.debounce');
const Icon = require('stremio-icons/dom');
const { Slider } = require('stremio-common');
const styles = require('./styles');

class VolumeBar extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            volume: null
        };
    }

    shouldComponentUpdate(nextProps, nextState) {
        return nextState.volume !== this.state.volume ||
            nextProps.className !== this.props.className ||
            nextProps.buttonClassName !== this.props.buttonClassName ||
            nextProps.volume !== this.props.volume;
    }

    componentWillUnmount() {
        this.resetVolumeDebounced.cancel();
    }

    toogleVolumeMute = () => {
        const command = this.props.volume > 0 ? 'mute' : 'unmute';
        this.props.dispatch('command', command);
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
        if (this.props.volume === null) {
            return null;
        }

        const volume = this.state.volume !== null ? this.state.volume : this.props.volume;
        const icon = volume === 0 ? 'ic_volume0' :
            volume < 30 ? 'ic_volume1' :
                volume < 70 ? 'ic_volume2' :
                    'ic_volume3';
        return (
            <div className={classnames(styles['volume-bar-container'], { 'active': this.state.volume !== null }, this.props.className)}>
                <div className={this.props.buttonClassName} onClick={this.toogleVolumeMute}>
                    <Icon className={'icon'} icon={icon} />
                </div>
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
    buttonClassName: PropTypes.string,
    volume: PropTypes.number,
    dispatch: PropTypes.func.isRequired
};

export default VolumeBar;
