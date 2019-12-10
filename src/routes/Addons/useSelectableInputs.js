const React = require('react');

const navigateWithLoadRequest = (load_request) => {
    const addonTransportUrl = encodeURIComponent(load_request.base);
    const catalogId = encodeURIComponent(load_request.path.id);
    const type = encodeURIComponent(load_request.path.type_name);
    window.location.replace(`#/addons/${addonTransportUrl}/${catalogId}/${type}`);
};

const equalWithouExtra = (request1, request2) => {
    return request1.base === request2.base &&
        request1.path.resource === request2.path.resource &&
        request1.path.type_name === request2.path.type_name &&
        request1.path.id === request2.path.id;
};

const mapSelectableInputs = (addons) => {
    const selectedCatalogRequest = addons.catalog_resource !== null ?
        addons.catalog_resource.request
        :
        {
            base: null,
            path: {
                resource: 'addon_catalog',
                id: null,
                type_name: null,
                extra: []
            }
        };
    const catalogSelect = {
        title: 'Select catalog',
        options: addons.selectable.catalogs
            .map(({ name, load_request }) => ({
                value: JSON.stringify(load_request),
                label: name
            })),
        selected: addons.selectable.catalogs
            .filter(({ load_request: { path: { id } } }) => {
                return id === selectedCatalogRequest.path.id;
            })
            .map(({ load_request }) => JSON.stringify(load_request)),
        onSelect: (event) => {
            navigateWithLoadRequest(JSON.parse(event.value));
        }
    };
    const typeSelect = {
        title: 'Select type',
        options: addons.selectable.types
            .map(({ name, load_request }) => ({
                value: JSON.stringify(load_request),
                label: name
            })),
        selected: addons.selectable.types
            .filter(({ load_request }) => {
                return equalWithouExtra(load_request, selectedCatalogRequest);
            })
            .map(({ load_request }) => JSON.stringify(load_request)),
        onSelect: (event) => {
            navigateWithLoadRequest(JSON.parse(event.value));
        }
    };
    return [catalogSelect, typeSelect];
};

const useSelectableInputs = (addons) => {
    const selectableInputs = React.useMemo(() => {
        return mapSelectableInputs(addons);
    }, [addons]);
    return selectableInputs;
};

module.exports = useSelectableInputs;
