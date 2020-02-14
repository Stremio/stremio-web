const React = require('react');

const mapSelectableInputs = (addons, navigate) => {
    const catalogSelect = {
        title: 'Select catalog',
        options: addons.selectable.catalogs
            .map(({ name, request }) => ({
                value: JSON.stringify(request),
                label: name
            })),
        selected: addons.selectable.catalogs
            .filter(({ request }) => {
                return addons.catalog_resource !== null &&
                    addons.catalog_resource.request.base === request.base &&
                    addons.catalog_resource.request.path.id === request.path.id;
            })
            .map(({ request }) => JSON.stringify(request)),
        onSelect: (event) => {
            navigate({ request: JSON.parse(event.value) });
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
                    addons.catalog_resource.request.path.type_name === request.path.type_name;
            })
            .map(({ request }) => JSON.stringify(request)),
        onSelect: (event) => {
            navigate({ request: JSON.parse(event.value) });
        }
    };
    return [catalogSelect, typeSelect];
};

const useSelectableInputs = (addons, navigate) => {
    const selectableInputs = React.useMemo(() => {
        return mapSelectableInputs(addons, navigate);
    }, [addons, navigate]);
    return selectableInputs;
};

module.exports = useSelectableInputs;
