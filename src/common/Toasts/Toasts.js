const React = require('react');
const { Modal } = require('stremio-router');
const { ModalsContainerContext } = require('stremio-router');
const { useToastsContainer } = require('./ToastsContainerContext');
const Toast = require('./Toast');

const DEFAULT_TIMEOUT = 2000;

const Toasts = React.forwardRef(({ className }, ref) => {
    const toastsContainer = useToastsContainer();
    const [toasts, dispatch] = React.useReducer(
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

    return toasts.length === 0 ? null : (
        <ModalsContainerContext.Provider value={toastsContainer}>
            <Modal className={className} disabled={true}>
                {toasts.map((toast, index) => (<Toast {...toast} key={index} />))}
            </Modal>
        </ModalsContainerContext.Provider>
    );
});

module.exports = Toasts;
