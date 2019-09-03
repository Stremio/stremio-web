const React = require('react');
const PropTypes = require('prop-types');
const classnames = require('classnames');
const { animatedPlaceholderStyles } = require('stremio/common');
require('./styles');

const SeasonsBarPlaceholder = ({ className }) => {
    return (
        <div className={classnames(className, 'seasons-bar-placeholder-container', animatedPlaceholderStyles['animated-placeholder'])}>
            <div className={'prev-season-button'} />
            <div className={'seasons-popup-label-container'} />
            <div className={'next-season-button'} />
        </div>
    );
};

SeasonsBarPlaceholder.propTypes = {
    className: PropTypes.string
};

module.exports = SeasonsBarPlaceholder;
