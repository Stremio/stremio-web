const React = require('react');
const PropTypes = require('prop-types');
const classnames = require('classnames');
const Button = require('stremio/common/Button');
const Icon = require('stremio-icons/dom');
const { Modal } = require('stremio-router');
const styles = require('./styles');

const ModalDialog = ({ className, title, buttons, children, dataset, onCloseRequest, ...props }) => {
    const onModalDialogContainerMouseDown = React.useCallback((event) => {
        event.nativeEvent.closeModalDialogPrevented = true;
    }, []);
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
    React.useEffect(() => {
        const onCloseEvent = (event) => {
            if (!event.closeModalDialogPrevented && typeof onCloseRequest === 'function') {
                const closeEvent = {
                    type: 'close',
                    dataset: dataset,
                    nativeEvent: event
                };
                switch (event.type) {
                    case 'resize':
                        onCloseRequest(closeEvent);
                        break;
                    case 'keydown':
                        if (event.key === 'Escape') {
                            onCloseRequest(closeEvent);
                        }
                        break;
                    case 'mousedown':
                        if (event.target !== document.documentElement) {
                            onCloseRequest(closeEvent);
                        }
                        break;
                }
            }
        };
        window.addEventListener('resize', onCloseEvent);
        window.addEventListener('keydown', onCloseEvent);
        window.addEventListener('mousedown', onCloseEvent);
        return () => {
            window.removeEventListener('resize', onCloseEvent);
            window.removeEventListener('keydown', onCloseEvent);
            window.removeEventListener('mousedown', onCloseEvent);
        };
    }, [dataset, onCloseRequest]);
    return (
        <Modal {...props} className={classnames(className, styles['modal-container'])}>
            <div className={styles['modal-dialog-container']} onMouseDown={onModalDialogContainerMouseDown}>
                <div className={styles['header-container']}>
                    {
                        typeof title === 'string' && title.length > 0 ?
                            <div className={styles['title-container']} title={title}>{title}</div>
                            :
                            null
                    }
                    <Button className={styles['close-button-container']} title={'Close'} onClick={closeButtonOnClick}>
                        <Icon className={styles['icon']} icon={'ic_x'} />
                    </Button>
                </div>
                <div className={styles['modal-dialog-content']}>
                    {children}
                    {
                        Array.isArray(buttons) && buttons.length > 0 ?
                            <div className={styles['buttons-container']}>
                                {buttons.map(({ className, label, icon, props }, index) => (
                                    <Button title={label} {...props} key={index} className={classnames(className, styles['action-button'])}>
                                        {
                                            typeof icon === 'string' && icon.length > 0 ?
                                                <Icon className={styles['icon']} icon={icon} />
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
    dataset: PropTypes.objectOf(String),
    onCloseRequest: PropTypes.func
};

module.exports = ModalDialog;
