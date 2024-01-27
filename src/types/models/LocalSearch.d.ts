type LocalSearchItem = {
    query: string,
    deepLinks: {
        search: string,
    },
};

type LocalSearch = {
    items: LocalSearchItem[],
};