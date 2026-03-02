// Copyright (C) 2017-2025 Smart code 203358507

import { useMemo, useCallback } from 'react';
import { useServices } from 'stremio/services';

const useRating = (ratingInfo?: Loadable<RatingInfo>) => {
    const { core } = useServices();

    const setRating = useCallback((status: Rating) => {
        core.transport.dispatch({
            action: 'MetaDetails',
            args: {
                action: 'Rate',
                args: status,
            },
        });
    }, []);

    const status = useMemo(() => {
        const content = ratingInfo?.type === 'Ready' ? ratingInfo.content as RatingInfo : null;
        return content?.status;
    }, [ratingInfo]);

    const liked = useMemo(() => {
        return status === 'liked';
    }, [status]);

    const loved = useMemo(() => {
        return status === 'loved';
    }, [status]);

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
