const React = require('react');
const useLiveRef = require('stremio/common/useLiveRef');
const { Modal } = require('stremio-router');
const ToastItem = require('./ToastItem');

const DEFAULT_TIMEOUT = 2000;

const Toast = React.forwardRef(({ className }, ref) => {
    const [toastItems, setToastItems] = React.useState([]);
    const toastItemsRef = useLiveRef(toastItems, [toastItems]);

    const hideAll = () => {
        toastItemsRef.current.forEach(item => clearTimeout(item.timerId));
        setToastItems([]);
    };

    const show = ({ type, icon, title, text, closeButton, timeout, onClick }) => {
        timeout = timeout !== null && !isNaN(timeout) ? timeout : DEFAULT_TIMEOUT;
        const close = () => {
            clearTimeout(nextItem.timerId);
            setToastItems(toastItemsRef.current.filter(state => state !== nextItem));
        };

        const nextItem = { type, icon, title, text, closeButton, timeout, onClick, onClose: close };

        if (timeout !== 0) {
            nextItem.timerId = setTimeout(close, timeout);
        }
        setToastItems(toastItemsRef.current.concat([nextItem]));
        return close;
    };

    React.useImperativeHandle(ref, () => ({ show, hideAll }));

    return toastItems.length === 0 ? null : (
        <Modal className={className}>
            {toastItems.map((item, index) => (<ToastItem {...item} key={index} />))}
        </Modal>
    );
});

module.exports = Toast;
