const React = require('react');
const PropTypes = require('prop-types');
const classnames = require('classnames');
const { animatedPlaceholderStyles } = require('stremio/common');
require('./styles');

const StreamPlaceholder = ({ className }) => {
    return (
        <div className={classnames(className, 'stream-placeholder-container', animatedPlaceholderStyles['animated-placeholder'])}>
            <div className={'addon-container'} />
            <div className={'info-container'} />
            <div className={'play-icon-container'} />
        </div>
    );
};

StreamPlaceholder.propTypes = {
    className: PropTypes.string
};

module.exports = StreamPlaceholder;
