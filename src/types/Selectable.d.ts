type SelectableType<T> = {
    type: string,
    selected: boolean,
    deepLinks: T
};

type SelectableSort<T> = {
    sort: string,
    selected: boolean,
    deepLinks: T
};

type SelectableExtra<T> = {
    isRequired: boolean,
    name: string,
    options: {
        deepLinks: T,
        selected: boolean,
        value: string | null,
    }
};

type SelectableCatalog<T> = {
    name: string,
    selected: boolean,
    deepLinks: T,
};