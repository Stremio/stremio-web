// Copyright (C) 2017-2023 Smart code 203358507

import React, { createContext, useContext, useMemo, useState } from 'react';
import type { ClockFormat, ClockPosition } from './helpers';

// In-memory only: the OSD clock settings (enabled/format/position) don't exist yet
// in stremio-core's Settings struct, so there's nowhere to persist them through the
// core. State resets on page reload until those fields are added upstream.
type OsdClockContextValue = {
    enabled: boolean,
    format: ClockFormat,
    position: ClockPosition,
    setEnabled: (enabled: boolean) => void,
    setFormat: (format: ClockFormat) => void,
    setPosition: (position: ClockPosition) => void,
};

const OsdClockContext = createContext<OsdClockContextValue | null>(null);

type Props = {
    children: React.ReactNode,
};

const OsdClockProvider = ({ children }: Props) => {
    const [enabled, setEnabled] = useState(false);
    const [format, setFormat] = useState<ClockFormat>('auto');
    const [position, setPosition] = useState<ClockPosition>('top-right');

    const value = useMemo(() => ({
        enabled,
        format,
        position,
        setEnabled,
        setFormat,
        setPosition,
    }), [enabled, format, position]);

    return (
        <OsdClockContext.Provider value={value}>
            {children}
        </OsdClockContext.Provider>
    );
};

const useOsdClock = () => {
    const value = useContext(OsdClockContext);
    if (value === null) {
        throw new Error('useOsdClock must be used inside OsdClockProvider');
    }
    return value;
};

export {
    OsdClockProvider,
    useOsdClock,
};
