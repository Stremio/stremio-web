const React = require('react');
const PropTypes = require('prop-types');
const classnames = require('classnames');
const { animatedPlaceholderStyles } = require('stremio/common');
require('./styles');

const BoardRowPlaceholder = ({ className }) => {
    return (
        <div className={classnames(className, 'board-row-placeholder-container')}>
            <div className={classnames('title-container', animatedPlaceholderStyles['animated-placeholder'])} />
            <div className={'meta-items-container'}>
                {Array(10).fill(null).map((_, index) => (
                    <div key={index} className={classnames('meta-item', animatedPlaceholderStyles['animated-placeholder'])}>
                        <div className={'meta-item-poster'} />
                    </div>
                ))}
            </div>
        </div>
    );
};

BoardRowPlaceholder.propTypes = {
    className: PropTypes.string
};

module.exports = BoardRowPlaceholder;
