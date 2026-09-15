// Copyright (C) 2017-2025 Smart code 203358507

import useMediaQuery from './useMediaQuery';

type DeviceOrientation = 'landscape' | 'portrait';

const useOrientation = (): DeviceOrientation => (
    useMediaQuery('(orientation: portrait)') ? 'portrait' : 'landscape'
);

export default useOrientation;
