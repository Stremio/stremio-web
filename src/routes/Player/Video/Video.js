// Copyright (C) 2017-2023 Smart code 203358507

const React = require('react');
const PropTypes = require('prop-types');
const classnames = require('classnames');
const styles = require('./styles');

const Video = React.forwardRef(({ className, onClick, onDoubleClick, onMouseUp, onMouseDown, onMouseLeave }, ref) => {
    return (
        <div className={classnames(className, styles['video-container'])} onClick={onClick} onDoubleClick={onDoubleClick} onMouseUp={onMouseUp} onMouseDown={onMouseDown} onMouseLeave={onMouseLeave}>
            <div ref={ref} className={styles['video']} />
        </div>
    );
});

Video.displayName = 'Video';

Video.propTypes = {
    className: PropTypes.string,
    onClick: PropTypes.func,
    onDoubleClick: PropTypes.func,
};

module.exports = Video;
