// Copyright (C) 2017-2022 Smart code 203358507

const React = require('react');
const useDeepEqualMemo = require('stremio/common/useDeepEqualMemo');

const useDeepEqualEffect = (cb, deps) => {
    React.useEffect(cb, [useDeepEqualMemo(() => ({}), deps)]);
};

module.exports = useDeepEqualEffect;
