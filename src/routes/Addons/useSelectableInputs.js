// Copyright (C) 2017-2023 Smart code 203358507

const React = require('react');
const { useTranslate } = require('stremio/common');

const mapSelectableInputs = (installedAddons, remoteAddons, t) => {
    const selectedCatalog = remoteAddons.selectable.catalogs.concat(installedAddons.selectable.catalogs).find(({ selected }) => selected);
    const catalogSelect = {
        options: remoteAddons.selectable.catalogs
            .concat(installedAddons.selectable.catalogs)
            .map(({ name, deepLinks }) => ({
                value: deepLinks.addons,
                label: t.stringWithPrefix(name.toUpperCase(), 'ADDON_'),
                title: t.stringWithPrefix(name.toUpperCase(), 'ADDON_'),
            })),
        value: selectedCatalog ? selectedCatalog.deepLinks.addons : undefined,
        title: remoteAddons.selected !== null ?
            () => {
                const selectableCatalog = remoteAddons.selectable.catalogs
                    .find(({ id }) => id === remoteAddons.selected.request.path.id);
                return selectableCatalog ? t.stringWithPrefix(selectableCatalog.name, 'ADDON_') : remoteAddons.selected.request.path.id;
            }
            : null,
        onSelect: (value) => {
            window.location = value;
        }
    };
    const selectedType = installedAddons.selected !== null
        ? installedAddons.selectable.types.find(({ selected }) => selected)
        : remoteAddons.selectable.types.find(({ selected }) => selected);
    const typeSelect = {
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
        value: selectedType ? selectedType.deepLinks.addons : undefined,
        title: () => {
            return installedAddons.selected !== null ?
                installedAddons.selected.request.type === null ?
                    t.string('TYPE_ALL')
                    :
                    t.stringWithPrefix(installedAddons.selected.request.type, 'TYPE_')
                :
                remoteAddons.selected !== null ?
                    t.stringWithPrefix(remoteAddons.selected.request.path.type, 'TYPE_')
                    :
                    t.string('SELECT_TYPE');
        },
        onSelect: (value) => {
            window.location = value;
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
