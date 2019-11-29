const React = require('react');
const isEqual = require('lodash.isequal');

const readyGroupForReq = (groups, req) => {
    return groups.find((group) => {
        return isEqual(group.req, req) && group.content.type === 'Ready';
    });
};

const reducer = (state, action) => {
    switch (action.type) {
        case 'groups-changed': {
            if (state.selected.group === null ||
                !state.selected.byUser ||
                !readyGroupForReq(action.groups, state.selected.group.req)) {
                const firstReadyGroup = action.groups.find((group) => group.content.type === 'Ready');
                const selectedGroup = firstReadyGroup ? firstReadyGroup : null;
                return {
                    ...state,
                    resourceRef: action.resourceRef,
                    groups: action.groups,
                    selected: {
                        group: selectedGroup,
                        byUser: false
                    }
                };
            }

            return {
                ...state,
                resourceRef: action.resourceRef,
                groups: action.groups
            };
        }
        case 'group-selected': {
            const selectedGroup = readyGroupForReq(state.groups, action.req);
            if (!selectedGroup) {
                return state;
            }

            return {
                ...state,
                selected: {
                    group: selectedGroup,
                    byUser: true
                }
            };
        }
        default: {
            return state;
        }
    }
};

const initializer = ([resourceRef, groups]) => {
    const initialState = {
        resourceRef: null,
        groups: [],
        selected: {
            group: null,
            byUser: false
        }
    };
    const initAction = {
        type: 'groups-changed',
        resourceRef,
        groups
    };

    return reducer(initialState, initAction);
};

const useSelectableGroups = (resourceRef, groups) => {
    const [state, dispatch] = React.useReducer(
        reducer,
        [resourceRef, groups],
        initializer
    );
    const selectGroup = React.useCallback((req) => {
        dispatch({
            type: 'group-selected',
            req
        });
    }, []);
    React.useEffect(() => {
        dispatch({
            type: 'groups-changed',
            resourceRef,
            groups
        });
    }, [groups]);
    return [state.resourceRef, state.groups, state.selected.group, selectGroup];
};

module.exports = useSelectableGroups;
