// Copyright (C) 2017-2023 Smart code 203358507

const React = require('react');
const { useNavigate } = require('react-router');
const { useTranslate } = require('stremio/common');
const { default: toPath } = require('stremio-router/toPath');

const mapSelectableInputs = (discover, t, navigate) => {
    const selectedType = discover.selectable.types.find(({ selected }) => selected);
    const typeSelect = {
        id: 'type',
        label: t.string('TYPE'),
        options: discover.selectable.types
            .map(({ type, deepLinks }) => ({
                value: deepLinks.discover,
                label: t.stringWithPrefix(type, 'TYPE_')
            })),
        value: selectedType
            ? selectedType.deepLinks.discover
            : undefined,
        title: discover.selected !== null
            ? () => t.stringWithPrefix(discover.selected.request.path.type, 'TYPE_')
            : t.string('SELECT_TYPE'),
        onSelect: (value) => {
            navigate(toPath(value));
        }
    };
    const selectedCatalog = discover.selectable.catalogs.find(({ selected }) => selected);
    const catalogSelect = {
        id: 'catalog',
        label: t.string('CATALOG'),
        options: discover.selectable.catalogs
            .map(({ id, name, addon, deepLinks }) => ({
                value: deepLinks.discover,
                label: t.catalogTitle({ addon, id, name }),
                description: addon.manifest.name,
                title: `${name} (${addon.manifest.name})`
            })),
        value: selectedCatalog ?
            selectedCatalog.deepLinks.discover
            : undefined,
        title: discover.selected !== null
            ? () => {
                const selectableCatalog = discover.selectable.catalogs
                    .find(({ id }) => id === discover.selected.request.path.id);
                return selectableCatalog ? t.catalogTitle(selectableCatalog, false) : discover.selected.request.path.id;
            }
            :
            t.string('SELECT_CATALOG'),
        onSelect: (value) => {
            navigate(toPath(value));
        }
    };
    const extraSelects = discover.selectable.extra.map(({ name, isRequired, options }) => {
        const selectedExtra = options.find(({ selected }) => selected);
        return {
            id: `extra:${name}`,
            label: t.stringWithPrefix(name.toUpperCase(), '', name.charAt(0).toUpperCase() + name.slice(1)),
            active: typeof selectedExtra?.value === 'string',
            isRequired: isRequired,
            options: options.map(({ value, deepLinks }) => ({
                label: typeof value === 'string' ? t.string(value) : t.string('NONE'),
                default: value === null,
                value: JSON.stringify({
                    href: deepLinks.discover,
                    value
                })
            })),
            value: selectedExtra ? JSON.stringify({
                href: selectedExtra.deepLinks.discover,
                value: selectedExtra.value,
            }) : undefined,
            title: options.some(({ selected, value }) => selected && value === null) ?
                () => t.string(name.toUpperCase())
                : selectedExtra ? t.string(selectedExtra.value) : () => t.string(name.toUpperCase()),
            onSelect: (value) => {
                const { href } = JSON.parse(value);
                navigate(toPath(href));
            }
        };
    });
    return [[typeSelect, catalogSelect, ...extraSelects], discover.selectable.nextPage];
};

const useSelectableInputs = (discover) => {
    const t = useTranslate();
    const navigate = useNavigate();
    const selectableInputs = React.useMemo(() => {
        return mapSelectableInputs(discover, t, navigate);
    }, [discover.selected, discover.selectable]);
    return selectableInputs;
};

module.exports = useSelectableInputs;
