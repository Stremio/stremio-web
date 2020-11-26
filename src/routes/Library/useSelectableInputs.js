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
    const paginationInput = library.selectable.prevPage || library.selectable.nextPage ?
        {
            label: library.selected.request.page.toString(),
            onSelect: (event) => {
                if (event.value === 'prev' && library.selectable.prevPage) {
                    window.location = library.selectable.prevPage.deepLinks.library;
                }
                if (event.value === 'next' && library.selectable.nextPage) {
                    window.location = library.selectable.nextPage.deepLinks.library;
                }
            }
        }
        :
        null;
    return [typeSelect, sortSelect, paginationInput];
};

const useSelectableInputs = (library) => {
    const selectableInputs = React.useMemo(() => {
        return mapSelectableInputs(library);
    }, [library]);
    return selectableInputs;
};

module.exports = useSelectableInputs;
