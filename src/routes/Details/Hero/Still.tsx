// Copyright (C) 2017-2026 Smart code 203358507

import React from 'react';
import classNames from 'classnames';
import Icon from '@stremio/stremio-icons/react';
import Image from 'stremio/components/Image';
import ProgressBar from 'stremio/components/ProgressBar';
import styles from './Still.less';

type Props = {
    className?: string,
    thumbnail: string | null,
    progress: number | null | undefined,
    blurred?: boolean,
};

const renderFallback = () => (
    <div className={styles['placeholder']}>
        <Icon className={styles['icon']} name={'tv'} />
    </div>
);

const Still = ({ className, thumbnail, progress, blurred = false }: Props) => (
    <div className={classNames(className, styles['still'])}>
        {
            typeof thumbnail === 'string' && thumbnail.length > 0 ?
                <Image className={classNames(styles['image'], { [styles['blurred']]: blurred })} src={thumbnail} alt={''} renderFallback={renderFallback} />
                :
                renderFallback()
        }
        {
            typeof progress === 'number' && progress > 0 ?
                <ProgressBar className={styles['progress']} value={progress} />
                :
                null
        }
    </div>
);

export default Still;
