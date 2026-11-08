// Copyright (C) 2017-2026 Smart code 203358507

import React from 'react';
import classNames from 'classnames';
import Icon from '@stremio/stremio-icons/react';
import styles from './Row.less';

type Props = {
    label: string,
    description?: string,
    icon?: string,
    control?: 'wide' | 'scale',
    stackOnPhone?: boolean,
    children?: React.ReactNode,
};

const Row = ({ label, description, icon, control, stackOnPhone, children }: Props) => {
    return (
        <div className={classNames(styles['row'], { [styles['stack']]: stackOnPhone })}>
            <div className={styles['heading']}>
                {
                    icon &&
                        <Icon className={styles['icon']} name={icon} />
                }
                <div className={styles['text']}>
                    <div className={styles['label']}>{label}</div>
                    {
                        description &&
                            <p className={styles['description']}>{description}</p>
                    }
                </div>
            </div>
            <div className={classNames(styles['control'], control && styles[control])}>
                {children}
            </div>
        </div>
    );
};

export default Row;
