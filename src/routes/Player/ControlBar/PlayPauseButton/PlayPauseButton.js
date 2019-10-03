const React = require('react');
const PropTypes = require('prop-types');
const classnames = require('classnames');
const Icon = require('stremio-icons/dom');
const { Button } = require('stremio/common');

const PlayPauseButton = ({ className, paused, dispatch }) => {
    const togglePaused = React.useCallback(() => {
        if (typeof dispatch === 'function') {
            dispatch({ propName: 'paused', propValue: !paused });
        }
    }, [paused, dispatch]);
    return (
        <Button className={classnames(className, { 'disabled': paused === null })} onClick={togglePaused}>
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
    dispatch: PropTypes.func
};

module.exports = PlayPauseButton;
