const React = require('react');
const PropTypes = require('prop-types');
const classnames = require('classnames');
const Icon = require('stremio-icons/dom');
const { Button } = require('stremio/common');
require('./styles');

const Stream = ({ className, id, addon, description, progress, onClick }) => {
    return (
        <Button className={classnames(className, 'stream-container')} title={typeof description === 'string' && description.length > 0 ? description : id} data-id={id} onClick={onClick}>
            <div className={'addon-container'}>
                <div className={'addon-name'}>{addon}</div>
            </div>
            <div className={'info-container'}>
                <div className={'description-label'}>
                    {typeof description === 'string' && description.length > 0 ? description : id}
                </div>
            </div>
            <div className={'play-icon-container'}>
                <Icon className={'play-icon'} icon={'ic_play'} />
            </div>
            {
                progress !== null && !isNaN(progress) && progress > 0 ?
                    <div className={'progress-bar-container'}>
                        <div className={'progress-bar'} style={{ width: `${Math.min(progress, 1) * 100}%` }} />
                    </div>
                    :
                    null
            }
        </Button>
    );
}

Stream.propTypes = {
    className: PropTypes.string,
    id: PropTypes.string.isRequired,
    addon: PropTypes.string.isRequired,
    description: PropTypes.string,
    progress: PropTypes.number,
    onClick: PropTypes.func
};

module.exports = Stream;
