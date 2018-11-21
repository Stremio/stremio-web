import React, { Component } from 'react';
import PropTypes from 'prop-types';
import HTMLVideo from './stremio-video/HTMLVideo';
import YouTubeVideo from './stremio-video/YouTubeVideo';
import styles from './styles';

class Video extends Component {
    constructor(props) {
        super(props);

        this.videoRef = React.createRef();
    }

    componentDidMount() {
        this.video = new Video.implementations[this.props.implementation](this.videoRef.current);
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
            console.error(Video.implementations[this.props.implementation].manifest.name, e);
        }
    }

    renderHTMLVideo() {
        return (
            <div className={this.props.className}>
                <video ref={this.videoRef} className={styles['html-video']} />
            </div>
        );
    }

    renderYouTubeVideo() {
        return (
            <div className={this.props.className}>
                <div ref={this.videoRef} />
            </div>
        );
    }

    render() {
        switch (this.props.implementation) {
            case 'HTML':
                return this.renderHTMLVideo();
            case 'YouTube':
                return this.renderYouTubeVideo();
        }
    }
}

Video.implementations = {
    'HTML': HTMLVideo,
    'YouTube': YouTubeVideo
};

Video.propTypes = {
    className: PropTypes.string,
    implementation: PropTypes.oneOf(Object.keys(Video.implementations)).isRequired,
    onEnded: PropTypes.func.isRequired,
    onError: PropTypes.func.isRequired,
    onPropValue: PropTypes.func.isRequired,
    onPropChanged: PropTypes.func.isRequired,
    observedProps: PropTypes.arrayOf(PropTypes.string).isRequired
};

export default Video;
