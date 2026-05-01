// Copyright (C) 2017-2025 Smart code 203358507

import React, { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import useRating from './useRating';
import { ActionsGroup } from 'stremio/components';

type Props = {
    metaId?: string;
    ratingInfo?: Loadable<RatingInfo>;
    className?: string;
};

const Ratings = ({ ratingInfo, className }: Props) => {
    const { t } = useTranslation();
    const { onLiked, onLoved, liked, loved } = useRating(ratingInfo);
    const disabled = useMemo(() => ratingInfo?.type !== 'Ready', [ratingInfo]);

    const items = useMemo(() => [
        {
            icon: liked ? 'thumbs-up' : 'thumbs-up-outline',
            label: liked ? t('RATING_UNLIKE') : t('RATING_LIKE'),
            disabled,
            onClick: onLiked,
        },
        {
            icon: loved ? 'heart' : 'heart-outline',
            label: loved ? t('RATING_UNLOVE') : t('RATING_LOVE'),
            disabled,
            onClick: onLoved,
        },
    ], [liked, loved, disabled]);

    return (
        <ActionsGroup items={items} className={className} />
    );
};

export default Ratings;
