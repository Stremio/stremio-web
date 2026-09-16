// Copyright (C) 2017-2026 Smart code 203358507

import React from 'react';
import { getEpgSkeletonPrograms } from 'stremio/common/EPG';
import styles from './Skeleton.less';

type Props = {
    rows: number;
    rowHeight: number;
    width: number;
    pixelsPerHour: number;
};

const Skeleton = ({ rows, rowHeight, width, pixelsPerHour }: Props) => (
    <React.Fragment>
        {Array.from({ length: rows }, (_, rowIndex) => (
            <div key={rowIndex} className={styles['row']} style={{ height: rowHeight, width }}>
                {getEpgSkeletonPrograms(rowIndex).map((program) => (
                    <div
                        key={program.index}
                        className={styles['program']}
                        style={{ left: (program.startMinutes / 60) * pixelsPerHour, width: (program.durationMinutes / 60) * pixelsPerHour }}
                    >
                        <div className={styles['program-inner']}>
                            <div className={styles['thumb']} />
                            <div className={styles['content']}>
                                <div className={styles['title']} />
                                <div className={styles['time']} />
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        ))}
    </React.Fragment>
);

export default Skeleton;
