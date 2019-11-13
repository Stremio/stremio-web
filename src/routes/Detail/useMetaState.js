const React = require('react');

const metaStateReducer = (state, action) => {
    switch (action.type) {
        case 'groups-changed': {
            if (state.selectedGroup !== null) {
                const selectedGroupIncluded = action.groups.some((group) => {
                    return group.req.base === state.selectedGroup.req.base &&
                        group.content.type === 'Ready';
                });
                if (selectedGroupIncluded) {
                    return {
                        ...state,
                        resourceRef: action.resourceRef,
                        groups: action.groups
                    };
                }
            }

            const readyGroup = action.groups.find((group) => group.content.type === 'Ready');
            const selectedGroup = readyGroup ? readyGroup : null;
            return {
                ...state,
                resourceRef: action.resourceRef,
                groups: action.groups,
                selectedGroup
            };
        }
        case 'group-selected': {
            const selectedGroup = state.groups.find((group) => {
                return group.req.base === action.base &&
                    group.content.type === 'Ready';
            });
            if (selectedGroup) {
                return {
                    ...state,
                    selectedGroup
                };
            }

            return state;
        }
        default: {
            return state;
        }
    }
};

const metaStateInitializer = ([metaResourceRef, metaGroups]) => {
    const initialState = {
        resourceRef: null,
        groups: [],
        selectedGroup: null
    };
    const initAction = {
        type: 'groups-changed',
        resourceRef: metaResourceRef,
        groups: metaGroups
    };

    return metaStateReducer(initialState, initAction);
};

const useMetaState = (metaResourceRef, metaGroups) => {
    const [{ resourceRef, groups, selectedGroup }, dispatch] = React.useReducer(
        metaStateReducer,
        [metaResourceRef, metaGroups],
        metaStateInitializer
    );
    React.useEffect(() => {
        dispatch({
            type: 'groups-changed',
            resourceRef: metaResourceRef,
            groups: metaGroups
        });
    }, [metaGroups]);
    return [resourceRef, groups, selectedGroup];
};

module.exports = useMetaState;
