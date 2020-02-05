const React = require('react');

const navigateWithRequest = (request) => {
    const transportUrl = encodeURIComponent(request.base);
    const catalogId = encodeURIComponent(request.path.id);
    const type = encodeURIComponent(request.path.type_name);
    window.location.replace(`#/addons/${transportUrl}/${catalogId}/${type}`);
};

const equalWithoutExtra = (request1, request2) => {
    return request1.base === request2.base &&
        request1.path.resource === request2.path.resource &&
        request1.path.type_name === request2.path.type_name &&
        request1.path.id === request2.path.id;
};

const mapSelectableInputs = (addons) => {
    const catalogSelect = {
        title: 'Select catalog',
        options: addons.selectable.catalogs
            .map(({ name, request }) => ({
                value: JSON.stringify(request),
                label: name
            })),
        selected: addons.selectable.catalogs
            .filter(({ request: { path: { id } } }) => {
                return addons.catalog_resource !== null &&
                    addons.catalog_resource.request.path.id === id;
            })
            .map(({ request }) => JSON.stringify(request)),
        onSelect: (event) => {
            navigateWithRequest(JSON.parse(event.value));
        }
    };
    const typeSelect = {
        title: 'Select type',
        options: addons.selectable.types
            .map(({ name, request }) => ({
                value: JSON.stringify(request),
                label: name
            })),
        selected: addons.selectable.types
            .filter(({ request }) => {
                return addons.catalog_resource !== null &&
                    equalWithouExtra(addons.catalog_resource.request, request);
            })
            .map(({ request }) => JSON.stringify(request)),
        onSelect: (event) => {
            navigateWithRequest(JSON.parse(event.value));
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
