// Copyright (C) 2017-2020 Smart code 203358507

const React = require('react');
const isEqual = require('lodash.isequal');

const readyResourceForRequest = (resources, request) => {
    return resources.reduce((result, resource) => {
        if (resource.content.type === 'Ready' && isEqual(resource.request, request)) {
            return resource;
        }

        return result;
    }, null);
};

const reducer = (state, action) => {
    switch (action.type) {
        case 'resources-changed': {
            if (state.selected.resource === null ||
                !state.selected.byUser ||
                readyResourceForRequest(action.resources, state.selected.resource.request) === null) {
                const selectedResource = action.resources.reduce((result, resource) => {
                    if (resource.content.type === 'Ready') {
                        return resource;
                    }

                    return result;
                }, null);
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
            if (selectedResource !== null) {
                return {
                    ...state,
                    selected: {
                        resource: selectedResource,
                        byUser: true
                    }
                };
            }

            return state;
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
    }, [resourceRef, resources]);
    return [state.resourceRef, state.resources, state.selected.resource, selectResource];
};

module.exports = useSelectableResource;
