// Copyright (C) 2017-2026 Smart code 203358507

import React, { useCallback } from 'react';
import classNames from 'classnames';
import Image from 'stremio/components/Image';
import styles from './Rating.less';

type Props = {
    className?: string,
    rating: ContentRating,
};

const Rating = ({ className, rating }: Props) => {
    const renderFallback = useCallback(() => rating.value, [rating.value]);

    return (
        <div className={classNames(className, styles['rating'])} title={rating.system ? `${rating.system}: ${rating.value}` : rating.value}>
            {
                rating.icon ?
                    <Image className={styles['icon']} src={rating.icon} alt={rating.value} renderFallback={renderFallback} />
                    :
                    rating.value
            }
        </div>
    );
};

export default Rating;
