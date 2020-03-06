const React = require('react');
const PropTypes = require('prop-types');
const classnames = require('classnames');
const Icon = require('stremio-icons/dom');
const { Button, ModalDialog, SharePrompt, useBinaryState } = require('stremio/common');
const styles = require('./styles');

const ShareButton = ({ className, url }) => {
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
        <Button className={classnames(className, { 'disabled': typeof url !== 'string' })} tabIndex={-1} onClick={labelButtonOnClick}>
            <Icon className={'icon'} icon={'ic_share'} />
            {
                modalOpen ?
                    <ModalDialog title={'Share'} onCloseRequest={closeModal} onClick={modalDialogOnClick}>
                        <SharePrompt className={styles['share-prompt']} url={url} />
                    </ModalDialog>
                    :
                    null
            }
        </Button>
    );
};

ShareButton.propTypes = {
    className: PropTypes.string,
    url: PropTypes.string
};

module.exports = ShareButton;
