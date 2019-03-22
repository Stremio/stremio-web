const React = require('react');
const PropTypes = require('prop-types');
const classnames = require('classnames');
const Icon = require('stremio-icons/dom');

class PlayPauseButton extends React.Component {
    shouldComponentUpdate(nextProps, nextState) {
        return nextProps.className !== this.props.className ||
            nextProps.paused !== this.props.paused;
    }

    togglePaused = () => {
        this.props.dispatch('setProp', 'paused', !this.props.paused);
    }

    render() {
        const disabled = this.props.paused === null;
        const icon = this.props.paused ? 'ic_play' : 'ic_pause';
        return (
            <div className={classnames(this.props.className, { 'disabled': disabled })} onClick={this.togglePaused}>
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
