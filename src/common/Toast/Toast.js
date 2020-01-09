const React = require('react');
const classnames = require('classnames');
const { Modal } = require('stremio-router');
const ToastItem = require('./ToastItem');
const styles = require('./styles');

const DEFAULT_TIMEOUT = 2000;

const Toast = React.forwardRef(({ className }, ref) => {
    const [toastItems, dispatch] = React.useReducer(
        (state, action) => {
            switch (action.type) {
                case 'add':
                    return state.concat([action.item]);
                case 'remove':
                    return state.filter(item => item !== action.item);
                case 'removeAll':
                    state.forEach(item => clearTimeout(item.timerId));
                    return [];
                default:
                    return state;
            }
        }, []
    );

    const hideAll = React.useCallback(() => {
        dispatch({ type: 'removeAll' });
    }, []);

    const show = React.useCallback(({ type, icon, title, text, closeButton, timeout, onClick }) => {
        timeout = timeout !== null && !isNaN(timeout) ? timeout : DEFAULT_TIMEOUT;
        const close = () => {
            clearTimeout(newItem.timerId);
            dispatch({ type: 'remove', item: newItem });
        };

        const newItem = { type, icon, title, text, closeButton, timeout, onClick, onClose: close };

        if (timeout !== 0) {
            newItem.timerId = setTimeout(close, timeout);
        }
        dispatch({ type: 'add', item: newItem });
        return close;
    }, []);

    React.useImperativeHandle(ref, () => ({ show, hideAll }));
    return toastItems.length === 0 ? null : (
        <Modal className={classnames(className, styles['toast-container'])} disabled={true}>
            {toastItems.map((item, index) => (<ToastItem {...item} key={index} />))}
        </Modal>
    );
});

module.exports = Toast;
