import React, { Component } from 'react';
import PropTypes from 'prop-types';
import HTMLVideo from './HTMLVideo';

class ReactHTMLVideo extends Component {
    componentDidMount() {
        this.video = new HTMLVideo(this.videoElement);
        this.video.addListener('propChanged', this.props.onPropChanged);
        this.video.addListener('propValue', this.props.onPropValue);
        this.video.addListener('error', this.props.onError);
        this.video.addListener('ended', this.props.onEnded);
        this.props.observedProps.forEach((propName) => {
            this.video.dispatch('observeProp', propName);
        });
    }

    componentWillUnmount() {
        this.video.removeListener('propChanged', this.props.onPropChanged);
        this.video.removeListener('propValue', this.props.onPropValue);
        this.video.removeListener('error', this.props.onError);
        this.video.removeListener('ended', this.props.onEnded);
    }

    shouldComponentUpdate() {
        return false;
    }

    assignVideoElement = (videoElement) => {
        this.videoElement = videoElement;
    }

    dispatch = (...args) => {
        this.video.dispatch(...args);
    }

    render() {
        return (
            <video ref={this.assignVideoElement} className={this.props.className}></video>
        );
    }
}

ReactHTMLVideo.manifest = HTMLVideo.manifest;

ReactHTMLVideo.propTypes = {
    className: PropTypes.string,
    onPropChanged: PropTypes.func.isRequired,
    onPropValue: PropTypes.func.isRequired,
    onError: PropTypes.func.isRequired,
    onEnded: PropTypes.func.isRequired,
    observedProps: PropTypes.arrayOf(PropTypes.string).isRequired
};

export default ReactHTMLVideo;
