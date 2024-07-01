// Copyright (C) 2017-2023 Smart code 203358507

import React from 'react';
import classnames from 'classnames';
import Icon from '@stremio/stremio-icons/react';
import styles from './styles.less';

type Props = {
    className?: string;
};

const SeasonsBarPlaceholder = ({ className }: Props) => {
    return (
        <div className={classnames(className, styles['seasons-bar-placeholder-container'])}>
            <div className={styles['prev-season-button']}>
                <Icon className={styles['icon']} name={'chevron-back'} />
                <div className={styles['label']}>Prev</div>
            </div>
            <div className={styles['seasons-popup-label-container']}>
                <div className={styles['seasons-popup-label']}>Season 1</div>
                <Icon className={styles['seasons-popup-icon']} name={'caret-down'} />
            </div>
            <div className={styles['next-season-button']}>
                <div className={styles['label']}>Next</div>
                <Icon className={styles['icon']} name={'chevron-forward'} />
            </div>
        </div>
    );
};

export default SeasonsBarPlaceholder;