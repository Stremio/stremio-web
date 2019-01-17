import React, { Component } from 'react';
import PropTypes from 'prop-types';

class PlayPauseButton extends Component {
    shouldComponentUpdate(nextProps, nextState) {
        return nextProps.paused !== this.props.paused ||
            nextProps.toggleButtonComponent !== this.props.toggleButtonComponent;
    }

    togglePaused = () => {
        this.props.dispatch('setProp', 'paused', !this.props.paused);
    }

    render() {
        if (this.props.paused === null) {
            return null;
        }

        const icon = this.props.paused ? 'ic_play' : 'ic_pause';
        return React.createElement(this.props.toggleButtonComponent, { icon, onClick: this.togglePaused }, null);
    }
}

PlayPauseButton.propTypes = {
    paused: PropTypes.bool,
    dispatch: PropTypes.func.isRequired,
    toggleButtonComponent: PropTypes.oneOfType([
        PropTypes.func,
        PropTypes.string,
        PropTypes.shape({ render: PropTypes.func.isRequired }),
    ]).isRequired
};

export default PlayPauseButton;
