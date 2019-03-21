import React, { Component } from 'react';
import PropTypes from 'prop-types';
import hat from 'hat';
import HTMLVideo from './stremio-video/HTMLVideo';
import YouTubeVideo from './stremio-video/YouTubeVideo';
import MPVVideo from './stremio-video/MPVVideo';

class Video extends Component {
    constructor(props) {
        super(props);

        this.containerRef = React.createRef();
        this.id = `video-${hat()}`;
        this.video = null;
    }

    shouldComponentUpdate() {
        return false;
    }

    componentWillUnmount() {
        this.dispatch('command', 'destroy');
    }

    selectVideoImplementation = (stream, options) => {
        if (options.ipc) {
            return MPVVideo;
        } else if (stream.ytId) {
            return YouTubeVideo;
        } else {
            return HTMLVideo;
        }
    }

    dispatch = (...args) => {
        if (args[0] === 'command' && args[1] === 'load') {
            const Video = this.selectVideoImplementation(args[2], args[3]);
            if (this.video === null || this.video.constructor !== Video) {
                this.dispatch('command', 'destroy');
                this.video = new Video({
                    ...args[3],
                    id: this.id,
                    containerElement: this.containerRef.current
                });
                this.video.on('ended', this.props.onEnded);
                this.video.on('error', this.props.onError);
                this.video.on('propValue', this.props.onPropValue);
                this.video.on('propChanged', this.props.onPropChanged);
                this.video.constructor.manifest.props.forEach((propName) => {
                    this.dispatch('observeProp', propName);
                });
            }
        }

        try {
            this.video && this.video.dispatch(...args);
        } catch (e) {
            console.error(this.video.constructor.manifest.name, e);
        }
    }

    render() {
        return (
            <div ref={this.containerRef} className={this.props.className} />
        );
    }
}

Video.propTypes = {
    className: PropTypes.string,
    onEnded: PropTypes.func.isRequired,
    onError: PropTypes.func.isRequired,
    onPropValue: PropTypes.func.isRequired,
    onPropChanged: PropTypes.func.isRequired
};

export default Video;
