import React, { Component } from 'react';
import PropTypes from 'prop-types';
import YouTubeVideo from './YouTubeVideo';

class ReactYouTubeVideo extends Component {
    constructor(props) {
        super(props);

        this.videoContainerRef = React.createRef();
    }

    componentDidMount() {
        this.video = new YouTubeVideo(this.videoContainerRef.current);
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
            console.error('YouTubeVideo', e);
        }
    }

    render() {
        return (
            <div ref={this.videoContainerRef} className={this.props.className} />
        );
    }
}

ReactYouTubeVideo.manifest = YouTubeVideo.manifest;

ReactYouTubeVideo.propTypes = {
    className: PropTypes.string,
    onEnded: PropTypes.func.isRequired,
    onError: PropTypes.func.isRequired,
    onPropValue: PropTypes.func.isRequired,
    onPropChanged: PropTypes.func.isRequired,
    observedProps: PropTypes.arrayOf(PropTypes.string).isRequired
};

export default ReactYouTubeVideo;
