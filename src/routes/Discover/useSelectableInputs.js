// Copyright (C) 2017-2020 Smart code 203358507

const React = require('react');

const mapSelectableInputs = (discover) => {
    const typeSelect = {
        title: 'Select type',
        options: discover.selectable.types
            .map(({ type, deepLinks }) => ({
                value: deepLinks.discover,
                label: type
            })),
        selected: discover.selectable.types
            .filter(({ selected }) => selected)
            .map(({ deepLinks }) => deepLinks.discover),
        renderLabelText: discover.selected !== null ?
            () => discover.selected.request.path.type
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
            label: typeof value === 'string' ? value : 'None',
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
    const paginationInput = discover.selectable.prevPage || discover.selectable.nextPage ?
        {
            label: discover.page.toString(),
            onSelect: (event) => {
                if (event.value === 'prev' && discover.selectable.prevPage) {
                    window.location = discover.selectable.prevPage.deepLinks.discover;
                }
                if (event.value === 'next' && discover.selectable.nextPage) {
                    window.location = discover.selectable.nextPage.deepLinks.discover;
                }
            }
        }
        :
        null;
    return [[typeSelect, catalogSelect, ...extraSelects], paginationInput];
};

const useSelectableInputs = (discover) => {
    const selectableInputs = React.useMemo(() => {
        return mapSelectableInputs(discover);
    }, [discover]);
    return selectableInputs;
};

module.exports = useSelectableInputs;
