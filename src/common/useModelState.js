// Copyright (C) 2017-2022 Smart code 203358507

const React = require('react');
const throttle = require('lodash.throttle');
const isEqual = require('lodash.isequal');
const { useRouteFocused } = require('stremio-router');
const { useServices } = require('stremio/services');

const GetInitStateContext = React.createContext();

GetInitStateContext.displayName = 'GetInitStateContext';

function wrapPromise(promise) {
    let status = 'pending';
    let result;
    const suspender = promise.then(
        (resp) => {
            status = 'success';
            result = resp;
        },
        (error) => {
            status = 'error';
            result = error;
        }
    );
    return {
        read() {
            if (status === 'pending') {
                throw suspender;
            } else if (status === 'error') {
                throw result;
            } else if (status === 'success') {
                return result;
            }
        }
    };
}

const withGetInitState = (Component, Fallback = () => { }) => {
    return function WithGetInitState(props) {
        const { core } = useServices();
        const initStateRef = React.useRef({});
        const getInitState = React.useCallback((model) => {
            if (!initStateRef.current[model]) {
                initStateRef.current[model] = wrapPromise(core.transport.getState(model));
            }

            return initStateRef.current[model].read();
        }, []);
        return (
            <React.Suspense fallback={<Fallback {...props} />}>
                <GetInitStateContext.Provider value={getInitState}>
                    <Component {...props} />
                </GetInitStateContext.Provider>
            </React.Suspense>
        );
    };
};

const useModelState = ({ action, ...args }) => {
    const { core } = useServices();
    const routeFocused = useRouteFocused();
    const mountedRef = React.useRef(false);
    const [model, timeout, map] = React.useMemo(() => {
        return [args.model, args.timeout, args.map];
    }, []);
    const getInitState = React.useContext(GetInitStateContext);
    const [state, setState] = React.useReducer(
        (prevState, nextState) => {
            return Object.keys(prevState).reduce((result, key) => {
                result[key] = isEqual(prevState[key], nextState[key]) ? prevState[key] : nextState[key];
                return result;
            }, {});
        },
        undefined,
        () => {
            if (typeof map === 'function') {
                return map(getInitState(model));
            } else {
                return getInitState(model);
            }
        }
    );
    React.useInsertionEffect(() => {
        if (action) {
            core.transport.dispatch(action, model);
        }
    }, [action]);
    React.useInsertionEffect(() => {
        return () => {
            core.transport.dispatch({ action: 'Unload' }, model);
        };
    }, []);
    React.useInsertionEffect(() => {
        const onNewStateThrottled = throttle(async (models) => {
            if (models.indexOf(model) === -1) {
                return;
            }

            const state = await core.transport.getState(model);
            if (typeof map === 'function') {
                setState(map(state));
            } else {
                setState(state);
            }
        }, timeout);
        if (routeFocused) {
            core.transport.on('NewState', onNewStateThrottled);
            if (mountedRef.current) {
                onNewStateThrottled.call();
            }
        }
        return () => {
            onNewStateThrottled.cancel();
            core.transport.off('NewState', onNewStateThrottled);
        };
    }, [routeFocused]);
    React.useInsertionEffect(() => {
        mountedRef.current = true;
    }, []);
    return state;
};

module.exports = {
    withGetInitState,
    useModelState
};
