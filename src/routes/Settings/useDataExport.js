// Copyright (C) 2017-2023 Smart code 203358507

const React = require('react');
const { useServices } = require('stremio/services');
const { useModelState } = require('stremio/common');

const map = (dataExport) => ({
    ...dataExport,
    exportUrl: dataExport !== null && dataExport.exportUrl !== null && dataExport.exportUrl.type === 'Ready' ?
        dataExport.exportUrl.content
        :
        null
});

const useDataExport = () => {
    const { core } = useServices();
    const loadDataExport = React.useCallback(() => {
        core.transport.dispatch({
            action: 'Load',
            args: {
                model: 'DataExport',
            }
        }, 'data_export');
    }, []);
    const dataExport = useModelState({ model: 'data_export', map });
    return [
        dataExport,
        loadDataExport
    ];
};

module.exports = useDataExport;
