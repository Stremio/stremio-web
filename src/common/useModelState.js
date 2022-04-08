// Copyright (C) 2017-2022 Smart code 203358507

const React = require('react');
const throttle = require('lodash.throttle');
const { useRouteFocused } = require('stremio-router');
const { useServices } = require('stremio/services');
const useDeepEqualState = require('stremio/common/useDeepEqualState');

const useModelState = ({ init, action, ...args }) => {
    const { core } = useServices();
    const routeFocused = useRouteFocused();
    const mountedRef = React.useRef(false);
    const [model, timeout, map] = React.useMemo(() => {
        return [args.model, args.timeout, args.map];
    }, []);
    const [state, setState] = useDeepEqualState(init);
    React.useLayoutEffect(() => {
        if (action) {
            core.transport.dispatch(action, model);
        }
    }, [action]);
    React.useLayoutEffect(() => {
        return () => {
            core.transport.dispatch({ action: 'Unload' }, model);
        };
    }, []);
    React.useLayoutEffect(() => {
        const onNewStateThrottled = throttle(() => {
            const state = core.transport.getState(model);
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
    React.useLayoutEffect(() => {
        mountedRef.current = true;
    }, []);
    return state;
};

module.exports = useModelState;
