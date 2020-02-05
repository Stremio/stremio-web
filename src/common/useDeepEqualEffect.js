const React = require('react');
const isEqual = require('lodash.isequal');

const useDeepEqualEffect = (cb, deps) => {
    const mountedRef = React.useRef(false);
    const depsRef = React.useRef(null);
    React.useEffect(() => {
        if (!mountedRef.current || !isEqual(depsRef.current, deps)) {
            cb();
        }

        mountedRef.current = true;
        depsRef.current = deps;
    }, [deps]);
};

module.exports = useDeepEqualEffect;
