// Copyright (C) 2017-2020 Smart code 203358507

const React = require('react');

const ALL_TYPES_OPTION = {
    value: null,
    label: 'All'
};

const mapSelectableInputs = (installedAddons, remoteAddons, navigate) => {
    const catalogSelect = {
        title: 'Select catalog',
        options: remoteAddons.selectable.catalogs
            .map(({ name, request }) => ({
                value: JSON.stringify(request),
                label: name
            }))
            .concat({
                value: JSON.stringify(ALL_TYPES_OPTION.value),
                label: 'Installed'
            }),
        selected: remoteAddons.selectable.catalogs
            .filter(({ request }) => {
                return remoteAddons.selected !== null &&
                    remoteAddons.selected.request.base === request.base &&
                    remoteAddons.selected.request.path.id === request.path.id;
            })
            .map(({ request }) => JSON.stringify(request))
            .concat(installedAddons.selected !== null ? JSON.stringify(ALL_TYPES_OPTION.value) : []),
        onSelect: (event) => {
            const value = JSON.parse(event.value);
            if (value === ALL_TYPES_OPTION.value) {
                navigate({ type_name: value });
                return;
            }

            navigate({ request: value });
        }
    };
    const typeSelect = {
        title: 'Select type',
        options: installedAddons.selected !== null ?
            [{ label: ALL_TYPES_OPTION.label, value: JSON.stringify(ALL_TYPES_OPTION.value) }].concat(installedAddons.type_names.map((type_name) => ({
                value: JSON.stringify(type_name),
                label: type_name
            })))
            :
            remoteAddons.selectable.types.map(({ name, request }) => ({
                value: JSON.stringify(request),
                label: name
            })),
        selected: installedAddons.selected !== null ?
            [JSON.stringify(installedAddons.selected.type_name)]
            :
            remoteAddons.selectable.types
                .filter(({ request }) => {
                    return remoteAddons.selected !== null &&
                        remoteAddons.selected.request.path.type_name === request.path.type_name;
                })
                .map(({ request }) => JSON.stringify(request)),
        onSelect: (event) => {
            const value = JSON.parse(event.value);
            if (value === ALL_TYPES_OPTION.value || typeof value === 'string') {
                navigate({ type_name: value });
                return;
            }

            navigate({ request: value });
        }
    };
    return [catalogSelect, typeSelect];
};

const useSelectableInputs = (installedAddons, remoteAddons, navigate) => {
    const selectableInputs = React.useMemo(() => {
        return mapSelectableInputs(installedAddons, remoteAddons, navigate);
    }, [installedAddons, remoteAddons, navigate]);
    return selectableInputs;
};

module.exports = useSelectableInputs;
