const React = require('react');
const PropTypes = require('prop-types');
const classnames = require('classnames');
require('./styles');

const BoardRowPlaceholder = ({ className }) => {
    return (
        <div className={classnames(className, 'board-row-placeholder-container')}>
            <div className={'title-container'}>
                <div className={'title-label-container'} />
            </div>
            <div className={'meta-items-container'}>
                <div className={'meta-item'}>
                    <div className={'poster-container'} />
                </div>
                <div className={'meta-item'}>
                    <div className={'poster-container'} />
                </div>
                <div className={'meta-item'}>
                    <div className={'poster-container'} />
                </div>
                <div className={'meta-item'}>
                    <div className={'poster-container'} />
                </div>
                <div className={'meta-item'}>
                    <div className={'poster-container'} />
                </div>
                <div className={'meta-item'}>
                    <div className={'poster-container'} />
                </div>
                <div className={'meta-item'}>
                    <div className={'poster-container'} />
                </div>
                <div className={'meta-item'}>
                    <div className={'poster-container'} />
                </div>
                <div className={'meta-item'}>
                    <div className={'poster-container'} />
                </div>
                <div className={'meta-item'}>
                    <div className={'poster-container'} />
                </div>
            </div>
        </div>
    );
};

BoardRowPlaceholder.propTypes = {
    className: PropTypes.string
};

module.exports = BoardRowPlaceholder;
