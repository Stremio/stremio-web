// Copyright (C) 2017-2020 Smart code 203358507

const React = require('react');

const mapSelectableInputs = (library) => {
    const typeSelect = {
        title: 'Select type',
        options: library.selectable.types
            .map(({ type, deep_links }) => ({
                value: deep_links.library,
                label: type === null ? 'All' : type
            })),
        selected: library.selectable.types
            .filter(({ selected }) => selected)
            .map(({ deep_links }) => deep_links.library),
        onSelect: (event) => {
            window.location = event.value;
        }
    };
    const sortSelect = {
        title: 'Select sort',
        options: library.selectable.sorts
            .map(({ sort, deep_links }) => ({
                value: deep_links.library,
                label: sort
            })),
        selected: library.selectable.sorts
            .filter(({ selected }) => selected)
            .map(({ deep_links }) => deep_links.library),
        onSelect: (event) => {
            window.location = event.value;
        }
    };
    return [typeSelect, sortSelect];
};

const useSelectableInputs = (library) => {
    const selectableInputs = React.useMemo(() => {
        return mapSelectableInputs(library);
    }, [library]);
    return selectableInputs;
};

module.exports = useSelectableInputs;
