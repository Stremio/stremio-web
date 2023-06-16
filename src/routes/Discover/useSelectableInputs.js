// Copyright (C) 2017-2023 Smart code 203358507

const React = require('react');
const { useTranslation } = require('react-i18next');
const { translateOption } = require('stremio/common');

const mapSelectableInputs = (discover, t) => {
    const typeSelect = {
        title: t('SELECT_TYPE'),
        options: discover.selectable.types
            .map(({ type, deepLinks }) => ({
                value: deepLinks.discover,
                label: translateOption(type, 'TYPE_')
            })),
        selected: discover.selectable.types
            .filter(({ selected }) => selected)
            .map(({ deepLinks }) => deepLinks.discover),
        renderLabelText: discover.selected !== null ?
            () => translateOption(discover.selected.request.path.type, 'TYPE_')
            :
            null,
        onSelect: (event) => {
            window.location = event.value;
        }
    };
    const catalogSelect = {
        title: t('SELECT_CATALOG'),
        options: discover.selectable.catalogs
            .map(({ name, addon, deepLinks }) => ({
                value: deepLinks.discover,
                label: name,
                title: `${name} (${addon.manifest.name})`
            })),
        selected: discover.selectable.catalogs
            .filter(({ selected }) => selected)
            .map(({ deepLinks }) => deepLinks.discover),
        renderLabelText: discover.selected !== null ?
            () => {
                const selectableCatalog = discover.selectable.catalogs
                    .find(({ id }) => id === discover.selected.request.path.id);
                return selectableCatalog ? selectableCatalog.name : discover.selected.request.path.id;
            }
            :
            null,
        onSelect: (event) => {
            window.location = event.value;
        }
    };
    const extraSelects = discover.selectable.extra.map(({ name, isRequired, options }) => ({
        title: translateOption(name, 'SELECT_'),
        isRequired: isRequired,
        options: options.map(({ value, deepLinks }) => ({
            label: typeof value === 'string' ? translateOption(value) : t('NONE'),
            value: JSON.stringify({
                href: deepLinks.discover,
                value
            })
        })),
        selected: options
            .filter(({ selected }) => selected)
            .map(({ value, deepLinks }) => JSON.stringify({
                href: deepLinks.discover,
                value
            })),
        renderLabelText: options.some(({ selected, value }) => selected && value === null) ?
            () => translateOption(name, 'SELECT_')
            :
            null,
        onSelect: (event) => {
            const { href } = JSON.parse(event.value);
            window.location = href;
        }
    }));
    return [[typeSelect, catalogSelect, ...extraSelects], discover.selectable.nextPage];
};

const useSelectableInputs = (discover) => {
    const { t } = useTranslation();
    const selectableInputs = React.useMemo(() => {
        return mapSelectableInputs(discover, t);
    }, [discover.selected, discover.selectable]);
    return selectableInputs;
};

module.exports = useSelectableInputs;
