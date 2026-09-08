// Copyright (C) 2017-2026 Smart code 203358507

import React from 'react';
import { useTranslation } from 'react-i18next';
import styles from './LiveTvPlaceholder.less';

const LiveTvPlaceholder = () => {
    const { t } = useTranslation();
    return <div className={styles['placeholder']} role={'status'} aria-label={t('STREAM_LOADING')}>
        <div className={styles['channel']} aria-hidden={'true'}>
            <div className={styles['identity']} />
            <div className={styles['title']} />
            <div className={styles['description']} />
            <div className={styles['action']} />
        </div>
        <div className={styles['schedule']} aria-hidden={'true'}>
            <div /><div /><div />
        </div>
    </div>;
};

export default LiveTvPlaceholder;
