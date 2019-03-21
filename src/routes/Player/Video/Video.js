const React = require('react');
const PropTypes = require('prop-types');
const hat = require('hat');
const HTMLVideo = require('./stremio-video/HTMLVideo');
const YouTubeVideo = require('./stremio-video/YouTubeVideo');
const MPVVideo = require('./stremio-video/MPVVideo');

class Video extends React.Component {
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
                this.props.onImplementationChanged(this.video.constructor.manifest);
            }
        }

        if (this.video !== null) {
            try {
                this.video.dispatch(...args);
            } catch (e) {
                console.error(this.video.constructor.manifest.name, e);
            }
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
    onPropChanged: PropTypes.func.isRequired,
    onImplementationChanged: PropTypes.func.isRequired
};

module.exports = Video;
