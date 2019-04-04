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
        this.dispatch({ commandName: 'destroy' });
    }

    selectVideoImplementation = (args) => {
        if (args.ipc) {
            return MPVVideo;
        } else if (args.ytId) {
            return YouTubeVideo;
        } else {
            return HTMLVideo;
        }
    }

    dispatch = (args = {}) => {
        if (args.commandName === 'load') {
            const { commandArgs = {} } = args;
            const Video = this.selectVideoImplementation(commandArgs);
            if (this.video === null || this.video.constructor !== Video) {
                this.dispatch({ commandName: 'destroy' });
                this.video = new Video({
                    id: this.id,
                    containerElement: this.containerRef.current,
                    ipc: commandArgs.ipc
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
                this.video.dispatch(args);
            } catch (e) {
                console.error(this.video.constructor.manifest.name, e);
            }
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
    onEnded: PropTypes.func.isRequired,
    onError: PropTypes.func.isRequired,
    onPropValue: PropTypes.func.isRequired,
    onPropChanged: PropTypes.func.isRequired,
    onImplementationChanged: PropTypes.func.isRequired
};

module.exports = Video;
