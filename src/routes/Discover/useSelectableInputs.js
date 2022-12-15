// Copyright (C) 2017-2022 Smart code 203358507

const React = require('react');
const { useTranslation } = require('react-i18next');

const translateOption = (t, option, translateKeyPrefix = '') => {
    const translateKey = `${translateKeyPrefix}${option}`;
    const translateValue = t(`${translateKeyPrefix}${option}`);
    if (translateKey !== translateValue) {
        return translateValue;
    }
    return option.charAt(0).toUpperCase() + option.slice(1);
};

const mapSelectableInputs = (discover, t) => {
    const typeSelect = {
        title: 'Select type',
        options: discover.selectable.types
            .map(({ type, deepLinks }) => ({
                value: deepLinks.discover,
                label: translateOption(t, type, 'TYPE_')
            })),
        selected: discover.selectable.types
            .filter(({ selected }) => selected)
            .map(({ deepLinks }) => deepLinks.discover),
        renderLabelText: discover.selected !== null ?
            () => translateOption(t, discover.selected.request.path.type, 'TYPE_')
            :
            null,
        onSelect: (event) => {
            window.location = event.value;
        }
    };
    const catalogSelect = {
        title: 'Select catalog',
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
        title: `Select ${name}`,
        isRequired: isRequired,
        options: options.map(({ value, deepLinks }) => ({
            label: typeof value === 'string' ? translateOption(t, value) : t('NONE'),
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
            () => `Select ${name}`
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
