// Copyright (C) 2017-2026 Smart code 203358507

import React, { useCallback, useState } from 'react';
import classNames from 'classnames';
import Icon from '@stremio/stremio-icons/react';
import type { PeekContent } from './useMedia';
import styles from './Peek.less';

const TABS = 5;
const TICKS = 5;
const CONTROLS = ['play', 'add-to-library', 'trailer'];

const Peek = ({ background, logo, name, facts, shelves }: PeekContent) => {
    const [broken, setBroken] = useState<string[]>([]);
    const onError = useCallback((event: React.SyntheticEvent<HTMLImageElement>) => {
        const src = event.currentTarget.getAttribute('src');
        if (src !== null) {
            setBroken((broken) => [...broken, src]);
        }
    }, []);

    return (
        <div className={styles['peek']} aria-hidden={'true'} data-hero-scene={''}>
            <div className={styles['art']} data-hero-origin={''}>
                <img className={styles['backdrop']} src={background} alt={''} draggable={false} />
                <div className={styles['scrim']} />
            </div>
            <div className={styles['copy']}>
                {
                    logo !== null && !broken.includes(logo) ?
                        <img className={styles['logo']} src={logo} alt={''} draggable={false} onError={onError} />
                        :
                        <div className={styles['name']}>{name}</div>
                }
                {
                    facts.length > 0 ?
                        <div className={styles['facts']}>
                            {
                                facts.map((fact, index) => (
                                    <div key={index} className={styles['fact']}>{fact}</div>
                                ))
                            }
                        </div>
                        :
                        null
                }
                <div className={styles['controls']}>
                    {
                        CONTROLS.map((icon) => (
                            <div key={icon} className={styles['control']}>
                                <Icon className={styles['glyph']} name={icon} />
                            </div>
                        ))
                    }
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
                shelves.map(({ title, posters }, shelf) => (
                    <div key={shelf} className={classNames(styles['shelf'], { [styles['leaving']]: shelf > 0 })}>
                        <div className={styles['row']}>
                            <div className={styles['label']}>{title}</div>
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
            <div className={styles['frame']}>
                <div className={styles['search']} />
                <div className={styles['tabs']}>
                    {
                        Array.from({ length: TABS }, (_, index) => (
                            <div key={index} className={styles['tab']} />
                        ))
                    }
                </div>
            </div>
        </div>
    );
};

export default Peek;
