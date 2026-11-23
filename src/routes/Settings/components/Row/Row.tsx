// Copyright (C) 2017-2026 Smart code 203358507

import React, { useCallback, useContext, useState } from 'react';
import classNames from 'classnames';
import Icon from '@stremio/stremio-icons/react';
import SearchHitContext from '../../SearchHitContext';
import styles from './Row.less';

type Props = {
    className?: string,
    rowId?: string,
    label?: string,
    description?: string,
    icon?: string,
    control?: 'wide' | 'scale',
    variant?: 'thin' | 'end' | 'keys',
    stackOnPhone?: boolean,
    children?: React.ReactNode,
};

const Row = ({ className, rowId, label, description, icon, control, variant, stackOnPhone, children }: Props) => {
    const hit = useContext(SearchHitContext) === rowId && rowId !== undefined;
    const [focused, setFocused] = useState(false);

    const onFocus = useCallback((event: React.FocusEvent<HTMLDivElement>) => {
        if (event.target === event.currentTarget) setFocused(true);
    }, []);

    const onBlur = useCallback((event: React.FocusEvent<HTMLDivElement>) => {
        if (event.target === event.currentTarget) setFocused(false);
    }, []);

    return (
        <div
            className={classNames(className, styles['row'], variant && styles[variant], { [styles['stack']]: stackOnPhone, [styles['hit']]: hit })}
            data-row={rowId}
            tabIndex={hit || focused ? -1 : undefined}
            onFocus={onFocus}
            onBlur={onBlur}
        >
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
