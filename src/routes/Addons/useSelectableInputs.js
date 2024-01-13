// Copyright (C) 2017-2023 Smart code 203358507

const React = require('react');
const { useTranslate } = require('stremio/common');

const mapSelectableInputs = (installedAddons, remoteAddons, t) => {
    const catalogSelect = {
        title: t.string('SELECT_CATALOG'),
        options: remoteAddons.selectable.catalogs
            .concat(installedAddons.selectable.catalogs)
            .map(({ name, deepLinks }) => ({
                value: deepLinks.addons,
                label: t.stringWithPrefix(name, 'ADDON_'),
                title: t.stringWithPrefix(name, 'ADDON_'),
            })),
        selected: remoteAddons.selectable.catalogs
            .concat(installedAddons.selectable.catalogs)
            .filter(({ selected }) => selected)
            .map(({ deepLinks }) => deepLinks.addons),
        renderLabelText: remoteAddons.selected !== null ?
            () => {
                const selectableCatalog = remoteAddons.selectable.catalogs
                    .find(({ id }) => id === remoteAddons.selected.request.path.id);
                return selectableCatalog ? t.stringWithPrefix(selectableCatalog.name, 'ADDON_') : remoteAddons.selected.request.path.id;
            }
            :
            null,
        onSelect: (event) => {
            window.location = event.value;
        }
    };
    const typeSelect = {
        title: t.string('SELECT_TYPE'),
        options: installedAddons.selected !== null ?
            installedAddons.selectable.types.map(({ type, deepLinks }) => ({
                value: deepLinks.addons,
                label: type !== null ? t.stringWithPrefix(type, 'TYPE_') : t.string('TYPE_ALL')
            }))
            :
            remoteAddons.selectable.types.map(({ type, deepLinks }) => ({
                value: deepLinks.addons,
                label: t.stringWithPrefix(type, 'TYPE_')
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
                    t.string('TYPE_ALL')
                    :
                    t.stringWithPrefix(installedAddons.selected.request.type, 'TYPE_')
                :
                remoteAddons.selected !== null ?
                    t.stringWithPrefix(remoteAddons.selected.request.path.type, 'TYPE_')
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
    const t = useTranslate();
    const selectableInputs = React.useMemo(() => {
        return mapSelectableInputs(installedAddons, remoteAddons, t);
    }, [installedAddons, remoteAddons]);
    return selectableInputs;
};

module.exports = useSelectableInputs;
