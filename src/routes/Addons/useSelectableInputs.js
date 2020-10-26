// Copyright (C) 2017-2020 Smart code 203358507

const React = require('react');

const mapSelectableInputs = (installedAddons, remoteAddons) => {
    const catalogSelect = {
        title: 'Select catalog',
        options: remoteAddons.selectable.catalogs
            .map(({ catalog, addonName, deepLinks }) => ({
                value: deepLinks.addons,
                label: catalog,
                title: `${catalog} (${addonName})`
            }))
            .concat(installedAddons.selectable.catalogs.map(({ catalog, deepLinks }) => ({
                value: deepLinks.addons,
                label: catalog,
                title: catalog
            }))),
        selected: remoteAddons.selectable.catalogs
            .concat(installedAddons.selectable.catalogs)
            .filter(({ selected }) => selected)
            .map(({ deepLinks }) => deepLinks.addons),
        renderLabelText: remoteAddons.selected !== null ?
            () => {
                const selectableCatalog = remoteAddons.selectable.catalogs
                    .find(({ request }) => request.path.id === remoteAddons.selected.request.path.id);
                return selectableCatalog ? selectableCatalog.catalog : remoteAddons.selected.request.path.id;
            }
            :
            null,
        onSelect: (event) => {
            window.location = event.value;
        }
    };
    const typeSelect = {
        title: 'Select type',
        options: installedAddons.selected !== null ?
            installedAddons.selectable.types.map(({ type, deepLinks }) => ({
                value: deepLinks.addons,
                label: type !== null ? type : 'All'
            }))
            :
            remoteAddons.selectable.types.map(({ type, deepLinks }) => ({
                value: deepLinks.addons,
                label: type
            })),
        selected: installedAddons.selected !== null ?
            installedAddons.selectable.types
                .filter(({ selected }) => selected)
                .map(({ deepLinks }) => deepLinks.addons)
            :
            remoteAddons.selectable.types
                .filter(({ selected }) => selected)
                .map(({ deepLinks }) => deepLinks.addons),
        renderLabelText: () => {
            return installedAddons.selected !== null ?
                installedAddons.selected.request.type === null ?
                    'All'
                    :
                    installedAddons.selected.request.type
                :
                remoteAddons.selected !== null ?
                    remoteAddons.selected.request.path.type
                    :
                    typeSelect.title;
        },
        onSelect: (event) => {
            window.location = event.value;
        }
    };
    return [catalogSelect, typeSelect];
};

const useSelectableInputs = (installedAddons, remoteAddons) => {
    const selectableInputs = React.useMemo(() => {
        return mapSelectableInputs(installedAddons, remoteAddons);
    }, [installedAddons, remoteAddons]);
    return selectableInputs;
};

module.exports = useSelectableInputs;
