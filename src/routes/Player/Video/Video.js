// Copyright (C) 2017-2023 Smart code 203358507

const React = require('react');
const PropTypes = require('prop-types');
const classnames = require('classnames');
const styles = require('./styles');
const {platform} = require('stremio/common');
const MobileControlOverlay = require('./MobileControlOverlay');

const isMobile = platform.isMobile();

const Video = React.forwardRef(({
    className, paused, overlayHidden, setOverlayHidden, onPlayPause, toggleFullscreen, fullScreenActive,
    onSkip10Seconds, onGoBack10Seconds
}, ref) => {
    if (isMobile) {
        return (
            <div className={classnames(className, styles['video-container'])}>
                <MobileControlOverlay
                    paused={paused}
                    visible={!overlayHidden}
                    setHidden={setOverlayHidden}
                    onPlayPause={onPlayPause}
                    onSlideUp={
                        fullScreenActive
                            ? doNothing
                            : toggleFullscreen
                    }
                    onSlideDown={
                        fullScreenActive
                            ? toggleFullscreen
                            : doNothing
                    }
                    fullScreenActive={fullScreenActive}
                    onSkip10Seconds={onSkip10Seconds}
                    onGoBack10Seconds={onGoBack10Seconds}
                />
                <div ref={ref} className={styles['video']} />
            </div>
        );
    }

    return (
        <div className={classnames(className, styles['video-container'])} onClick={onPlayPause} onDoubleClick={toggleFullscreen}>
            <div ref={ref} className={styles['video']} />
        </div>
    );
});

Video.displayName = 'Video';

Video.propTypes = {
    className: PropTypes.string,
    paused: PropTypes.bool,
    overlayHidden: PropTypes.bool,
    setOverlayHidden: PropTypes.func,
    onPlayPause: PropTypes.func,
    toggleFullscreen: PropTypes.func,
    fullScreenActive: PropTypes.bool,
    onSkip10Seconds: PropTypes.func,
    onGoBack10Seconds: PropTypes.func,
};

module.exports = Video;

function doNothing() {
    // do nothing
}
