// Copyright (C) 2017-2023 Smart code 203358507

const React = require('react');
const throttle = require('lodash.throttle');
const { deepEqual } = require('fast-equals');
const intersection = require('lodash.intersection');
const { useCore } = require('stremio/core');
const { useCoreSuspender } = require('stremio/common/CoreSuspender');
const { useRouteActive } = require('stremio/common/useRouteFocused');

const isPlainObject = (value) => {
    return value !== null && typeof value === 'object' && Object.getPrototypeOf(value) === Object.prototype;
};

const shareObject = (prev, next, shareValue) => {
    const keys = Object.keys(next);
    let changed = keys.length !== Object.keys(prev).length;
    const shared = keys.reduce((result, key) => {
        const own = Object.prototype.hasOwnProperty.call(prev, key);
        result[key] = own ? shareValue(prev[key], next[key]) : next[key];
        changed = changed || !own || result[key] !== prev[key];
        return result;
    }, {});
    return changed ? shared : prev;
};

const shareEqual = (prev, next) => {
    if (prev === next) {
        return prev;
    }

    if (Array.isArray(prev) && Array.isArray(next)) {
        const shared = next.map((value, index) => shareEqual(prev[index], value));
        return shared.length === prev.length && shared.every((value, index) => value === prev[index]) ? prev : shared;
    }

    if (isPlainObject(prev) && isPlainObject(next)) {
        return shareObject(prev, next, shareEqual);
    }

    return deepEqual(prev, next) ? prev : next;
};

const sharedResults = new WeakMap();

const share = (prev, next) => {
    if (prev === null || typeof prev !== 'object' || next === null || typeof next !== 'object') {
        return shareEqual(prev, next);
    }

    let results = sharedResults.get(prev);
    if (!results) {
        results = new WeakMap();
        sharedResults.set(prev, results);
    }

    if (!results.has(next)) {
        results.set(next, shareEqual(prev, next));
    }

    return results.get(next);
};

const useModelState = ({ action, ...args }) => {
    const core = useCore();
    const routeActive = useRouteActive();
    const [model, timeout, map, deps] = React.useMemo(() => {
        return [args.model, args.timeout, args.map, args.deps];
    }, []);
    const { getState } = useCoreSuspender();
    const [state, setState] = React.useReducer(
        (prevState, nextState) => shareObject(prevState, nextState, share),
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
