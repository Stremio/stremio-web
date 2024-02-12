type LibraryItemLibrary = LibraryItem & {
    progress: number,
    deepLinks: LibraryItemDeepLinks,
};

type LibraryDeepLinks = {
    library: string,
};

type LibraryPage = {
    deepLinks: LibraryDeepLinks,
} | null;

type Library = {
    catalog: LibraryItemLibrary[],
    selectable: {
        nextPage: LibraryPage,
        prevPage: LibraryPage,
        sorts: SelectableSort<LibraryDeepLinks>[],
        stateFilters: SelectableStateFilter<LibraryDeepLinks>[],
        types: SelectableType<LibraryDeepLinks>[],
    },
    selected: {
        request: {
            page: number,
            sort: string,
            stateFilter: string,
            type: string | null,
        }
    } | null,
};