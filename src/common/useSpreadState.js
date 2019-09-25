const React = require('react');

const useSpreadState = (initialState) => {
    const [state, setState] = React.useReducer(
        (state, nextState) => ({ ...state, ...nextState }),
        initialState
    );
    return [state, setState];
};

module.exports = useSpreadState;
