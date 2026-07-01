// Copyright (C) 2017-2023 Smart code 203358507

import React, { useEffect, useState } from 'react';
import { useOsdClock, formatClockTime } from 'stremio/common';
import styles from './ClockOverlay.less';

type Props = {
    className?: string,
};

const ClockOverlay = ({ className }: Props) => {
    const { format } = useOsdClock();
    const [time, setTime] = useState(() => formatClockTime(format));

    useEffect(() => {
        setTime(formatClockTime(format));
        const interval = window.setInterval(() => {
            setTime(formatClockTime(format));
        }, 1000);
        return () => window.clearInterval(interval);
    }, [format]);

    return (
        <div className={className}>
            <span className={styles['clock']}>{time}</span>
        </div>
    );
};

export default ClockOverlay;
