const React = require('react');
const PropTypes = require('prop-types');
const classnames = require('classnames');
const Icon = require('stremio-icons/dom');
const { Button, Popup, useBinaryState } = require('stremio/common');
const styles = require('./styles');

const ShareButton = ({ className, modalContainerClassName }) => {
    const [modalOpen, openModal, closeModal, toggleModal] = useBinaryState(false);
    return (
        <Popup
            open={modalOpen}
            menuModalClassName={classnames(modalContainerClassName, styles['share-modal-container'])}
            menuRelativePosition={false}
            renderLabel={(ref) => (
                <Button ref={ref} className={classnames(className, { 'active': modalOpen })} tabIndex={-1} onClick={toggleModal}>
                    <Icon className={'icon'} icon={'ic_share'} />
                </Button>
            )}
            renderMenu={() => (
                <div className={styles['share-dialog-container']} />
            )}
            onCloseRequest={closeModal}
        />
    );
};

ShareButton.propTypes = {
    className: PropTypes.string,
    modalContainerClassName: PropTypes.string
};

module.exports = ShareButton;
