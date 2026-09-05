// Copyright (C) 2017-2026 Smart code 203358507

import React from 'react';
import { useCore } from 'stremio/core';
import LibItem from 'stremio/components/LibItem';
import { useEpgNow, getEpgProgress, getNonEmptyString, hasEpgProgramTimes } from 'stremio/common/EPG';

type Show = {
    title?: string | null,
    thumbnail?: string | null,
    startTime?: string,
    endTime?: string,
    deepLinks?: Partial<VideoDeepLinks>,
};

type Props = {
    className?: string,
    channel?: Partial<MetaItemPreview>,
    deepLinks?: Partial<MetaItemDeepLinks>,
    shows?: Show[],
    notifications?: Notifications,
};

const getCurrentShow = (shows: Show[] | undefined, now: number): Show | null => {
    const programs = (Array.isArray(shows) ? shows : []).filter(hasEpgProgramTimes);

    return programs.find((show) => getEpgProgress(show, now) !== null) ?? programs[0] ?? null;
};

const LiveTvContinueWatchingItem = ({ className, channel, deepLinks, shows, notifications }: Props) => {
    const core = useCore();
    const now = useEpgNow(true);
    const currentShow = React.useMemo(() => getCurrentShow(shows, now), [shows, now]);
    const progress = currentShow !== null ? getEpgProgress(currentShow, now) : null;
    const poster = getNonEmptyString(currentShow?.thumbnail) ?? channel?.poster ?? channel?.logo;
    const name = getNonEmptyString(currentShow?.title) ?? channel?.name;
    const itemDeepLinks = React.useMemo(() => ({
        ...deepLinks,
        ...currentShow?.deepLinks,
    }), [deepLinks, currentShow]);
    const channelId = channel && channel.id;
    const onDismissClick = React.useCallback((event: React.MouseEvent) => {
        event.preventDefault();
        if (typeof channelId === 'string') {
            core.transport.dispatch({
                action: 'Ctx',
                args: { action: 'RemoveFromLibrary', args: channelId },
            });
            core.transport.dispatch({
                action: 'Ctx',
                args: { action: 'DismissNotificationItem', args: channelId },
            });
        }
    }, [core, channelId]);

    return (
        <LibItem
            className={className}
            _id={channel?.id}
            type={channel?.type}
            name={name}
            poster={poster}
            posterShape={'landscape'}
            posterChangeCursor={true}
            logo={getNonEmptyString(channel?.logo)}
            progress={progress ?? 0}
            deepLinks={itemDeepLinks}
            notifications={notifications}
            onDismissClick={onDismissClick}
        />
    );
};

export default LiveTvContinueWatchingItem;
