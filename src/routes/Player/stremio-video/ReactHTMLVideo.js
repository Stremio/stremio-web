import React, { Component } from 'react';
import PropTypes from 'prop-types';
import HTMLVideo from './HTMLVideo';

class ReactHTMLVideo extends Component {
    constructor(props) {
        super(props);

        this.videoRef = React.createRef();
    }

    componentDidMount() {
        this.video = new HTMLVideo(this.videoRef.current);
        this.video.on('ended', this.props.onEnded);
        this.video.on('error', this.props.onError);
        this.video.on('propValue', this.props.onPropValue);
        this.video.on('propChanged', this.props.onPropChanged);
        this.props.observedProps.forEach((propName) => {
            this.dispatch('observeProp', propName);
        });
    }

    componentWillUnmount() {
        this.dispatch('stop');
    }

    shouldComponentUpdate() {
        return false;
    }

    dispatch = (...args) => {
        try {
            this.video && this.video.dispatch(...args);
        } catch (e) {
            console.error('HTMLVideo', e);
        }
    }

    render() {
        return (
            <video ref={this.videoRef} className={this.props.className} />
        );
    }
}

ReactHTMLVideo.manifest = HTMLVideo.manifest;

ReactHTMLVideo.propTypes = {
    className: PropTypes.string,
    onEnded: PropTypes.func.isRequired,
    onError: PropTypes.func.isRequired,
    onPropValue: PropTypes.func.isRequired,
    onPropChanged: PropTypes.func.isRequired,
    observedProps: PropTypes.arrayOf(PropTypes.string).isRequired
};

export default ReactHTMLVideo;
