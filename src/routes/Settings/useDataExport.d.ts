declare const useDataExport: () => [
    DataExport & { exportLoading: boolean },
    () => void,
];

export = useDataExport;
