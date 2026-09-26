// Copyright (C) 2017-2026 Smart code 203358507

import React from 'react';
import classnames from 'classnames';
import RowHeader from '../RowHeader';
import useRowScroll from '../useRowScroll';
import ContinueWatchingCard, { ContinueWatchingItem } from './ContinueWatchingCard';
import styles from './ContinueWatchingRow.less';

type Props = {
    className?: string,
    title: string,
    items: ContinueWatchingItem[],
    href?: string | null,
};

const ContinueWatchingRow = ({ className, title, items, href }: Props) => {
    const { listRef, canScrollBack, canScrollForward, onScroll, scrollBack, scrollForward } = useRowScroll(items.length);

    return (
        <div className={classnames(className, styles['row'])}>
            <RowHeader
                title={title}
                href={href}
                canScrollBack={canScrollBack}
                canScrollForward={canScrollForward}
                onScrollBack={scrollBack}
                onScrollForward={scrollForward}
            />
            <div ref={listRef} className={styles['list']} onScroll={onScroll}>
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
