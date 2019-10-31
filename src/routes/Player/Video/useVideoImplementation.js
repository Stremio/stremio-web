const { HTMLVideo, YouTubeVideo, MPVVideo } = require('stremio-video');

const useVideoImplementation = (shell, stream) => {
    if (shell) {
        return MPVVideo;
    }

    if (stream) {
        if (stream.ytId) {
            return YouTubeVideo;
        } else {
            return HTMLVideo;
        }
    }

    return null;
};

module.exports = useVideoImplementation;
