const React = require('react');
const throttle = require('lodash.throttle');
const { useRouteFocused } = require('stremio-router');
const { useServices } = require('stremio/services');
const useDeepEqualState = require('stremio/common/useDeepEqualState');

const UNLOAD_ACTION = {
    action: 'Unload',
};

const useModelState = ({ model, action, timeout, map, mapWithCtx, init }) => {
    const modelRef = React.useRef(model);
    const { core } = useServices();
    const routeFocused = useRouteFocused();
    const [state, setState] = useDeepEqualState(init);
    React.useLayoutEffect(() => {
        core.dispatch(action, modelRef.current);
    }, [action]);
    React.useLayoutEffect(() => {
        return () => {
            core.dispatch(UNLOAD_ACTION, modelRef.current);
        };
    }, []);
    React.useLayoutEffect(() => {
        const onNewState = throttle(() => {
            const state = core.getState(modelRef.current);
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
            core.on('NewState', onNewState);
            onNewState.call();
        }
        return () => {
            onNewState.cancel();
            core.off('NewState', onNewState);
        };
    }, [routeFocused]);
    return state;
};

module.exports = useModelState;
