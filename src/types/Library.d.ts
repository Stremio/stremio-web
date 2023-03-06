type LibraryDeepLinks = {
    library: string,
}

type LibraryPage = {
    deepLinks: LibraryDeepLinks,
} | null;

type Library = {
    catalog: LibraryItem[],
    selectable: {
        nextPage: LibraryPage,
        prevPage: LibraryPage,
        sorts: SortOption<LibraryDeepLinks>[],
        types: TypeOption<LibraryDeepLinks>[],
    },
    selected: {
        request: {
            page: number,
            sort: string,
            type: string | null,
        }
    } | null,
};