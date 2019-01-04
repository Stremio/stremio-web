import React, { Component } from 'react';

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

export default PlayPauseButton;
