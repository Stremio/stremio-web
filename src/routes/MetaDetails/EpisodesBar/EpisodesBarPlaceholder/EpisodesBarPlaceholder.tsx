// Copyright (C) 2017-2024 Smart code 203358507

import React from 'react';
import classnames from 'classnames';
import Icon from '@stremio/stremio-icons/react';
import styles from './styles.less';

type Props = {
    className?: string;
};

const EpisodesBarPlaceholder = ({ className }: Props) => {
    return (
        <div className={classnames(className, styles['episodes-bar-placeholder-container'])}>
        <div className={styles['prev-episode-button']}>
            <Icon className={styles['icon']} name={'chevron-back'} />
            <div className={styles['label']}>Prev</div>
        </div>
        <div className={styles['episodes-popup-label-container']}>
            <div className={styles['episodes-popup-label']}>Episode 1</div>
            <Icon className={styles['episodes-popup-icon']} name={'caret-down'} />
        </div>
        <div className={styles['next-episode-button']}>
            <div className={styles['label']}>Next</div>
            <Icon className={styles['icon']} name={'chevron-forward'} />
        </div>
    </div>
    );
};

export default EpisodesBarPlaceholder;