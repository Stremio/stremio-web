// Copyright (C) 2017-2026 Smart code 203358507

import React from 'react';
import classNames from 'classnames';
import styles from './ProgressBar.less';

type Props = {
    className?: string,
    value: number,
};

const ProgressBar = ({ className, value }: Props) => (
    <div className={classNames(className, styles['progress-bar'])} aria-hidden={'true'}>
        <div className={styles['value']} style={{ width: `${Math.min(100, Math.max(0, value))}%` }} />
    </div>
);

export default ProgressBar;
