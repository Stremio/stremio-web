import React, { Component } from 'react';
import PropTypes from 'prop-types';
import hat from 'hat';
import HTMLVideo from './stremio-video/HTMLVideo';
import YouTubeVideo from './stremio-video/YouTubeVideo';

class Video extends Component {
    constructor(props) {
        super(props);

        this.containerRef = React.createRef();
        this.id = `video-${hat()}`;
        this.video = null;
    }

    componentDidMount() {
        const Video = this.selectVideoImplementation();
        this.video = new Video(this.containerRef.current);
        this.video.on('ended', this.props.onEnded);
        this.video.on('error', this.props.onError);
        this.video.on('propValue', this.props.onPropValue);
        this.video.on('propChanged', this.props.onPropChanged);
        this.video.constructor.manifest.props.forEach((propName) => {
            this.dispatch('observeProp', propName);
        });
        this.dispatch('command', 'load', this.props.stream, this.props.extra);
    }

    shouldComponentUpdate() {
        return false;
    }

    componentWillUnmount() {
        this.dispatch('stop');
    }

    selectVideoImplementation = () => {
        if (this.props.stream.ytId) {
            return YouTubeVideo;
        } else {
            return HTMLVideo;
        }
    }

    dispatch = (...args) => {
        try {
            this.video && this.video.dispatch(...args);
        } catch (e) {
            console.error(this.video.constructor.manifest.name, e);
        }
    }

    render() {
        return (
            <div ref={this.containerRef} id={this.id} className={this.props.className} />
        );
    }
}

Video.propTypes = {
    className: PropTypes.string,
    stream: PropTypes.object.isRequired,
    extra: PropTypes.object.isRequired,
    onEnded: PropTypes.func.isRequired,
    onError: PropTypes.func.isRequired,
    onPropValue: PropTypes.func.isRequired,
    onPropChanged: PropTypes.func.isRequired
};
Video.defaultProps = {
    extra: {}
};

export default Video;
