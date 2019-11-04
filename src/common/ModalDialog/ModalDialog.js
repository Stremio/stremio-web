const React = require('react');
const PropTypes = require('prop-types');
const classnames = require('classnames');
const Button = require('stremio/common/Button');
const Icon = require('stremio-icons/dom');
const { Modal } = require('stremio-router');
const styles = require('./styles');

const ModalDialog = ({ className, children, title, buttons, onClose }) => {
    // Close with the Escape key
    // TODO: Maybe we should consider a global actions mapping so the 'close' key can be globbaly changed
    React.useEffect(() => {
        const onKeyUp = (event) => {
            if (event.key === 'Escape' && typeof onClose === 'function') {
                onClose();
            }
        };
        window.addEventListener('keyup', onKeyUp);
        return () => {
            window.removeEventListener('keyup', onKeyUp);
        };
    }, [onClose]);
    const onModalContainerClick = React.useCallback(event => {
        if (event.target === event.currentTarget && typeof onClose === 'function') {
            onClose(event);
        }
    }, [onClose]);
    return (
        <Modal className={styles['modal-container']} onMouseDown={onModalContainerClick}>
            <div className={classnames(className, styles['modal-dialog-container'])}>
                <Button className={styles['close-button-container']} title={'Close'} onClick={onClose}>
                    <Icon className={styles['icon']} icon={'ic_x'} />
                </Button>
                <h1>{title}</h1>
                <div className={styles['modal-dialog-content']}>
                    {children}
                </div>
                <div className={styles['modal-dialog-buttons']}>
                    {
                        Array.isArray(buttons) && buttons.length > 0 ?
                            buttons.map((button, key) => (
                                <Button key={key} className={classnames(button.className, styles['action-button'])} {...button.props}>
                                    {
                                        typeof button.icon === 'string' && button.icon.length > 0 ?
                                            <Icon className={styles['icon']} icon={button.icon} />
                                            :
                                            null
                                    }
                                    {
                                        typeof button.label === 'string' && button.label.length > 0 ?
                                            button.label
                                            :
                                            null
                                    }
                                </Button>
                            ))
                            :
                            null
                    }
                </div>
            </div>
        </Modal>
    )
};

ModalDialog.propTypes = {
    className: PropTypes.string,
    title: PropTypes.string,
    buttons: PropTypes.arrayOf(PropTypes.shape({
        label: PropTypes.string,
        icon: PropTypes.string,
        className: PropTypes.string,
        props: PropTypes.object // Button.propTypes unfortunately these are not defined
    })),
    onClose: PropTypes.func
};

module.exports = ModalDialog;
