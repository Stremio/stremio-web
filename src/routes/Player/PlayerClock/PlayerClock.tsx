import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import getEndTime from './getEndTime';
import styles from './PlayerClock.less';

type Props = {
    enabled: boolean,
    controlsVisible: boolean,
    alwaysVisible: boolean,
    time: number | null,
    duration: number | null,
    playbackSpeed: number | null,
    live: boolean,
};

const PlayerClock = ({ enabled, controlsVisible, alwaysVisible, time, duration, playbackSpeed, live }: Props) => {
    const { t } = useTranslation();
    const [now, setNow] = useState(() => new Date());
    const visible = enabled && (controlsVisible || alwaysVisible);
    useEffect(() => {
        if (!visible) return;
        setNow(new Date());
        const timer = setInterval(() => setNow(new Date()), 1000);
        return () => clearInterval(timer);
    }, [visible]);
    if (!visible) return null;
    const formatter = new Intl.DateTimeFormat(undefined, { hour: 'numeric', minute: '2-digit' });
    const end = getEndTime(now, time, duration, playbackSpeed, live);
    return <div className={styles.clock}>
        <time dateTime={now.toISOString()}>{formatter.format(now)}</time>
        {end !== null && <div className={styles['end-time']}>
            <time dateTime={end.toISOString()}>{t('PLAYER_CLOCK_ENDS_AT').replace('%s', formatter.format(end))}</time>
        </div>}
    </div>;
};

export default PlayerClock;
