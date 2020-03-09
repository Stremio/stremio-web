const React = require('react');
const PropTypes = require('prop-types');
const classnames = require('classnames');
const Icon = require('stremio-icons/dom');
const { Button } = require('stremio/common');

const SubtitlesButton = ({ className, subtitlesTracks, onToggleSubtitlesPicker }) => {
    const onClick = React.useCallback(() => {
        if (typeof onToggleSubtitlesPicker === 'function') {
            onToggleSubtitlesPicker();
        }
    }, [onToggleSubtitlesPicker]);
    return (
        <Button className={classnames(className, { 'disabled': !Array.isArray(subtitlesTracks) || subtitlesTracks.length === 0 })} tabIndex={-1} onClick={onClick}>
            <Icon className={'icon'} icon={'ic_sub'} />
        </Button>
    );
};

SubtitlesButton.propTypes = {
    className: PropTypes.string,
    subtitlesTracks: PropTypes.array,
    onToggleSubtitlesPicker: PropTypes.func
};

module.exports = SubtitlesButton;
