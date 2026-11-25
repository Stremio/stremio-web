// Copyright (C) 2017-2026 Smart code 203358507

import React, { useMemo, forwardRef, memo } from 'react';
import classNames from 'classnames';
import Icon from '@stremio/stremio-icons/react';
import { CONSTANTS } from 'stremio/common';
import { MetaPreview } from 'stremio/components';
import Episodes from './Episodes';
import Schedule from './Schedule';
import styles from './SideDrawer.less';

type Props = {
    className?: string;
    seriesInfo: SeriesInfo | null;
    metaItem: MetaItem;
    closeSideDrawer: () => void;
    selected: string | undefined;
    isEpg: boolean;
};

const SideDrawer = memo(forwardRef<HTMLDivElement, Props>(({ seriesInfo, className, closeSideDrawer, selected, isEpg, metaItem }: Props, ref) => {
    const links = useMemo(() => {
        return seriesInfo !== null ?
            metaItem.links.filter(({ category }) => category === CONSTANTS.SHARE_LINK_CATEGORY)
            :
            metaItem.links;
    }, [metaItem.links, seriesInfo]);

    const onMouseDown = (event: React.MouseEvent) => {
        event.stopPropagation();
    };

    return (
        <div ref={ref} className={classNames(styles['side-drawer'], className)} onMouseDown={onMouseDown}>
            <div className={styles['close-button']} onClick={closeSideDrawer}>
                <Icon className={styles['icon']} name={'chevron-forward'} />
            </div>
            {
                isEpg ?
                    <Schedule metaItem={metaItem} />
                    :
                    <React.Fragment>
                        <MetaPreview
                            className={styles['info']}
                            name={metaItem.name}
                            logo={metaItem.logo}
                            runtime={metaItem.runtime}
                            releaseInfo={metaItem.releaseInfo}
                            released={metaItem.released}
                            description={metaItem.description}
                            links={links}
                        />
                        {
                            seriesInfo !== null ?
                                <Episodes videos={metaItem.videos} season={seriesInfo.season} selected={selected} />
                                :
                                null
                        }
                    </React.Fragment>
            }
        </div>
    );
}));

export default SideDrawer;
