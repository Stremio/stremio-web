// Copyright (C) 2017-2026 Smart code 203358507

import React from 'react';
import classNames from 'classnames';
import Icon from '@stremio/stremio-icons/react';
import styles from './Row.less';

type Props = {
    className?: string,
    label?: string,
    description?: string,
    icon?: string,
    control?: 'wide' | 'scale',
    variant?: 'thin' | 'end' | 'keys',
    stackOnPhone?: boolean,
    children?: React.ReactNode,
};

const Row = ({ className, label, description, icon, control, variant, stackOnPhone, children }: Props) => {
    return (
        <div className={classNames(className, styles['row'], variant && styles[variant], { [styles['stack']]: stackOnPhone })}>
            {
                label &&
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
            }
            <div className={classNames(styles['control'], control && styles[control])}>
                {children}
            </div>
        </div>
    );
};

export default Row;
