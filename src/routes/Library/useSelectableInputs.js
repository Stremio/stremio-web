// Copyright (C) 2017-2023 Smart code 203358507

const React = require('react');
const { useTranslate } = require('stremio/common');
const mapSelectableInputs = (library, t) => {
    const selectedType = library.selectable.types.find(({ selected }) => selected) || library.selectable.types.find(({ type }) => type === null);
    const typeSelect = {
        options: library.selectable.types
            .map(({ type, deepLinks }) => ({
                value: deepLinks.library,
                label: type === null ? t.string('TYPE_ALL') : t.stringWithPrefix(type, 'TYPE_')
            })),
        value: selectedType?.deepLinks.library,
        onSelect: (value) => {
            window.location = value;
        }
    };
    const sortChips = {
        options: library.selectable.sorts
            .map(({ sort, deepLinks }) => ({
                value: deepLinks.library,
                label: t.stringWithPrefix(sort.toUpperCase(), 'SORT_')
            })),
        selected: library.selectable.sorts
            .filter(({ selected }) => selected)
            .map(({ deepLinks }) => deepLinks.library),
        onSelect: (value) => {
            window.location = value;
        }
    };
    return [typeSelect, sortChips, library.selectable.nextPage];
};

const useSelectableInputs = (library) => {
    const t = useTranslate();
    const selectableInputs = React.useMemo(() => {
        return mapSelectableInputs(library, t);
    }, [library]);
    return selectableInputs;
};

module.exports = useSelectableInputs;
