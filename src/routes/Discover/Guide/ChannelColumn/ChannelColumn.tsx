// Copyright (C) 2017-2026 Smart code 203358507

import React from 'react';
import { Button } from 'stremio/components';
import { EPGChannel } from 'stremio/common/EPG';
import Logo from './Logo';
import styles from './ChannelColumn.less';

type Props = {
    innerRef: React.RefObject<HTMLDivElement>;
    width: number;
    rowHeight: number;
    channels: EPGChannel[];
    skeletonRows: number;
    style?: React.CSSProperties;
};

const ChannelColumn = ({ innerRef, width, rowHeight, channels, skeletonRows, style }: Props) => (
    <div className={styles['channel-column']} style={{ width }}>
        <div ref={innerRef} className={styles['inner']} style={style}>
            {
                skeletonRows > 0 ?
                    Array.from({ length: skeletonRows }, (_, index) => (
                        <div key={index} className={styles['cell']} style={{ height: rowHeight }}>
                            <div className={styles['skeleton']} />
                        </div>
                    ))
                    :
                    channels.map((channel) => (
                        <Button
                            key={channel.id}
                            className={styles['cell']}
                            style={{ height: rowHeight }}
                            href={channel.deepLinks?.metaDetailsStreams ?? channel.deepLinks?.metaDetailsVideos ?? undefined}
                            title={channel.name}
                        >
                            <Logo src={channel.logo} name={channel.name} />
                        </Button>
                    ))
            }
        </div>
    </div>
);

export default ChannelColumn;
