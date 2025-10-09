// Copyright (C) 2017-2023 Smart code 203358507

const React = require('react');
const PropTypes = require('prop-types');
const classnames = require('classnames');
const { isFirefox } = require('stremio/common');
const styles = require('./styles');
require('./firefoxVideoOptimizations.less');

const Video = React.forwardRef(({ className, onClick, onDoubleClick }, ref) => {
    const firefoxClass = isFirefox() ? 'firefox-optimized' : '';
    return (
        <div className={classnames(className, styles['video-container'], firefoxClass)} onClick={onClick} onDoubleClick={onDoubleClick}>
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
