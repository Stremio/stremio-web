// Copyright (C) 2017-2026 Smart code 203358507

import React from 'react';
import { useTranslation } from 'react-i18next';
import classNames from 'classnames';
import styles from './Placeholder.less';

type Props = {
    className?: string,
    variant: 'hero' | 'list',
};

const ROWS = [0, 1, 2, 3, 4, 5];

const Placeholder = ({ className, variant }: Props) => {
    const { t } = useTranslation();

    return (
        <div className={classNames(className, styles['placeholder'], styles[variant])} role={'status'} aria-label={t('STREAM_LOADING')}>
            {
                variant === 'hero' ?
                    <React.Fragment>
                        <div className={styles['logo']} />
                        <div className={styles['row']}>
                            <div className={styles['fact']} />
                            <div className={styles['fact']} />
                            <div className={styles['fact']} />
                        </div>
                        <div className={styles['line']} />
                        <div className={styles['line']} />
                        <div className={classNames(styles['line'], styles['short'])} />
                        <div className={styles['row']}>
                            <div className={styles['pill']} />
                            <div className={styles['pill']} />
                            <div className={styles['pill']} />
                        </div>
                        <div className={styles['spacer']} />
                        <div className={styles['row']}>
                            <div className={styles['action']} />
                            <div className={styles['circle']} />
                            <div className={styles['circle']} />
                        </div>
                    </React.Fragment>
                    :
                    <React.Fragment>
                        <div className={styles['control']} />
                        {
                            ROWS.map((row) => (
                                <div key={row} className={styles['item']}>
                                    <div className={styles['thumbnail']} />
                                    <div className={styles['text']}>
                                        <div className={styles['line']} />
                                        <div className={classNames(styles['line'], styles['short'])} />
                                    </div>
                                </div>
                            ))
                        }
                    </React.Fragment>
            }
        </div>
    );
};

export default Placeholder;
