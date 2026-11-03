// Copyright (C) 2017-2025 Smart code 203358507

import React from 'react';
import classNames from 'classnames';
import styles from './Item.less';

const ItemPlaceholder = () => {
    return (
        <div className={classNames(styles['item'], styles['placeholder'])}>
            <div className={styles['heading']}>
                <div className={styles['text']} />
            </div>
            <div className={styles['body']}>
                <div className={styles['video']}>
                    <div className={styles['artwork']} />
                    <div className={styles['name']} />
                </div>
            </div>
        </div>
    );
};

export default ItemPlaceholder;
