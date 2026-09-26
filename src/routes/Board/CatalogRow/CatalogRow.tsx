// Copyright (C) 2017-2026 Smart code 203358507

import React, { useMemo } from 'react';
import classnames from 'classnames';
import Icon from '@stremio/stremio-icons/react';
import RowHeader from '../RowHeader';
import useRowScroll from '../useRowScroll';
import styles from './CatalogRow.less';

// MetaItem is untyped JS; typed loosely like other JS modules used from TS.
const MetaItem: React.ComponentType<Record<string, unknown>> = require('stremio/components/MetaItem');

const MAX_ITEMS = 20;
const PLACEHOLDER_ITEMS = 10;
const IMDB_LINK_CATEGORY = 'imdb';

type Props = {
    className?: string,
    title: string | null,
    source?: string | null,
    catalog: Catalog<Loadable<MetaItemPreviewCatalogsWithExtra[]> | null, DiscoverDeepLinks>,
};

const getShape = (items: MetaItemPreviewCatalogsWithExtra[]) => {
    const shape = items[0]?.posterShape;
    return shape === 'landscape' || shape === 'square' ? shape : 'poster';
};

const getErrorMessage = (error: LoadableError) => {
    return typeof error === 'string' ? error : error?.content?.message ?? null;
};

const InfoStrip = ({ item }: { item: MetaItemPreviewCatalogsWithExtra }) => {
    const rating = item.links?.find(({ category }) => category === IMDB_LINK_CATEGORY)?.name ?? null;
    const year = typeof item.releaseInfo === 'string' && item.releaseInfo.length > 0 ? item.releaseInfo : null;

    if (rating === null && year === null) {
        return null;
    }

    return (
        <div className={styles['info-strip']}>
            {year !== null ? <div className={styles['info-item']}>{year}</div> : null}
            {
                rating !== null ?
                    <div className={classnames(styles['info-item'], styles['rating'])}>
                        <Icon className={styles['rating-icon']} name={'imdb'} />
                        {rating}
                    </div>
                    :
                    null
            }
        </div>
    );
};

const CatalogRow = ({ className, title, source, catalog }: Props) => {
    const content = catalog.content;
    const items = useMemo(() => {
        return content?.type === 'Ready' ? content.content.slice(0, MAX_ITEMS) : [];
    }, [content]);
    const shape = getShape(items);
    const { listRef, canScrollBack, canScrollForward, onScroll, scrollBack, scrollForward } = useRowScroll(items.length);
    const href = catalog.deepLinks?.discover ?? null;

    return (
        <div className={classnames(className, styles['catalog-row'], styles[`shape-${shape}`])}>
            <RowHeader
                title={title}
                source={source}
                href={href}
                canScrollBack={canScrollBack}
                canScrollForward={canScrollForward}
                onScrollBack={scrollBack}
                onScrollForward={scrollForward}
            />
            {
                content?.type === 'Err' ?
                    <div className={styles['message']}>{getErrorMessage(content.content)}</div>
                    :
                    content?.type === 'Ready' ?
                        <div ref={listRef} className={styles['list']} onScroll={onScroll}>
                            {
                                items.map((item, index) => (
                                    <MetaItem
                                        {...item}
                                        key={`${item.id}-${index}`}
                                        className={styles['item']}
                                        poster={{ src: item.poster, shape: item.posterShape, overlay: <InfoStrip item={item} /> }}
                                    />
                                ))
                            }
                        </div>
                        :
                        <div className={classnames(styles['list'], styles['placeholder'])}>
                            {
                                Array(PLACEHOLDER_ITEMS).fill(null).map((_, index) => (
                                    <div key={index} className={styles['placeholder-item']}>
                                        <div className={styles['placeholder-poster']} />
                                        <div className={styles['placeholder-title']} />
                                    </div>
                                ))
                            }
                        </div>
            }
        </div>
    );
};

export default CatalogRow;
