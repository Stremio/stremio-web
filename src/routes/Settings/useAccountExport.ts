// Copyright (C) 2017-2026 Smart code 203358507

import { useEffect } from 'react';
import { usePlatform } from 'stremio/common';
import useDataExport from './useDataExport';

const useAccountExport = () => {
    const platform = usePlatform();
    const [dataExport, loadDataExport] = useDataExport();

    useEffect(() => {
        if (dataExport.exportUrl) {
            platform.openExternal(dataExport.exportUrl);
        }
    }, [dataExport.exportUrl]);

    return { loading: dataExport.exportLoading, start: loadDataExport };
};

export default useAccountExport;
