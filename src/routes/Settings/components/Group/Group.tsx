// Copyright (C) 2017-2026 Smart code 203358507

import React from 'react';
import classNames from 'classnames';
import Icon from '@stremio/stremio-icons/react';
import styles from './Group.less';

type Props = {
    className?: string,
    rowId?: string,
    title?: string,
    icon?: string,
    description?: string,
    padded?: boolean,
    children: React.ReactNode,
};

const Group = ({ className, rowId, title, icon, description, padded, children }: Props) => {
    return (
        <section className={classNames(className, styles['group'])} aria-label={title} data-row={rowId}>
            {
                title &&
                    <div className={styles['heading']}>
                        {
                            icon &&
                                <Icon className={styles['icon']} name={icon} />
                        }
                        <h2 className={styles['title']}>{title}</h2>
                    </div>
            }
            {
                description &&
                    <p className={styles['description']}>{description}</p>
            }
            <div className={classNames(styles['card'], { [styles['padded']]: padded })}>
                {children}
            </div>
        </section>
    );
};

export default Group;
