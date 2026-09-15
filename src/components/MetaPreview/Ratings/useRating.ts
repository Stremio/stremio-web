// Copyright (C) 2017-2025 Smart code 203358507

import { useCallback } from 'react';
import { useCore } from 'stremio/core';

const useRating = (ratingInfo?: Loadable<RatingInfo>) => {
    const core = useCore();

    const setRating = useCallback((status: Rating) => {
        core.transport.dispatch({
            action: 'MetaDetails',
            args: {
                action: 'Rate',
                args: status,
            },
        });
    }, []);

    const content = ratingInfo?.type === 'Ready' ? ratingInfo.content as RatingInfo : null;
    const status = content?.status;
    const liked = status === 'liked';
    const loved = status === 'loved';

    const onLiked = useCallback(() => {
        setRating(status === 'liked' ? null : 'liked');
    }, [status]);

    const onLoved = useCallback(() => {
        setRating(status === 'loved' ? null : 'loved');
    }, [status]);

    return {
        onLiked,
        onLoved,
        liked,
        loved,
    };
};

export default useRating;
