// Copyright (C) 2017-2026 Smart code 203358507

import React from 'react';
import classNames from 'classnames';
import Icon from '@stremio/stremio-icons/react';
import styles from './WatchedBadge.less';

type Props = {
    className?: string,
};

const WatchedBadge = ({ className }: Props) => (
    <div className={classNames(className, styles['watched-badge'])}>
        <Icon className={styles['icon']} name={'checkmark'} />
    </div>
);

export default WatchedBadge;
