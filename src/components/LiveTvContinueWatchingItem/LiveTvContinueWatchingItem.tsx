// Copyright (C) 2017-2026 Smart code 203358507

import React from 'react';
import classNames from 'classnames';
import { useCore } from 'stremio/core';
import Image from 'stremio/components/Image';
import LibItem from 'stremio/components/LibItem';
import { useEpgNow, getEpgProgress, getNonEmptyString } from 'stremio/common/EPG';
import styles from './LiveTvContinueWatchingItem.less';

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
    return (Array.isArray(shows) ? shows : []).find((show) => getEpgProgress(show, now) !== null) ?? null;
};

const LiveTvContinueWatchingItem = ({ className, channel, deepLinks, shows, notifications }: Props) => {
    const core = useCore();
    const now = useEpgNow(true);
    const currentShow = React.useMemo(() => getCurrentShow(shows, now), [shows, now]);
    const programPoster = getNonEmptyString(currentShow?.thumbnail);
    const programName = getNonEmptyString(currentShow?.title);
    const hasProgram = Boolean(programPoster || programName);
    const channelName = getNonEmptyString(channel?.name);
    const channelLogo = getNonEmptyString(channel?.logo) ?? getNonEmptyString(channel?.poster);
    const progress = hasProgram && currentShow !== null ? getEpgProgress(currentShow, now) : null;
    const posterSrc = hasProgram ? programPoster ?? getNonEmptyString(channel?.background) : channelLogo;
    const name = programName ?? channelName;
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

    const poster = React.useMemo(() => ({
        src: posterSrc,
        shape: 'landscape',
        changeCursor: true,
        overlay: hasProgram && (channelLogo || channelName) ?
            <div className={styles['channel-badge']} title={channelName ?? undefined}>
                {
                    channelLogo &&
                        <Image src={channelLogo} alt={''} renderFallback={() => null} />
                }
                {
                    channelName &&
                        <span>{channelName}</span>
                }
            </div>
            :
            null,
    }), [posterSrc, hasProgram, channelLogo, channelName]);

    return (
        <LibItem
            className={classNames(className, styles['live-item'], { [styles['channel-card']]: !hasProgram })}
            _id={channel?.id}
            type={channel?.type}
            name={name}
            poster={poster}
            progress={progress ?? 0}
            deepLinks={deepLinks}
            notifications={notifications}
            onDismissClick={onDismissClick}
        />
    );
};

export default LiveTvContinueWatchingItem;
