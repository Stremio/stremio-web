const React = require('react');
const PropTypes = require('prop-types');
const classnames = require('classnames');
const Button = require('stremio/common/Button');
const Icon = require('stremio-icons/dom');
const { Modal } = require('stremio-router');
const styles = require('./styles');

const ModalDialog = ({ className, children, title, buttons, onCloseRequest }) => {
    React.useEffect(() => {
        const onKeyDown = (event) => {
            if (event.key === 'Escape') {
                onCloseRequest({
                    type: 'close',
                    nativeEvent: event
                });
            }
        };
        window.addEventListener('keydown', onKeyDown);
        return () => {
            window.removeEventListener('keydown', onKeyDown);
        };
    }, [onCloseRequest]);
    const closeButtonOnClick = React.useCallback((event) => {
        onCloseRequest({
            type: 'close',
            reactEvent: event,
            nativeEvent: event.nativeEvent
        });
    }, [onCloseRequest]);
    const onModalContainerMouseDown = React.useCallback((event) => {
        if (event.target === event.currentTarget) {
            onCloseRequest({
                type: 'close',
                reactEvent: event,
                nativeEvent: event.nativeEvent
            });
        }
    }, [onCloseRequest]);
    return (
        <Modal className={styles['modal-container']} onMouseDown={onModalContainerMouseDown}>
            <div className={classnames(className, styles['modal-dialog-container'])}>
                <Button className={styles['close-button-container']} title={'Close'} onClick={closeButtonOnClick}>
                    <Icon className={styles['icon']} icon={'ic_x'} />
                </Button>
                {
                    typeof title === 'string' && title.length > 0 ?
                        <h1>{title}</h1>
                        :
                        null
                }
                <div className={styles['modal-dialog-content']}>
                    {children}
                </div>
                {
                    Array.isArray(buttons) && buttons.length > 0 ?
                        <div className={styles['modal-dialog-buttons']}>
                            {
                                buttons.map((button, key) => (
                                    <Button className={classnames(button.className, styles['action-button'])} {...button.props} key={key}>
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
                            }
                        </div>
                        :
                        null
                }
            </div>
        </Modal>
    );
};

ModalDialog.propTypes = {
    className: PropTypes.string,
    title: PropTypes.string,
    buttons: PropTypes.arrayOf(PropTypes.shape({
        label: PropTypes.string,
        icon: PropTypes.string,
        className: PropTypes.string,
        props: PropTypes.object
    })),
    onCloseRequest: PropTypes.func
};

module.exports = ModalDialog;
