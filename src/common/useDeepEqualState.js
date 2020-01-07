const React = require('react');
const isEqual = require('lodash.isequal');

const useDeepEqualState = (initialState) => {
    return React.useReducer(
        (prevState, nextState) => {
            return isEqual(prevState, nextState) ?
                prevState
                :
                nextState;
        },
        undefined,
        () => {
            return typeof initialState === 'function' ?
                initialState()
                :
                initialState;
        }
    );
};

module.exports = useDeepEqualState;
