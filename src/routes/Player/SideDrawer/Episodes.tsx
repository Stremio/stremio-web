// Copyright (C) 2017-2026 Smart code 203358507

import React, { useCallback, useMemo, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router';
import { toPath } from 'stremio-router';
import { useCore } from 'stremio/core';
import { usePlatform } from 'stremio/common/Platform';
import useProfile from 'stremio/common/useProfile';
import useSeasons from 'stremio/common/useSeasons';
import { formatDate } from 'stremio/routes/Details/format';
import SeasonPicker from 'stremio/routes/Details/Videos/SeasonPicker';
import VideoRow from 'stremio/routes/Details/Videos/Video';
import styles from './SideDrawer.less';

type Props = {
    videos: Video[],
    season: number,
    selected: string | undefined,
};

const Episodes = ({ videos: allVideos, season: initialSeason, selected }: Props) => {
    const { i18n } = useTranslation();
    const core = useCore();
    const profile = useProfile();
    const platform = usePlatform();
    const navigate = useNavigate();
    const [season, setSeason] = useState<number | null>(initialSeason);
    const listRef = useRef<HTMLDivElement>(null);

    const { selectedSeason, videos, options } = useSeasons(allVideos, season, null);
    const seasonWatched = useMemo(() => videos.every((video) => video.watched), [videos]);

    const onSeasonSelect = useCallback((season: number) => {
        setSeason(season);
        listRef.current?.scrollTo({ top: 0, left: 0 });
    }, []);

    const openEpisode = useCallback((href: string) => {
        navigate(toPath(href), { replace: !platform.isMobile });
    }, [navigate, platform.isMobile]);

    const onMarkVideoWatched = useCallback((video: Pick<Video, 'id' | 'released'>, watched: boolean) => {
        core.transport.dispatch({
            action: 'Player',
            args: {
                action: 'MarkVideoAsWatched',
                args: [video, watched],
            },
        });
    }, [core]);

    const onMarkSeasonWatched = useCallback((season: number, watched: boolean) => {
        core.transport.dispatch({
            action: 'Player',
            args: {
                action: 'MarkSeasonAsWatched',
                args: [season, watched],
            },
        });
    }, [core]);

    return (
        <React.Fragment>
            {
                options.length > 1 ?
                    <SeasonPicker
                        className={styles['seasons']}
                        options={options}
                        value={selectedSeason}
                        onSelect={onSeasonSelect}
                    />
                    :
                    null
            }
            <div ref={listRef} className={styles['videos']}>
                {
                    videos.map((video) => (
                        <VideoRow
                            key={video.id}
                            video={video}
                            releasedLabel={formatDate(video.released, i18n.language)}
                            hideSpoilers={profile.settings.hideSpoilers}
                            openEpisode={openEpisode}
                            selected={video.id === selected}
                            seasonWatched={seasonWatched}
                            minutesLeft={null}
                            onMarkVideoWatched={onMarkVideoWatched}
                            onMarkSeasonWatched={onMarkSeasonWatched}
                        />
                    ))
                }
            </div>
        </React.Fragment>
    );
};

export default Episodes;
