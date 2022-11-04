// Copyright (C) 2017-2022 Smart code 203358507

const React = require("react");
const isEqual = require("lodash.isequal");

const useDeepEqualMemo = (cb, deps) => {
  const valueRef = React.useRef();
  const mountedRef = React.useRef(false);
  const prevDepsRef = React.useRef(deps);
  if (!mountedRef.current || !isEqual(prevDepsRef.current, deps)) {
    valueRef.current = cb();
    prevDepsRef.current = deps;
  }
  React.useLayoutEffect(() => {
    mountedRef.current = true;
  }, []);
  return valueRef.current;
};

module.exports = useDeepEqualMemo;
