const React = require('react');
const isEqual = require('lodash.isequal');

const readyResourceForRequest = (resources, request) => {
    return resources.find((resource) => {
        return isEqual(resource.request, request) && resource.content.type === 'Ready';
    });
};

const reducer = (state, action) => {
    switch (action.type) {
        case 'resources-changed': {
            if (state.selected.resource === null ||
                !state.selected.byUser ||
                !readyResourceForRequest(action.resources, state.selected.resource.request)) {
                const firstReadyResource = action.resources.find((resource) => resource.content.type === 'Ready');
                const selectedResource = firstReadyResource ? firstReadyResource : null;
                return {
                    ...state,
                    resourceRef: action.resourceRef,
                    resources: action.resources,
                    selected: {
                        resource: selectedResource,
                        byUser: false
                    }
                };
            }

            return {
                ...state,
                resourceRef: action.resourceRef,
                resources: action.resources
            };
        }
        case 'resource-selected': {
            const selectedResource = readyResourceForRequest(state.resources, action.request);
            if (!selectedResource) {
                return state;
            }

            return {
                ...state,
                selected: {
                    resource: selectedResource,
                    byUser: true
                }
            };
        }
        default: {
            return state;
        }
    }
};

const initializer = ([resourceRef, resources]) => {
    const initialState = {
        resourceRef: null,
        resources: [],
        selected: {
            resource: null,
            byUser: false
        }
    };
    const initAction = {
        type: 'resources-changed',
        resourceRef,
        resources
    };

    return reducer(initialState, initAction);
};

const useSelectableResource = (resourceRef, resources) => {
    const [state, dispatch] = React.useReducer(
        reducer,
        [resourceRef, resources],
        initializer
    );
    const selectResource = React.useCallback((request) => {
        dispatch({ type: 'resource-selected', request });
    }, []);
    React.useEffect(() => {
        dispatch({ type: 'resources-changed', resourceRef, resources });
    }, [resources]);
    return [state.resourceRef, state.resources, state.selected.resource, selectResource];
};

module.exports = useSelectableResource;
