// Copyright (C) 2017-2022 Smart code 203358507

const { t } = require('i18next');
const React = require('react');

const mapSelectableInputs = (installedAddons, remoteAddons) => {
    const catalogSelect = {
        title: t('SELECT_CATALOG'),
        options: remoteAddons.selectable.catalogs
            .concat(installedAddons.selectable.catalogs)
            .map(({ name, deepLinks }) => ({
                value: deepLinks.addons,
                label: name,
                title: name
            })),
        selected: remoteAddons.selectable.catalogs
            .concat(installedAddons.selectable.catalogs)
            .filter(({ selected }) => selected)
            .map(({ deepLinks }) => deepLinks.addons),
        renderLabelText: remoteAddons.selected !== null ?
            () => {
                const selectableCatalog = remoteAddons.selectable.catalogs
                    .find(({ id }) => id === remoteAddons.selected.request.path.id);
                return selectableCatalog ? selectableCatalog.name : remoteAddons.selected.request.path.id;
            }
            :
            null,
        onSelect: (event) => {
            window.location = event.value;
        }
    };
    const typeSelect = {
        title: t('SELECT_TYPE'),
        options: installedAddons.selected !== null ?
            installedAddons.selectable.types.map(({ type, deepLinks }) => ({
                value: deepLinks.addons,
                label: type !== null ? type : t('TYPE_ALL')
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
                    t('TYPE_ALL')
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
