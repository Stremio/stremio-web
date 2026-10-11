// Copyright (C) 2017-2026 Smart code 203358507

import React from 'react';
import { useTranslation } from 'react-i18next';
import classNames from 'classnames';
import styles from './Placeholder.less';

type Props = {
    className?: string,
    variant: 'hero' | 'control' | 'list',
};

const ROWS = [0, 1, 2, 3, 4, 5];

const Placeholder = ({ className, variant }: Props) => {
    const { t } = useTranslation();

    return (
        <div className={classNames(className, styles['placeholder'], styles[variant])} role={'status'} aria-label={t('STREAM_LOADING')}>
            {
                variant === 'hero' ?
                    <React.Fragment>
                        <div className={styles['art']}>
                            <div className={styles['logo']} />
                        </div>
                        <div className={classNames(styles['row'], styles['facts'])}>
                            <div className={styles['fact']} />
                            <div className={styles['fact']} />
                            <div className={styles['fact']} />
                        </div>
                        <div className={styles['line']} />
                        <div className={styles['line']} />
                        <div className={classNames(styles['line'], styles['short'])} />
                        <div className={classNames(styles['row'], styles['links'])}>
                            <div className={styles['pill']} />
                            <div className={styles['pill']} />
                            <div className={styles['pill']} />
                        </div>
                        <div className={styles['spacer']} />
                        <div className={classNames(styles['row'], styles['actions'])}>
                            <div className={styles['action']} />
                            <div className={styles['group']} />
                            <div className={styles['circle']} />
                        </div>
                    </React.Fragment>
                    :
                    variant === 'control' ?
                        <div className={styles['bar']} />
                        :
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
        </div>
    );
};

export default Placeholder;
