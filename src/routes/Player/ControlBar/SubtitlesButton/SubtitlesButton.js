const React = require('react');
const PropTypes = require('prop-types');
const classnames = require('classnames');
const Icon = require('stremio-icons/dom');
const { Button, Popup, useBinaryState } = require('stremio/common');
const SubtitlesPicker = require('./SubtitlesPicker');
const styles = require('./styles');

const SubtitlesButton = (props) => {
    const [popupOpen, openPopup, closePopup, togglePopup] = useBinaryState(false);
    return (
        <Popup
            open={popupOpen}
            menuModalClassName={classnames(props.modalContainerClassName, styles['subtitles-modal-container'])}
            menuRelativePosition={false}
            renderLabel={(ref) => (
                <Button ref={ref} className={classnames(props.className, { 'active': popupOpen }, { 'disabled': !Array.isArray(props.subtitlesTracks) || props.subtitlesTracks.length === 0 })} tabIndex={-1} onClick={togglePopup}>
                    <Icon className={'icon'} icon={'ic_sub'} />
                </Button>
            )}
            renderMenu={() => (
                <SubtitlesPicker
                    {...props}
                    className={styles['subtitles-picker-container']}
                />
            )}
            onCloseRequest={closePopup}
        />
    );
};

SubtitlesButton.propTypes = {
    className: PropTypes.string,
    modalContainerClassName: PropTypes.string,
    subtitlesTracks: PropTypes.arrayOf(PropTypes.shape({
        id: PropTypes.string.isRequired,
        label: PropTypes.string.isRequired,
        origin: PropTypes.string.isRequired
    })),
    selectedSubtitlesTrackId: PropTypes.string,
    subtitlesSize: PropTypes.number,
    subtitlesDelay: PropTypes.number,
    subtitlesTextColor: PropTypes.string,
    subtitlesBackgroundColor: PropTypes.string,
    subtitlesOutlineColor: PropTypes.string,
    dispatch: PropTypes.func.isRequired
};

module.exports = SubtitlesButton;
