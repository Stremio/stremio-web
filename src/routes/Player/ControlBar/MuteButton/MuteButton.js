const React = require('react');
const PropTypes = require('prop-types');
const classnames = require('classnames');
const Icon = require('stremio-icons/dom');

class MuteButton extends React.Component {
    shouldComponentUpdate(nextProps, nextState) {
        return nextProps.className !== this.props.className ||
            nextProps.volume !== this.props.volume ||
            nextProps.muted !== this.props.muted;
    }

    toggleMuted = () => {
        this.props.dispatch({ propName: 'muted', propValue: !this.props.muted });
    }

    render() {
        const icon = this.props.muted ? 'ic_volume0' :
            (this.props.volume === null || isNaN(this.props.volume)) ? 'ic_volume3' :
                this.props.volume < 30 ? 'ic_volume1' :
                    this.props.volume < 70 ? 'ic_volume2' :
                        'ic_volume3';
        return (
            <div className={classnames(this.props.className, { 'disabled': this.props.muted === null })} onClick={this.toggleMuted}>
                <Icon className={'icon'} icon={icon} />
            </div>
        );
    }
}

MuteButton.propTypes = {
    className: PropTypes.string,
    muted: PropTypes.bool,
    volume: PropTypes.number,
    dispatch: PropTypes.func.isRequired
};

module.exports = MuteButton;
