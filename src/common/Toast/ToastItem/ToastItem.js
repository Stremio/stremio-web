// Copyright (C) 2017-2020 Smart code 203358507

const React = require('react');
const PropTypes = require('prop-types');
const classnames = require('classnames');
const Icon = require('stremio-icons/dom');
const Button = require('stremio/common/Button');
const styles = require('./styles');

const ToastItem = ({ title, message, dataset, onSelect, onClose, ...props }) => {
    const type = React.useMemo(() => {
        return ['success', 'alert', 'error'].includes(props.type) ?
            props.type
            :
            'success';
    }, [props.type]);
    const icon = React.useMemo(() => {
        return typeof props.icon === 'string' ? props.icon :
            type === 'success' ? 'ic_check' :
                type === 'error' ? 'ic_warning' :
                    null;
    }, [type, props.icon]);
    const toastOnClick = React.useCallback((event) => {
        if (!event.nativeEvent.selectToastPrevented && typeof onSelect === 'function') {
            onSelect({
                type: 'select',
                dataset: dataset,
                reactEvent: event,
                nativeEvent: event.nativeEvent
            });
        }
        if (!event.nativeEvent.closeToastPrevented && typeof onClose === 'function') {
            onClose({
                type: 'close',
                dataset: dataset,
                reactEvent: event,
                nativeEvent: event.nativeEvent
            });
        }
    }, [dataset, onSelect, onClose]);
    const closeButtonOnClick = React.useCallback((event) => {
        event.nativeEvent.selectToastPrevented = true;
        if (typeof onClose === 'function') {
            onClose({
                type: 'close',
                dataset: dataset,
                reactEvent: event,
                nativeEvent: event.nativeEvent
            });
        }
    }, [dataset, onClose]);
    return (
        <Button className={classnames(styles['toast-item-container'], styles[type])} tabIndex={-1} onClick={toastOnClick}>
            {
                typeof icon === 'string' && icon.length > 0 ?
                    <div className={styles['icon-container']}>
                        <Icon className={styles['icon']} icon={icon} />
                    </div>
                    :
                    null
            }
            <div className={styles['info-container']}>
                {
                    typeof title === 'string' && title.length > 0 ?
                        <div className={styles['title-container']}>{title}</div>
                        :
                        null
                }
                {
                    typeof message === 'string' && message.length > 0 ?
                        <div className={styles['message-container']}>{message}</div>
                        :
                        null
                }
            </div>
            <Button className={styles['close-button-container']} title={'Close'} tabIndex={-1} onClick={closeButtonOnClick}>
                <Icon className={styles['icon']} icon={'ic_x'} />
            </Button>
        </Button>
    );
};

ToastItem.propTypes = {
    type: PropTypes.oneOf(['success', 'alert', 'error']),
    title: PropTypes.string,
    message: PropTypes.string,
    icon: PropTypes.string,
    dataset: PropTypes.object,
    onSelect: PropTypes.func,
    onClose: PropTypes.func
};

module.exports = ToastItem;
