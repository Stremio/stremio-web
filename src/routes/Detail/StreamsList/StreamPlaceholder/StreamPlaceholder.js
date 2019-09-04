const React = require('react');
const PropTypes = require('prop-types');
const classnames = require('classnames');
const Icon = require('stremio-icons/dom');
require('./styles');

const StreamPlaceholder = ({ className }) => {
    return (
        <div className={classnames(className, 'stream-placeholder-container')}>
            <div className={'addon-container'}>
                <div className={'addon-name'} />
            </div>
            <div className={'info-container'}>
                <div className={'description-container'} />
                <div className={'description-container'} />
            </div>
            <div className={'play-icon-container'}>
                <Icon className={'play-icon'} icon={'ic_play'} />
            </div>
        </div>
    );
};

StreamPlaceholder.propTypes = {
    className: PropTypes.string
};

module.exports = StreamPlaceholder;
