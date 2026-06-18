// Copyright (C) 2017-2026 Smart code 203358507

import { useContext } from 'react';
import FullscreenContext from './FullscreenContext';

const useFullscreen = () => {
    const value = useContext(FullscreenContext);
    if (value === null) {
        throw new Error('useFullscreen must be used inside FullscreenProvider');
    }

    return value;
};

export default useFullscreen;
