const React = require('react');

const SORT_PROP_OPTIONS = [
    { label: 'Recent', value: '_ctime' },
    { label: 'A-Z', value: 'name' },
    { label: 'Year', value: 'year' },
];

const mapSelectableInputs = (library) => {
    const typeSelect = {
        selected: library.selected !== null ?
            [library.selected.type_name]
            :
            [],
        options: library.type_names
            .map((type) => ({ label: type, value: type })),
        onSelect: (event) => {
            const queryParams = new URLSearchParams(
                library.selected !== null ?
                    [['sort_prop', library.selected.sort_prop]]
                    :
                    []
            );
            window.location.replace(`#/library/${encodeURIComponent(event.value)}?${queryParams.toString()}`);
        }
    };
    const sortPropSelect = {
        selected: library.selected !== null ?
            [library.selected.sort_prop]
            :
            [],
        options: SORT_PROP_OPTIONS,
        onSelect: (event) => {
            const queryParams = new URLSearchParams([['sort_prop', event.value]]);
            if (library.selected !== null) {
                window.location.replace(`#/library/${encodeURIComponent(library.selected.type_name)}?${queryParams.toString()}`);
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
