// Copyright (C) 2017-2020 Smart code 203358507

const React = require('react');
const { useServices } = require('stremio/services');

const useToggleInLibrary = (metaItem) => {
    const { core } = useServices();
    const addToLibrary = React.useCallback(() => {
        core.transport.dispatch({
            action: 'Ctx',
            args: {
                action: 'AddToLibrary',
                args: metaItem
            }
        });
    }, [metaItem]);
    const removeFromLibrary = React.useCallback(() => {
        core.transport.dispatch({
            action: 'Ctx',
            args: {
                action: 'RemoveFromLibrary',
                args: metaItem.id
            }
        });
    }, [metaItem]);
    return metaItem !== null ?
        metaItem.inLibrary ?
            removeFromLibrary
            :
            addToLibrary
        :
        null;
};

module.exports = useToggleInLibrary;
