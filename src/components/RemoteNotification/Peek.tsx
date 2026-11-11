// Copyright (C) 2017-2026 Smart code 203358507

import React, { useCallback, useState } from 'react';
import classNames from 'classnames';
import Icon from '@stremio/stremio-icons/react';
import type { PeekContent } from './useMedia';
import styles from './Peek.less';

const TICKS = 6;

const Peek = ({ background, logo, rows }: PeekContent) => {
    const [broken, setBroken] = useState<string[]>([]);
    const onError = useCallback((event: React.SyntheticEvent<HTMLImageElement>) => {
        const src = event.currentTarget.getAttribute('src');
        if (src !== null) {
            setBroken((broken) => [...broken, src]);
        }
    }, []);

    return (
        <div className={styles['peek']} aria-hidden={'true'}>
            <div className={styles['art']} data-hero-origin={''}>
                <img className={styles['backdrop']} src={background} alt={''} draggable={false} />
                <div className={styles['scrim']} />
            </div>
            <div className={styles['hero']}>
                {
                    logo !== null && !broken.includes(logo) ?
                        <img className={styles['logo']} src={logo} alt={''} draggable={false} onError={onError} />
                        :
                        <div className={styles['wordmark']} />
                }
                <div className={styles['facts']}>
                    <div className={styles['fact']} />
                    <div className={styles['fact']} />
                    <div className={styles['fact']} />
                </div>
                <div className={styles['controls']}>
                    <div className={styles['watch']}>
                        <Icon className={styles['icon']} name={'play'} />
                        <div className={styles['caption']} />
                    </div>
                    <div className={styles['round']}>
                        <Icon className={styles['glyph']} name={'add-to-library'} />
                    </div>
                    <div className={styles['round']}>
                        <Icon className={styles['glyph']} name={'trailer'} />
                    </div>
                </div>
            </div>
            <div className={styles['pager']}>
                {
                    Array.from({ length: TICKS }, (_, index) => (
                        <div key={index} className={styles['tick']} />
                    ))
                }
            </div>
            {
                rows.map((posters, row) => (
                    <div key={row} className={classNames(styles['shelf'], { [styles['leaving']]: row > 0 })}>
                        <div className={styles['row']}>
                            <div className={styles['label']} />
                            <div className={styles['posters']}>
                                {
                                    posters.map((poster, index) => (
                                        broken.includes(poster) ?
                                            <div key={index} className={styles['poster']} />
                                            :
                                            <img key={index} className={styles['poster']} src={poster} alt={''} draggable={false} onError={onError} />
                                    ))
                                }
                            </div>
                        </div>
                    </div>
                ))
            }
        </div>
    );
};

export default Peek;
