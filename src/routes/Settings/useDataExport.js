// Copyright (C) 2017-2022 Smart code 203358507

const React = require('react');
const { useModelState } = require('stremio/common');

const map = (dataExport) => ({
    ...dataExport,
    exportUrl: dataExport !== null && dataExport.exportUrl !== null && dataExport.exportUrl.type === 'Ready' ?
        dataExport.exportUrl.content
        :
        null
});

const useDataExport = () => {
    const action = React.useMemo(() => ({
        action: 'Load',
        args: {
            model: 'DataExport',
        }
    }), []);
    return useModelState({ model: 'data_export', action, map });
};

module.exports = useDataExport;
