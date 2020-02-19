const React = require('react');
const PropTypes = require('prop-types');
const classnames = require('classnames');
const Icon = require('stremio-icons/dom');
const Button = require('stremio/common/Button');
const useFullscreen = require('stremio/common/useFullscreen');
const styles = require('./styles');

const FullscreenButton = ({ className }) => {
    const [fullscreen, requestFullscreen, exitFullscreen] = useFullscreen();
    return (
        <Button className={classnames(className, styles['fullscreen-button-container'])} title={fullscreen ? 'Exit Fullscreen' : 'Enter Fullscreen'} tabIndex={-1} onClick={fullscreen ? exitFullscreen : requestFullscreen}>
            <Icon className={styles['icon']} icon={fullscreen ? 'ic_exit_fullscreen' : 'ic_fullscreen'} />
        </Button>
    );
};

FullscreenButton.propTypes = {
    className: PropTypes.string
};

module.exports = FullscreenButton;
