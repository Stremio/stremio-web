// Copyright (C) 2017-2023 Smart code 203358507

const React = require('react');
const PropTypes = require('prop-types');
const classnames = require('classnames');
const { useRouteFocused, useModalsContainer } = require('stremio-router');
const Button = require('stremio/common/Button');
const { default: Icon } = require('@stremio/stremio-icons/react');
const { Modal } = require('stremio-router');
const styles = require('./styles');

const ModalDialog = ({ className, title, buttons, children, dataset, onCloseRequest, background, ...props }) => {
    const routeFocused = useRouteFocused();
    const modalsContainer = useModalsContainer();
    const modalContainerRef = React.useRef(null);
    const closeButtonOnClick = React.useCallback((event) => {
        if (typeof onCloseRequest === 'function') {
            onCloseRequest({
                type: 'close',
                dataset: dataset,
                reactEvent: event,
                nativeEvent: event.nativeEvent
            });
        }
    }, [dataset, onCloseRequest]);
    const onModalContainerMouseDown = React.useCallback((event) => {
        if (!event.nativeEvent.closeModalDialogPrevented && typeof onCloseRequest === 'function') {
            onCloseRequest({
                type: 'close',
                dataset: dataset,
                reactEvent: event,
                nativeEvent: event.nativeEvent
            });
        }
    }, [dataset, onCloseRequest]);
    const onModalDialogContainerMouseDown = React.useCallback((event) => {
        event.nativeEvent.closeModalDialogPrevented = true;
    }, []);
    React.useEffect(() => {
        const onKeyDown = (event) => {
            // its `-2` because focus lock render locking divs around its content
            if (event.code === 'Escape' && modalsContainer.childNodes[modalsContainer.childElementCount - 2] === modalContainerRef.current) {
                if (typeof onCloseRequest === 'function') {
                    onCloseRequest({
                        type: 'close',
                        dataset: dataset,
                        nativeEvent: event
                    });
                }
            }
        };
        if (routeFocused) {
            window.addEventListener('keydown', onKeyDown);
        }
        return () => {
            window.removeEventListener('keydown', onKeyDown);
        };
    }, [routeFocused, dataset, onCloseRequest]);
    return (
        <Modal ref={modalContainerRef} {...props} className={classnames(className, styles['modal-container'])} onMouseDown={onModalContainerMouseDown}>
            <div className={styles['modal-dialog-container']} onMouseDown={onModalDialogContainerMouseDown}>
                <div className={styles['modal-dialog-background']} style={{backgroundImage: `url('${background}')`}} />
                <Button className={styles['close-button-container']} title={'Close'} onClick={closeButtonOnClick}>
                    <Icon className={styles['icon']} name={'close'} />
                </Button>
                <div className={styles['modal-dialog-content']}>
                    {
                        typeof title === 'string' && title.length > 0 ?
                            <div className={styles['title-container']} title={title}>{title}</div>
                            :
                            null
                    }
                    <div className={styles['modal-dialog-content']}>
                        {children}
                    </div>
                    {
                        Array.isArray(buttons) && buttons.length > 0 ?
                            <div className={styles['buttons-container']}>
                                {buttons.map(({ className, label, icon, props }, index) => (
                                    <Button title={label} {...props} key={index} className={classnames(className, styles['action-button'])}>
                                        {
                                            typeof icon === 'string' && icon.length > 0 ?
                                                <Icon className={styles['icon']} name={icon} />
                                                :
                                                null
                                        }
                                        {
                                            typeof label === 'string' && label.length > 0 ?
                                                <div className={styles['label']}>{label}</div>
                                                :
                                                null
                                        }
                                    </Button>
                                ))}
                            </div>
                            :
                            null
                    }
                </div>
            </div>
        </Modal>
    );
};

ModalDialog.propTypes = {
    className: PropTypes.string,
    title: PropTypes.string,
    background: PropTypes.string,
    buttons: PropTypes.arrayOf(PropTypes.shape({
        className: PropTypes.string,
        label: PropTypes.string,
        icon: PropTypes.string,
        props: PropTypes.object
    })),
    children: PropTypes.oneOfType([
        PropTypes.arrayOf(PropTypes.node),
        PropTypes.node
    ]),
    dataset: PropTypes.object,
    onCloseRequest: PropTypes.func
};

module.exports = ModalDialog;
