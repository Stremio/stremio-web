// Copyright (C) 2017-2023 Smart code 203358507

const React = require('react');
const PropTypes = require('prop-types');
const classnames = require('classnames');
const styles = require('./styles');
const Video = React.forwardRef(({ brightness, className, onClick, onDoubleClick }, ref) => {
    const brightnessStyle = typeof brightness === 'number' && !isNaN(brightness) ?
        { '--video-brightness': `${Math.max(0, brightness) / 100}` }
        :
        undefined;
    return (
        <div className={classnames(className, styles['video-container'])} onClick={onClick} onDoubleClick={onDoubleClick}>
            <div ref={ref} className={styles['video']} style={brightnessStyle} />
        </div>
    );
});

Video.displayName = 'Video';

Video.propTypes = {
    brightness: PropTypes.number,
    className: PropTypes.string,
    onClick: PropTypes.func,
    onDoubleClick: PropTypes.func,
};

module.exports = Video;
