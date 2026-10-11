// Copyright (C) 2017-2026 Smart code 203358507

import React from 'react';
import classNames from 'classnames';
import styles from './ProgressBar.less';

type Props = {
    className?: string,
    value: number,
    live?: boolean,
};

const ProgressBar = ({ className, value, live = false }: Props) => (
    <div className={classNames(className, styles['progress-bar'], { [styles['live']]: live })} aria-hidden={'true'}>
        <div className={styles['value']} style={{ width: `${Math.min(100, Math.max(0, value))}%` }} />
    </div>
);

export default ProgressBar;
