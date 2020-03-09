const React = require('react');
const PropTypes = require('prop-types');
const classnames = require('classnames');
const Icon = require('stremio-icons/dom');
const { Button, ModalDialog, useBinaryState } = require('stremio/common');
const SubtitlesPicker = require('./SubtitlesPicker');
const styles = require('./styles');

const SubtitlesButton = ({ className, modalContainerClassName, ...props }) => {
    const [modalOpen, openModal, closeModal] = useBinaryState(false);
    const labelButtonOnClick = React.useCallback((event) => {
        if (!event.nativeEvent.openModalPrevented) {
            openModal();
        }
    }, []);
    const modalDialogOnClick = React.useCallback((event) => {
        event.nativeEvent.openModalPrevented = true;
    }, []);
    return (
        <Button className={classnames(className, { 'disabled': !Array.isArray(props.subtitlesTracks) || props.subtitlesTracks.length === 0 })} tabIndex={-1} onClick={labelButtonOnClick}>
            <Icon className={'icon'} icon={'ic_sub'} />
            {
                modalOpen ?
                    <ModalDialog className={classnames(styles['subtitles-modal-dialog-container'], modalContainerClassName)} onCloseRequest={closeModal} onClick={modalDialogOnClick}>
                        <SubtitlesPicker
                            {...props}
                            className={styles['subtitles-picker-container']}
                        />
                    </ModalDialog>
                    :
                    null
            }
        </Button>
    );
};

SubtitlesButton.propTypes = {
    className: PropTypes.string,
    modalContainerClassName: PropTypes.string,
    subtitlesTracks: PropTypes.any,
    selectedSubtitlesTrackId: PropTypes.any,
    subtitlesSize: PropTypes.any,
    subtitlesDelay: PropTypes.any,
    subtitlesTextColor: PropTypes.any,
    subtitlesBackgroundColor: PropTypes.any,
    subtitlesOutlineColor: PropTypes.any,
    dispatch: PropTypes.any
};

module.exports = SubtitlesButton;
