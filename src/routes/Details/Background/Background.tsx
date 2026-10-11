// Copyright (C) 2017-2026 Smart code 203358507

import React from 'react';
import classNames from 'classnames';
import Image from 'stremio/components/Image';
import styles from './Background.less';

type Props = {
    className?: string,
    src: string | null | undefined,
};

const renderFallback = () => null;

const Background = ({ className, src }: Props) => (
    <div className={classNames(className, styles['background'])} aria-hidden={'true'}>
        {
            typeof src === 'string' && src.length > 0 ?
                <Image className={styles['image']} src={src} alt={''} renderFallback={renderFallback} />
                :
                null
        }
        <div className={styles['tint']} />
    </div>
);

export default Background;
