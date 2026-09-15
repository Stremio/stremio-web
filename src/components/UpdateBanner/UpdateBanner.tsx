// Copyright (C) 2017-2026 Smart code 203358507

import React from 'react';
import Icon from '@stremio/stremio-icons/react';
import Button from '../Button';
import Transition from '../Transition';
import styles from './UpdateBanner.less';

type Props = {
    className?: string,
    visible: boolean,
    label: string,
    actionLabel: string,
    closeLabel: string,
    onAction: () => void,
    onClose: () => void,
};

const UpdateBanner = ({ className, visible, label, actionLabel, closeLabel, onAction, onClose }: Props) => (
    <div className={className}>
        <Transition when={visible} name={'slide-up'}>
            <div className={styles['update-banner']} role={'status'}>
                <div className={styles['label']}>
                    {label}
                </div>
                <Button className={styles['button']} onClick={onAction}>
                    {actionLabel}
                </Button>
                <Button className={styles['close']} title={closeLabel} onClick={onClose}>
                    <Icon className={styles['icon']} name={'close'} />
                </Button>
            </div>
        </Transition>
    </div>
);

export default UpdateBanner;
