// Copyright (C) 2017-2020 Smart code 203358507

const React = require('react');
const throttle = require('lodash.throttle');
const { useRouteFocused } = require('stremio-router');
const { useServices } = require('stremio/services');
const useDeepEqualState = require('stremio/common/useDeepEqualState');

const useModelState = ({ model, init, action, timeout, map }) => {
    const modelRef = React.useRef(model);
    const mountedRef = React.useRef(false);
    const { core } = useServices();
    const routeFocused = useRouteFocused();
    const [state, setState] = useDeepEqualState(init);
    React.useLayoutEffect(() => {
        core.transport.dispatch(action, modelRef.current);
    }, [action]);
    React.useLayoutEffect(() => {
        return () => {
            core.transport.dispatch({ action: 'Unload' }, modelRef.current);
        };
    }, []);
    React.useLayoutEffect(() => {
        const onNewStateThrottled = throttle(() => {
            setState(map(core.transport.getState(modelRef.current)));
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
    }, [routeFocused, timeout, map]);
    React.useLayoutEffect(() => {
        mountedRef.current = true;
    }, []);
    return state;
};

module.exports = useModelState;
