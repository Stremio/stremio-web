import React, { Component } from 'react';
import PropTypes from 'prop-types';
import HTMLVideo from './stremio-video/HTMLVideo';
import YouTubeVideo from './stremio-video/YouTubeVideo';
import styles from './styles';

class Video extends Component {
    constructor(props) {
        super(props);

        this.videoRef = React.createRef();

        this.state = {
            implementation: null
        };
    }

    shouldComponentUpdate(nextProps, nextState) {
        return nextProps.className !== this.props.className ||
            nextState.implementation !== this.state.implementation;
    }

    componentDidMount() {
        this.prepareStream()
            .then(({ source, implementation }) => {
                this.setState({ implementation }, () => {
                    this.video = new this.state.implementation(this.videoRef.current);
                    this.video.on('ended', this.props.onEnded);
                    this.video.on('error', this.props.onError);
                    this.video.on('propValue', this.props.onPropValue);
                    this.video.on('propChanged', this.props.onPropChanged);
                    this.state.implementation.manifest.props.forEach((propName) => {
                        this.dispatch('observeProp', propName);
                    });
                    this.dispatch('command', 'load', { source });
                });
            })
            .catch((error) => {
                this.props.onError(error);
            });
    }

    componentWillUnmount() {
        this.dispatch('stop');
    }

    prepareStream = () => {
        return new Promise((resolve, reject) => {
            // YT.ready(() => {
            //     resolve({
            //         source: 'J2z5uzqxJNU',
            //         implementation: YouTubeVideo
            //     });
            // });
            resolve({
                source: 'http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
                implementation: HTMLVideo
            });
        });
    }

    dispatch = (...args) => {
        try {
            this.state.implementation && this.video && this.video.dispatch(...args);
        } catch (e) {
            console.error(this.state.implementation.manifest.name, e);
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
        switch (this.state.implementation) {
            case HTMLVideo:
                return this.renderHTMLVideo();
            case YouTubeVideo:
                return this.renderYouTubeVideo();
            default:
                return null;
        }
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
