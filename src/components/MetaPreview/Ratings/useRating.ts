// Copyright (C) 2017-2025 Smart code 203358507

import { useMemo, useCallback, useState, useEffect } from 'react';
import { useServices } from 'stremio/services';

const useRating = (ratingInfo?: Loadable<RatingInfo>) => {
    const { core } = useServices();

    const setRating = useCallback(async (status: Rating) => {
        await core.transport.dispatch({
            action: 'MetaDetails',
            args: {
                action: 'Rate',
                args: status,
            },
        });
    }, []);

    // optimistic local status so UI updates immediately
    const [localStatus, setLocalStatus] = useState<Rating | null>(null);

    const status = useMemo(() => {
        const content = ratingInfo?.type === 'Ready' ? ratingInfo.content as RatingInfo : null;
        return localStatus !== null ? localStatus : (content?.status ?? null);
    }, [ratingInfo, localStatus]);

    const liked = useMemo(() => {
        return status === 'liked';
    }, [status]);

    const loved = useMemo(() => {
        return status === 'loved';
    }, [status]);

    const onLiked = useCallback(() => {
        const next = status === 'liked' ? null : 'liked';
        setLocalStatus(next);
        setRating(next);
    }, [status]);

    const onLoved = useCallback(() => {
        const next = status === 'loved' ? null : 'loved';
        setLocalStatus(next);
        setRating(next);
    }, [status]);

    // clear local override when server state changes
    useEffect(() => {
        const content = ratingInfo?.type === 'Ready' ? ratingInfo.content as RatingInfo : null;
        if (localStatus !== null && content?.status !== localStatus) {
            setLocalStatus(null);
        }
    }, [ratingInfo, localStatus]);

    return {
        onLiked,
        onLoved,
        liked,
        loved,
    };
};

export default useRating;
