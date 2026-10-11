// Copyright (C) 2017-2026 Smart code 203358507

import React from 'react';
import { useTranslation } from 'react-i18next';
import useRating from 'stremio/components/MetaPreview/Ratings/useRating';
import ToggleButton from './ToggleButton';
import RateButton from './RateButton';

export type GroupsProps = {
    inLibrary: boolean,
    onToggleLibrary: () => void,
    watched?: boolean,
    onToggleWatched?: () => void,
    ratingInfo?: Loadable<RatingInfo> | null,
};

type Props = GroupsProps & {
    className: string,
};

const Groups = ({ className, inLibrary, onToggleLibrary, watched, onToggleWatched, ratingInfo = null }: Props) => {
    const { t } = useTranslation();
    const { onLiked, onLoved, liked, loved } = useRating(ratingInfo ?? undefined);

    return (
        <React.Fragment>
            <div className={className} role={'group'}>
                <ToggleButton
                    variant={'library'}
                    on={inLibrary}
                    label={inLibrary ? t('REMOVE_FROM_LIB') : t('ADD_TO_LIB')}
                    onClick={onToggleLibrary}
                />
                {
                    typeof onToggleWatched === 'function' ?
                        <ToggleButton
                            variant={'watched'}
                            on={watched === true}
                            label={watched ? t('CTX_MARK_UNWATCHED') : t('CTX_MARK_WATCHED')}
                            onClick={onToggleWatched}
                        />
                        :
                        null
                }
            </div>
            {
                ratingInfo !== null ?
                    <div className={className} role={'group'}>
                        <RateButton
                            icon={liked ? 'thumbs-up' : 'thumbs-up-outline'}
                            on={liked}
                            disabled={ratingInfo.type !== 'Ready'}
                            label={liked ? t('RATING_UNLIKE') : t('RATING_LIKE')}
                            onClick={onLiked}
                        />
                        <RateButton
                            icon={loved ? 'heart' : 'heart-outline'}
                            on={loved}
                            disabled={ratingInfo.type !== 'Ready'}
                            label={loved ? t('RATING_UNLOVE') : t('RATING_LOVE')}
                            onClick={onLoved}
                        />
                    </div>
                    :
                    null
            }
        </React.Fragment>
    );
};

export default Groups;
