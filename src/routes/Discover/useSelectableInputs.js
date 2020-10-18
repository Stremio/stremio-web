// Copyright (C) 2017-2020 Smart code 203358507

const React = require('react');

const mapSelectableInputs = (discover) => {
    const typeSelect = {
        title: 'Select type',
        options: discover.selectable.types
            .map(({ type, deep_links }) => ({
                value: deep_links.discover,
                label: type
            })),
        selected: discover.selectable.types
            .filter(({ selected }) => selected)
            .map(({ deep_links }) => deep_links.discover),
        onSelect: (event) => {
            window.location = event.value;
        }
    };
    const catalogSelect = {
        title: 'Select catalog',
        options: discover.selectable.catalogs
            .map(({ catalog, addon_name, deep_links }) => ({
                value: deep_links.discover,
                label: catalog,
                title: `${catalog} (${addon_name})`
            })),
        selected: discover.selectable.catalogs
            .filter(({ selected }) => selected)
            .map(({ deep_links }) => deep_links.discover),
        onSelect: (event) => {
            window.location = event.value;
        }
    };
    const extraSelects = discover.selectable.extra.map(({ name, is_required, options }) => ({
        title: `Select ${name}`,
        isRequired: is_required,
        options: options.map(({ value, deep_links }) => ({
            label: typeof value === 'string' ? value : 'None',
            value: deep_links.discover
        })),
        selected: options
            .filter(({ selected }) => selected)
            .map(({ deep_links }) => deep_links.discover),
        renderLabelText: options.some(({ selected, value }) => selected && value === null) ?
            () => `Select ${name}`
            :
            null,
        onSelect: (event) => {
            window.location = event.value;
        }
    }));
    const paginationInput = discover.selectable.prev_page || discover.selectable.next_page ?
        {
            label: discover.page.toString(),
            onSelect: (event) => {
                if (event.value === 'prev' && discover.selectable.prev_page) {
                    window.location = discover.selectable.prev_page.deep_links.discover;
                }
                if (event.value === 'next' && discover.selectable.next_page) {
                    window.location = discover.selectable.next_page.deep_links.discover;
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
