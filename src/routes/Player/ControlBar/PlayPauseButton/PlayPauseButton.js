const React = require('react');
const PropTypes = require('prop-types');
const Icon = require('stremio-icons/dom');

class PlayPauseButton extends React.Component {
    shouldComponentUpdate(nextProps, nextState) {
        return nextProps.paused !== this.props.paused ||
            nextProps.className !== this.props.className;
    }

    togglePaused = () => {
        this.props.dispatch('setProp', 'paused', !this.props.paused);
    }

    render() {
        if (this.props.paused === null) {
            return null;
        }

        const icon = this.props.paused ? 'ic_play' : 'ic_pause';
        return (
            <div className={this.props.className} onClick={this.togglePaused}>
                <Icon className={'icon'} icon={icon} />
            </div>
        );
    }
}

PlayPauseButton.propTypes = {
    className: PropTypes.string,
    paused: PropTypes.bool,
    dispatch: PropTypes.func.isRequired
};

module.exports = PlayPauseButton;
