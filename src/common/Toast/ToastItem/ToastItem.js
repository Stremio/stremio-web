const React = require('react');
const classnames = require('classnames');
const PropTypes = require('prop-types');
const Icon = require('stremio-icons/dom');
const styles = require('./styles');
const ToastItem = ({ type, title, text, icon, closeButton, onClick, onClose }) => {
    const isClickable = typeof onClick === 'function';
    const toastClicked = React.useCallback(() => {
        if (isClickable) {
            onClick();
        }
    }, [onClick]);
    return (
        <div className={classnames(styles['toast-item'], styles[type])}>
            {
                icon
                    ?
                    <div className={styles['icon-container']}>
                        <Icon className={styles['icon']} icon={icon} />
                    </div>
                    :
                    null
            }
            <div className={classnames(styles['message-container'], {[styles.clickable]: isClickable})} onClick={toastClicked}>
                {
                    title ?
                        <h1>{title}</h1>
                        :
                        null
                }
                {text}
            </div>

            {
                closeButton
                    ?
                    <div className={styles['close-button-container']}>
                        <button onClick={onClose}>
                            <Icon className={styles['icon']} icon={'ic_x'} />
                        </button>
                    </div>
                    :
                    null
            }
        </div>
    );
};

ToastItem.propTypes = {
    type: PropTypes.string,
    title: PropTypes.string,
    text: PropTypes.string,
    icon: PropTypes.string,
    closeButton: PropTypes.bool,
    onClick: PropTypes.func,
    onClose: PropTypes.func
};

module.exports = ToastItem;