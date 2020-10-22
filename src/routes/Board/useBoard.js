// Copyright (C) 2017-2020 Smart code 203358507

const React = require('react');
const { useModelState } = require('stremio/common');

const init = () => ({
    selected: null,
    catalogs: []
});

const map = (board) => ({
    ...board,
    catalogs: board.catalogs.map((catalog) => ({
        ...catalog,
        content: catalog.content.type === 'Ready' ?
            {
                ...catalog.content,
                content: catalog.content.content.map((metaItem, _, metaItems) => ({
                    type: metaItem.type,
                    name: metaItem.name,
                    poster: metaItem.poster,
                    posterShape: metaItems[0].posterShape,
                    deepLinks: metaItem.deepLinks
                }))
            }
            :
            catalog.content,
    }))
});

const useBoard = () => {
    const action = React.useMemo(() => ({
        action: 'Load',
        args: {
            model: 'CatalogsWithExtra',
            args: { extra: [] }
        }
    }), []);
    return useModelState({ model: 'board', timeout: 1500, action, init, map });
};

module.exports = useBoard;
