// Copyright (C) 2017-2025 Smart code 203358507

import React, { useMemo } from 'react';
import useRating from './useRating';
import styles from './Ratings.less';
import Icon from '@stremio/stremio-icons/react';
import classNames from 'classnames';

type Props = {
    metaId?: string;
    ratingInfo?: Loadable<RatingInfo>;
    className?: string;
};

const Ratings = ({ ratingInfo, className }: Props) => {
    const { onLiked, onLoved, liked, loved } = useRating(ratingInfo);
    const disabled = useMemo(() => ratingInfo?.type !== 'Ready', [ratingInfo]);

    return (
        <div className={classNames(styles['ratings-container'], className)}>
            <div className={classNames(styles['icon-container'], { [styles['disabled']]: disabled })} onClick={onLiked}>
                <Icon name={liked ? 'thumbs-up' : 'thumbs-up-outline'} className={styles['icon']} />
            </div>
            <div className={classNames(styles['icon-container'], { [styles['disabled']]: disabled })} onClick={onLoved}>
                <Icon name={loved ? 'heart' : 'heart-outline'} className={styles['icon']} />
            </div>
        </div>
    );
};

export default Ratings;
