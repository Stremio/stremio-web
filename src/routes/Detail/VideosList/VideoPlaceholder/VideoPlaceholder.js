const React = require('react');
const PropTypes = require('prop-types');
const classnames = require('classnames');
const Icon = require('stremio-icons/dom');
require('./styles');

const VideoPlaceholder = ({ className }) => {
    return (
        <div className={classnames(className, 'video-placeholder-container')}>
            <div className={'info-container'}>
                <div className={'name-container'} />
                <div className={'released-container'} />
            </div>
            <div className={'next-icon-container'}>
                <Icon className={'next-icon'} icon={'ic_arrow_thin_right'} />
            </div>
        </div>
    );
};

VideoPlaceholder.propTypes = {
    className: PropTypes.string
};

module.exports = VideoPlaceholder;
