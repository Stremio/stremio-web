// Copyright (C) 2017-2020 Smart code 203358507

const React = require('react');

const mapSelectableInputs = (library) => {
    const typeSelect = {
        title: 'Select type',
        options: library.selectable.types
            .map(({ type, deepLinks }) => ({
                value: deepLinks.library,
                label: type === null ? 'All' : type
            })),
        selected: library.selectable.types
            .filter(({ selected }) => selected)
            .map(({ deepLinks }) => deepLinks.library),
        onSelect: (event) => {
            window.location = event.value;
        }
    };
    const sortSelect = {
        title: 'Select sort',
        options: library.selectable.sorts
            .map(({ sort, deepLinks }) => ({
                value: deepLinks.library,
                label: sort
            })),
        selected: library.selectable.sorts
            .filter(({ selected }) => selected)
            .map(({ deepLinks }) => deepLinks.library),
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
