// Copyright (C) 2017-2023 Smart code 203358507

const React = require('react');
const throttle = require('lodash.throttle');
const { deepEqual } = require('fast-equals');
const intersection = require('lodash.intersection');
const { useCoreSuspender } = require('stremio/common/CoreSuspender');
const { useRouteFocused } = require('stremio-router');
const { useServices } = require('stremio/services');

const useModelState = ({ action, ...args }) => {
    const { core } = useServices();
    const routeFocused = useRouteFocused();
    const mountedRef = React.useRef(false);
    const model = args.model;
    const timeout = args.timeout;
    const map = args.map;
    const deps = args.deps;
    const skipUnload = args.skipUnload;
    const { getState } = useCoreSuspender();
    const [state, setState] = React.useReducer(
        (prevState, nextState) => {
            if (!prevState || !nextState) {
                return nextState;
            }
            return Object.keys(prevState).reduce((result, key) => {
                result[key] = deepEqual(prevState[key], nextState[key]) ? prevState[key] : nextState[key];
                return result;
            }, {});
        },
        undefined,
        () => {
            if (!model) {
                return null;
            }
            try {
                if (typeof map === 'function') {
                    return map(getState(model));
                } else {
                    return getState(model);
                }
            } catch (error) {
                if (error instanceof Promise) {
                    throw error;
                }
                console.error(`[useModelState] Error in model ${model}:`, error);
                return null;
            }
        }
    );
    React.useInsertionEffect(() => {
        if (action && model) {
            core.transport.dispatch(action, model);
        }
    }, [action, model]);
    React.useInsertionEffect(() => {
        return () => {
            if (model && !skipUnload) {
                core.transport.dispatch({ action: 'Unload' }, model);
            }
        };
    }, [model, skipUnload]);
    React.useInsertionEffect(() => {
        const onNewState = async (models) => {
            if (!model || (models.indexOf(model) === -1 && (!Array.isArray(deps) || intersection(deps, models).length === 0))) {
                return;
            }

            const state = await core.transport.getState(model);
            if (typeof map === 'function') {
                setState(map(state));
            } else {
                setState(state);
            }
        };
        const onNewStateThrottled = throttle(onNewState, timeout);
        if (routeFocused) {
            core.transport.on('NewState', onNewStateThrottled);
            if (mountedRef.current && model) {
                onNewState([model]);
            }
        }
        return () => {
            onNewStateThrottled.cancel();
            core.transport.off('NewState', onNewStateThrottled);
        };
    }, [routeFocused, model]);
    React.useInsertionEffect(() => {
        mountedRef.current = true;
    }, []);
    return state;
};

module.exports = useModelState;
