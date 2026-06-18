// Copyright (C) 2017-2023 Smart code 203358507

const React = require('react');
const throttle = require('lodash.throttle');
const { deepEqual } = require('fast-equals');
const intersection = require('lodash.intersection');
const { useCore } = require('stremio/core');
const { useCoreSuspender } = require('stremio/common/CoreSuspender');
const { default: useRouteFocused } = require('stremio/common/useRouteFocused');

const useModelState = ({ action, ...args }) => {
    const core = useCore();
    const routeFocused = useRouteFocused();
    const mountedRef = React.useRef(false);
    const [model, timeout, map, deps] = React.useMemo(() => {
        return [args.model, args.timeout, args.map, args.deps];
    }, []);
    const { getState } = useCoreSuspender();
    const [state, setState] = React.useReducer(
        (prevState, nextState) => {
            return Object.keys(prevState).reduce((result, key) => {
                result[key] = deepEqual(prevState[key], nextState[key]) ? prevState[key] : nextState[key];
                return result;
            }, {});
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
        const onNewState = async (models) => {
            if (models.indexOf(model) === -1 && (!Array.isArray(deps) || intersection(deps, models).length === 0)) {
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
            core.on('state', onNewStateThrottled);
            if (mountedRef.current) {
                onNewState([model]);
            }
        }
        return () => {
            onNewStateThrottled.cancel();
            core.off('state', onNewStateThrottled);
        };
    }, [routeFocused]);
    React.useEffect(() => {
        mountedRef.current = true;
    }, []);
    return state;
};

module.exports = useModelState;
