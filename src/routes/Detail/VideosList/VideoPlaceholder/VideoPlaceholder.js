const React = require('react');
const PropTypes = require('prop-types');
const classnames = require('classnames');
const { animatedPlaceholderStyles } = require('stremio/common');
require('./styles');

const VideoPlaceholder = ({ className }) => {
    return (
        <div className={classnames(className, 'video-placeholder-container', animatedPlaceholderStyles['animated-placeholder'])}>
            <div className={'info-container'} />
        </div>
    );
};

VideoPlaceholder.propTypes = {
    className: PropTypes.string
};

module.exports = VideoPlaceholder;
