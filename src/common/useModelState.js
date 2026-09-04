// Copyright (C) 2017-2023 Smart code 203358507

const React = require('react');
const throttle = require('lodash.throttle');
const { deepEqual } = require('fast-equals');
const intersection = require('lodash.intersection');
const { useCore } = require('stremio/core');
const { useCoreSuspender } = require('stremio/common/CoreSuspender');
const { useRouteActive } = require('stremio/common/useRouteFocused');

const useModelState = ({ action, ...args }) => {
    const core = useCore();
    const routeActive = useRouteActive();
    const [model, timeout, map, deps] = React.useMemo(() => {
        return [args.model, args.timeout, args.map, args.deps];
    }, []);
    const { getState } = useCoreSuspender();
    const [state, setState] = React.useReducer(
        (prevState, nextState) => {
            const keys = Object.keys(nextState);
            let changed = keys.length !== Object.keys(prevState).length;
            const state = keys.reduce((result, key) => {
                const equal = Object.prototype.hasOwnProperty.call(prevState, key) && deepEqual(prevState[key], nextState[key]);
                changed = changed || !equal;
                result[key] = equal ? prevState[key] : nextState[key];
                return result;
            }, {});
            return changed ? state : prevState;
        },
        undefined,
        () => {
            const state = getState(model);
            return typeof map === 'function' ? map(state) : state;
        }
    );
    React.useEffect(() => {
        if (action) {
            core.transport.dispatch(action, model);
        }
    }, [action]);
    React.useEffect(() => {
        return () => {
            core.transport.dispatch({ action: 'Unload' }, model);
        };
    }, []);
    React.useEffect(() => {
        let active = true;
        let request = 0;
        let appliedRequest = 0;
        const onNewState = async (models) => {
            if (models.indexOf(model) === -1 && (!Array.isArray(deps) || intersection(deps, models).length === 0)) {
                return;
            }

            const currentRequest = ++request;
            const state = await core.transport.getState(model);
            if (!active || currentRequest < appliedRequest) {
                return;
            }
            appliedRequest = currentRequest;
            if (typeof map === 'function') {
                setState(map(state));
            } else {
                setState(state);
            }
        };
        const onNewStateThrottled = throttle(onNewState, timeout);
        if (routeActive) {
            core.on('state', onNewStateThrottled);
            onNewState([model]);
        }
        return () => {
            active = false;
            onNewStateThrottled.cancel();
            core.off('state', onNewStateThrottled);
        };
    }, [routeActive]);
    return state;
};

module.exports = useModelState;
