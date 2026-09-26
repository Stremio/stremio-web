// Copyright (C) 2017-2026 Smart code 203358507

import React, { useCallback, useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import classnames from 'classnames';
import Icon from '@stremio/stremio-icons/react';
import { Button } from 'stremio/components';
import ContinueWatchingCard, { ContinueWatchingItem } from './ContinueWatchingCard';
import styles from './ContinueWatchingRow.less';

const SCROLL_THRESHOLD = 1;

type Props = {
    className?: string,
    title: string,
    items: ContinueWatchingItem[],
    href?: string | null,
};

const ContinueWatchingRow = ({ className, title, items, href }: Props) => {
    const { t } = useTranslation();
    const listRef = useRef<HTMLDivElement>(null);
    const [canScrollBack, setCanScrollBack] = useState(false);
    const [canScrollForward, setCanScrollForward] = useState(false);

    const updateScrollState = useCallback(() => {
        const list = listRef.current;
        if (list === null) {
            return;
        }

        setCanScrollBack(list.scrollLeft > SCROLL_THRESHOLD);
        setCanScrollForward(list.scrollLeft + list.clientWidth < list.scrollWidth - SCROLL_THRESHOLD);
    }, []);

    const scrollBy = useCallback((direction: number) => {
        const list = listRef.current;
        if (list !== null) {
            list.scrollBy({ left: direction * list.clientWidth * 0.9, behavior: 'smooth' });
        }
    }, []);

    const onBackClick = useCallback(() => scrollBy(-1), [scrollBy]);
    const onForwardClick = useCallback(() => scrollBy(1), [scrollBy]);

    useEffect(() => {
        updateScrollState();
        const list = listRef.current;
        if (list === null) {
            return;
        }

        const resizeObserver = new ResizeObserver(updateScrollState);
        resizeObserver.observe(list);
        return () => resizeObserver.disconnect();
    }, [items.length, updateScrollState]);

    return (
        <div className={classnames(className, styles['row'])}>
            <div className={styles['header']}>
                <div className={styles['title']} title={title}>{title}</div>
                {
                    canScrollBack || canScrollForward ?
                        <div className={styles['arrows']}>
                            <Button className={classnames(styles['arrow'], { 'disabled': !canScrollBack })} tabIndex={-1} onClick={onBackClick}>
                                <Icon className={styles['arrow-icon']} name={'chevron-back'} />
                            </Button>
                            <Button className={classnames(styles['arrow'], { 'disabled': !canScrollForward })} tabIndex={-1} onClick={onForwardClick}>
                                <Icon className={styles['arrow-icon']} name={'chevron-forward'} />
                            </Button>
                        </div>
                        :
                        null
                }
                {
                    typeof href === 'string' ?
                        <Button className={styles['see-all']} href={href} title={t('BUTTON_SEE_ALL')} tabIndex={-1}>
                            <div className={styles['see-all-label']}>{t('BUTTON_SEE_ALL')}</div>
                            <Icon className={styles['see-all-icon']} name={'chevron-forward'} />
                        </Button>
                        :
                        null
                }
            </div>
            <div ref={listRef} className={styles['list']} onScroll={updateScrollState}>
                {
                    items.map((item) => (
                        <ContinueWatchingCard key={item._id} className={styles['item']} item={item} />
                    ))
                }
            </div>
        </div>
    );
};

export default ContinueWatchingRow;
