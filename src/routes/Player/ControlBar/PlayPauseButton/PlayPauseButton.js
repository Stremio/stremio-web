const React = require('react');
const PropTypes = require('prop-types');
const classnames = require('classnames');
const Icon = require('stremio-icons/dom');
const { Button } = require('stremio/common');

const PlayPauseButton = ({ className, paused, onPlayRequested, onPauseRequested }) => {
    const togglePaused = React.useCallback(() => {
        if (paused) {
            if (typeof onPlayRequested === 'function') {
                onPlayRequested();
            }
        } else {
            if (typeof onPauseRequested === 'function') {
                onPauseRequested();
            }
        }
    }, [paused, onPlayRequested, onPauseRequested]);
    return (
        <Button className={classnames(className, { 'disabled': typeof paused !== 'boolean' })} title={paused ? 'Play' : 'Pause'} tabIndex={-1} onClick={togglePaused}>
            <Icon
                className={'icon'}
                icon={typeof paused !== 'boolean' || paused ? 'ic_play' : 'ic_pause'}
            />
        </Button>
    );
};

PlayPauseButton.propTypes = {
    className: PropTypes.string,
    paused: PropTypes.bool,
    onPlayRequested: PropTypes.func,
    onPauseRequested: PropTypes.func
};

module.exports = PlayPauseButton;
