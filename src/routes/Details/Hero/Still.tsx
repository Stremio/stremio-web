// Copyright (C) 2017-2026 Smart code 203358507

import React from 'react';
import classNames from 'classnames';
import Icon from '@stremio/stremio-icons/react';
import Image from 'stremio/components/Image';
import styles from './Still.less';

type Props = {
    className?: string,
    thumbnail: string | null,
    blurred?: boolean,
};

const renderFallback = () => (
    <div className={styles['placeholder']}>
        <Icon className={styles['icon']} name={'tv'} />
    </div>
);

const Still = ({ className, thumbnail, blurred = false }: Props) => (
    <div className={classNames(className, styles['still'])}>
        {
            typeof thumbnail === 'string' && thumbnail.length > 0 ?
                <Image className={classNames(styles['image'], { [styles['blurred']]: blurred })} src={thumbnail} alt={''} renderFallback={renderFallback} />
                :
                renderFallback()
        }
    </div>
);

export default Still;
