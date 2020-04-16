// Copyright (C) 2017-2020 Smart code 203358507

const React = require('react');
const throttle = require('lodash.throttle');
const { useRouteFocused } = require('stremio-router');
const { useServices } = require('stremio/services');
const useDeepEqualState = require('stremio/common/useDeepEqualState');

const useModelState = ({ model, init, action, timeout, onNewState, map, mapWithCtx }) => {
    const modelRef = React.useRef(model);
    const mountedRef = React.useRef(false);
    const { core } = useServices();
    const routeFocused = useRouteFocused();
    const [state, setState] = useDeepEqualState(init);
    React.useLayoutEffect(() => {
        core.dispatch(action, modelRef.current);
    }, [action]);
    React.useLayoutEffect(() => {
        return () => {
            core.dispatch({ action: 'Unload' }, modelRef.current);
        };
    }, []);
    React.useLayoutEffect(() => {
        const onNewStateThrottled = throttle(() => {
            const state = core.getState(modelRef.current);
            if (typeof onNewState === 'function') {
                const action = onNewState(state);
                const handled = core.dispatch(action, modelRef.current);
                if (handled) {
                    return;
                }
            }

            if (typeof mapWithCtx === 'function') {
                const ctx = core.getState('ctx');
                setState(mapWithCtx(state, ctx));
            } else if (typeof map === 'function') {
                setState(map(state));
            } else {
                setState(state);
            }
        }, timeout);
        if (routeFocused) {
            core.on('NewState', onNewStateThrottled);
            if (mountedRef.current) {
                onNewStateThrottled.call();
            }
        }
        return () => {
            onNewStateThrottled.cancel();
            core.off('NewState', onNewStateThrottled);
        };
    }, [routeFocused, timeout, onNewState, map, mapWithCtx]);
    React.useLayoutEffect(() => {
        mountedRef.current = true;
    }, []);
    return state;
};

module.exports = useModelState;
