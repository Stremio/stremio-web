const React = require('react');

const SORT_PROP_OPTIONS = [
    { label: 'Recent', value: 'ctime' },
    { label: 'A-Z', value: 'name' },
    { label: 'Year', value: 'year' },
];

const mapSelectableInputs = (library) => {
    const typeSelect = {
        title: 'Select type',
        selected: library.selected !== null ?
            [library.selected.type_name]
            :
            [],
        options: library.type_names
            .map((type) => ({ label: type, value: type })),
        onSelect: (event) => {
            window.location.replace(`#/library/${encodeURIComponent(event.value)}`);
        }
    };
    const sortPropSelect = {
        title: 'Select sort',
        selected: library.selected !== null ?
            [library.selected.sort_prop]
            :
            [],
        options: SORT_PROP_OPTIONS,
        onSelect: (event) => {
            if (library.selected !== null) {
                window.location.replace(`#/library/${encodeURIComponent(library.selected.type_name)}/${encodeURIComponent(event.value)}`);
            } else if (library.type_names.length > 0) {
                window.location.replace(`#/library/${encodeURIComponent(library.type_names[0])}/${encodeURIComponent(event.value)}`);
            }
        }
    };
    return [typeSelect, sortPropSelect];
};

const useSelectableInputs = (library) => {
    const selectableInputs = React.useMemo(() => {
        return mapSelectableInputs(library);
    }, [library]);
    return selectableInputs;
};

module.exports = useSelectableInputs;
