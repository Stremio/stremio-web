const React = require('react');
const PropTypes = require('prop-types');
const classnames = require('classnames');
const Icon = require('stremio-icons/dom');
require('./styles');

const SeasonsBarPlaceholder = ({ className }) => {
    return (
        <div className={classnames(className, 'seasons-bar-placeholder-container')}>
            <div className={'prev-season-button'}>
                <Icon className={'icon'} icon={'ic_arrow_left'} />
            </div>
            <div className={'seasons-popup-label-container'}>
                <div className={'seasons-popup-label'} />
            </div>
            <div className={'next-season-button'}>
                <Icon className={'icon'} icon={'ic_arrow_right'} />
            </div>
        </div>
    );
};

SeasonsBarPlaceholder.propTypes = {
    className: PropTypes.string
};

module.exports = SeasonsBarPlaceholder;
