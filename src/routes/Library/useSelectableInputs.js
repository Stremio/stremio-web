// Copyright (C) 2017-2020 Smart code 203358507

const React = require('react');

const SORT_OPTIONS = [
    { label: 'Recent', value: 'lastwatched' },
    { label: 'A-Z', value: 'name' },
    { label: 'Watched', value: 'timeswatched' },
];

const mapSelectableInputs = (route, library) => {
    const typeSelect = {
        title: 'Select type',
        selected: library.selected !== null ?
            [JSON.stringify(library.selected.type_name)]
            :
            [],
        options: [{ label: 'All', value: JSON.stringify(null) }]
            .concat(library.type_names.map((type) => ({ label: type, value: JSON.stringify(type) }))),
        renderLabelText: () => {
            return library.selected.type_name === null ? 'All' : library.selected.type_name;
        },
        onSelect: (event) => {
            const type = JSON.parse(event.value);
            const queryParams = new URLSearchParams(library.selected !== null ? [['sort', library.selected.sort]] : []);
            window.location = `#/${route}${type !== null ? `/${encodeURIComponent(type)}` : ''}?${queryParams.toString()}`;
        }
    };
    const sortSelect = {
        title: 'Select sort',
        selected: library.selected !== null ?
            [library.selected.sort]
            :
            [],
        options: SORT_OPTIONS,
        onSelect: (event) => {
            const type = library.selected !== null ? library.selected.type_name : null;
            const queryParams = new URLSearchParams([['sort', event.value]]);
            window.location = `#/${route}${type !== null ? `/${encodeURIComponent(type)}` : ''}?${queryParams.toString()}`;
        }
    };
    return [typeSelect, sortSelect];
};

const useSelectableInputs = (route, library) => {
    const selectableInputs = React.useMemo(() => {
        return mapSelectableInputs(route, library);
    }, [library]);
    return selectableInputs;
};

module.exports = useSelectableInputs;
