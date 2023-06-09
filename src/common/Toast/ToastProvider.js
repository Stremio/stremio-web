// Copyright (C) 2017-2023 Smart code 203358507

const React = require('react');
const PropTypes = require('prop-types');
const ToastItem = require('./ToastItem');
const ToastContext = require('./ToastContext');

const DEFAULT_TIMEOUT = 3000;

const ToastProvider = ({ className, children }) => {
    const [container, setContainer] = React.useState(null);
    const [items, dispatch] = React.useReducer(
        (items, action) => {
            switch (action.type) {
                case 'add':
                    return items.concat(action.item);
                case 'remove':
                    return items.filter((item) => item.id !== action.id);
                case 'clear':
                    return [];
                default:
                    return items;
            }
        },
        []
    );
    const itemOnClose = React.useCallback((event) => {
        clearTimeout(event.dataset.id);
        dispatch({ type: 'remove', id: event.dataset.id });
    }, []);
    const toast = React.useMemo(() => {
        const filters = [];
        return {
            addFilter: (filter) => {
                filters.push(filter);
            },
            removeFilter: (filter) => {
                const index = filters.indexOf(filter);
                if (index > -1) {
                    filters.splice(index, 1);
                }
            },
            show: (item) => {
                if (filters.some((filter) => filter(item))) {
                    return;
                }

                const timeout = typeof item.timeout === 'number' && !isNaN(item.timeout) ?
                    item.timeout
                    :
                    DEFAULT_TIMEOUT;
                const id = setTimeout(() => {
                    dispatch({ type: 'remove', id });
                }, timeout);
                dispatch({
                    type: 'add',
                    item: {
                        ...item,
                        id,
                        dataset: {
                            ...item.dataset,
                            id
                        },
                        onClose: itemOnClose
                    }
                });
            },
            clear: () => {
                dispatch({ type: 'clear' });
            }
        };
    }, []);
    return (
        <ToastContext.Provider value={toast}>
            {container instanceof HTMLElement ? children : null}
            <div ref={setContainer} className={className}>
                {items.map((item, index) => (
                    <ToastItem key={index} {...item} />
                ))}
            </div>
        </ToastContext.Provider>
    );
};

ToastProvider.propTypes = {
    className: PropTypes.string,
    children: PropTypes.node
};

module.exports = ToastProvider;
