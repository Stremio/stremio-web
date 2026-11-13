// Copyright (C) 2017-2026 Smart code 203358507

import React from 'react';
import { useEpgNow } from 'stremio/common/EPG/useEpgNow';
import styles from './PlayerClock.less';

type Props = {
    visible: boolean,
};

const PlayerClock = ({ visible }: Props) => {
    const now = useEpgNow(visible, 1000);
    if (!visible) return null;
    const date = new Date(now);
    return (
        <time className={styles.clock} dateTime={date.toISOString()}>
            {new Intl.DateTimeFormat(undefined, { hour: 'numeric', minute: '2-digit' }).format(date)}
        </time>
    );
};

export default PlayerClock;
