// Copyright (C) 2017-2024 Smart code 203358507

import React from 'react';
import classNames from 'clsx';
import Icon from '@stremio/stremio-icons/react';
import styles from './SideDrawerButton.less';

type Props = {
    className: string,
    onClick: () => void,
};

const SideDrawerButton = ({ className, onClick }: Props) => {
    return (
        <div className={classNames(className, styles['side-drawer-button'])} onClick={onClick}>
            <Icon name={'chevron-back'} className={styles['icon']} />
        </div>
    );
};

export default SideDrawerButton;
