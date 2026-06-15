// Copyright (C) 2017-2023 Smart code 203358507

const React = require('react');
const { useNavigate } = require('react-router');
const { useTranslate } = require('stremio/common');
const { default: toPath } = require('stremio/common/toPath');

const mapSelectableInputs = (library, t, navigate) => {
    const selectedType = library.selectable.types.find(({ selected }) => selected) || library.selectable.types.find(({ type }) => type === null);
    const typeSelect = {
        options: library.selectable.types
            .map(({ type, deepLinks }) => ({
                value: deepLinks.library,
                label: type === null ? t.string('TYPE_ALL') : t.stringWithPrefix(type, 'TYPE_')
            })),
        value: selectedType?.deepLinks.library,
        onSelect: (value) => {
            navigate(toPath(value));
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
            navigate(toPath(value));
        }
    };
    return [typeSelect, sortChips, library.selectable.nextPage];
};

const useSelectableInputs = (library) => {
    const t = useTranslate();
    const navigate = useNavigate();
    const selectableInputs = React.useMemo(() => {
        return mapSelectableInputs(library, t, navigate);
    }, [library]);
    return selectableInputs;
};

module.exports = useSelectableInputs;
