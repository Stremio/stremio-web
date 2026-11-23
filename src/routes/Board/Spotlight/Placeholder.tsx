// Copyright (C) 2017-2026 Smart code 203358507

import React from 'react';
import classNames from 'classnames';
import styles from './Placeholder.less';

type Props = {
    className?: string,
};

const Placeholder = ({ className }: Props) => (
    <div className={classNames(className, styles['placeholder'])}>
        <div className={styles['content']}>
            <div className={classNames(styles['bone'], styles['logo'])} />
            <div className={classNames(styles['bone'], styles['facts'])} />
            <div className={styles['lines']}>
                <div className={classNames(styles['bone'], styles['line'])} />
                <div className={classNames(styles['bone'], styles['line'])} />
            </div>
            <div className={styles['actions']}>
                <div className={classNames(styles['bone'], styles['watch'])} />
                <div className={classNames(styles['bone'], styles['round'])} />
                <div className={classNames(styles['bone'], styles['round'])} />
            </div>
        </div>
    </div>
);

export default Placeholder;
