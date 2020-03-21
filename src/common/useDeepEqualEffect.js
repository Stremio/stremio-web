const React = require('react');
const useDeepEqualMemo = require('stremio/common/useDeepEqualMemo');

const useDeepEqualEffect = (cb, deps) => {
    React.useEffect(cb, [useDeepEqualMemo(() => ({}), deps)]);
};

module.exports = useDeepEqualEffect;
