import React, { Component } from 'react';
import PropTypes from 'prop-types';
import HTMLVideo from './stremio-video/HTMLVideo';
import YouTubeVideo from './stremio-video/YouTubeVideo';

class Video extends Component {
    constructor(props) {
        super(props);

        this.video = null;
        this.containerRef = React.createRef();
    }

    shouldComponentUpdate() {
        return false;
    }

    componentDidMount() {
        const extra = {
            time: 40000
        };
        const stream = {
            ytId: 'E4A0bcCQke0',
            // url: 'http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4'
        };
        this.chooseImplementation(stream)
            .then((implementation) => {
                this.video = new implementation(this.containerRef.current);
                this.video.on('ended', this.props.onEnded);
                this.video.on('error', this.props.onError);
                this.video.on('propValue', this.props.onPropValue);
                this.video.on('propChanged', this.props.onPropChanged);
                this.video.constructor.manifest.props.forEach((propName) => {
                    this.dispatch('observeProp', propName);
                });
                this.dispatch('command', 'load', stream, extra);
            })
            .catch((error) => {
                this.props.onError(error);
            });
    }

    componentWillUnmount() {
        this.dispatch('stop');
    }

    chooseImplementation = (stream) => {
        return new Promise((resolve, reject) => {
            if (stream.ytId) {
                YT.ready(() => {
                    resolve(YouTubeVideo);
                });
                return;
            }

            resolve(HTMLVideo);
        });
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
