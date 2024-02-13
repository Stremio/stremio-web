// Copyright (C) 2017-2023 Smart code 203358507

const React = require('react');
const { useTranslate } = require('stremio/common');

const mapSelectableInputs = (library, t) => {
    const typeSelect = {
        title: t.string('SELECT_TYPE'),
        options: library.selectable.types
            .map(({ type, deepLinks }) => ({
                value: deepLinks.library,
                label: type === null ? t.string('TYPE_ALL') : t.stringWithPrefix(type, 'TYPE_')
            })),
        selected: library.selectable.types
            .filter(({ selected }) => selected)
            .map(({ deepLinks }) => deepLinks.library),
        onSelect: (event) => {
            window.location = event.value;
        }
    };
    const sortSelect = {
        title: t.string('SELECT_SORT'),
        options: library.selectable.sorts
            .map(({ sort, deepLinks }) => ({
                value: deepLinks.library,
                label: t.stringWithPrefix(sort.toUpperCase(), 'SORT_')
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
    const t = useTranslate();
    const selectableInputs = React.useMemo(() => {
        return mapSelectableInputs(library, t);
    }, [library]);
    return selectableInputs;
};

module.exports = useSelectableInputs;
