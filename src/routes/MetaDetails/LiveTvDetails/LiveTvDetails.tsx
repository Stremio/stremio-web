// Copyright (C) 2017-2026 Smart code 203358507

import React, { useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import classNames from 'classnames';
import Icon from '@stremio/stremio-icons/react';
import { useCore } from 'stremio/core';
import Image from 'stremio/components/Image';
import { useRouteActive } from 'stremio/common/useRouteFocused';
import useMediaQuery from 'stremio/common/useMediaQuery';
import { XSMALL_WIDTH } from 'stremio/common/screenSizes';
import { EPGProgram, formatEpgTimeRange, getEpgProgress, toEpgProgram, useEpgNow } from 'stremio/common/EPG';
import LiveTvActions from './LiveTvActions';
import LiveTvPlayback from './LiveTvPlayback';
import LiveTvSchedule from './LiveTvSchedule';
import styles from './LiveTvDetails.less';

type Props = {
    className: string;
    contentRef: React.Ref<HTMLDivElement>;
    children: React.ReactNode;
    meta: MetaItemMetaDetails;
    addonName: string;
    streams: MetaDetails['streams'];
    onToggleLibrary: () => void;
};

const programKey = (program: EPGProgram) => program.id ?? `${program.channelId}:${program.startTime.getTime()}`;

const LiveTvDetails = ({ className, contentRef, children, meta, addonName, streams, onToggleLibrary }: Props) => {
    const { t, i18n } = useTranslation();
    const core = useCore();
    const active = useRouteActive();
    const isMobile = useMediaQuery(`(max-width: ${XSMALL_WIDTH}px)`);
    const now = useEpgNow(true);
    const [selectedKey, setSelectedKey] = useState<string | null>(null);
    const channel = useMemo(() => ({
        id: meta.id, type: meta.type, name: meta.name, logo: meta.logo ?? meta.poster, deepLinks: meta.deepLinks,
    }), [meta.id, meta.type, meta.name, meta.logo, meta.poster, meta.deepLinks]);
    const programs = useMemo(() => meta.videos
        .map((video) => toEpgProgram(video, channel))
        .filter((program): program is EPGProgram => program !== null)
        .sort((a, b) => a.startTime.getTime() - b.startTime.getTime()), [meta.videos, channel]);
    const selected = programs.find((program) => programKey(program) === selectedKey)
        ?? programs.find((program) => program.endTime.getTime() > now)
        ?? programs[programs.length - 1] ?? null;
    const progress = selected ? getEpgProgress(selected, now) : null;
    const artwork = selected?.thumbnail ?? meta.background;
    const dateLabel = selected?.startTime.toLocaleDateString(i18n.language, { weekday: 'long', month: 'short', day: 'numeric' });
    const genres = selected?.genres?.length ? selected.genres
        : selected?.links?.filter(({ category }) => category === 'Genres').map(({ name }) => name) ?? [];
    const renderChannelBackdrop = () => channel.logo ? <Image className={classNames(styles['backdrop-image'], styles['channel-artwork'])} src={channel.logo} alt={''} renderFallback={() => null} /> : null;

    useEffect(() => {
        if (active) core.transport.dispatch({ action: 'MetaDetails', args: { action: 'RefreshLive' } }, 'meta_details');
    }, [active, core, meta.id, now]);

    return (
        <div className={classNames(className, styles['live-details'])}>
            <div className={styles['backdrop']} aria-hidden={'true'}>
                {artwork ? <Image className={styles['backdrop-image']} src={artwork} alt={''} renderFallback={renderChannelBackdrop} /> : renderChannelBackdrop()}
                <div className={styles['backdrop-shade']} />
            </div>
            {children}
            <div ref={contentRef} className={styles['channel-page']}>
                <section className={styles['hero']} aria-label={selected?.title ?? meta.name}>
                    <div className={styles['hero-content']}>
                        <header className={styles['channel-header']}>
                            <div className={styles['channel-logo']}>
                                {channel.logo ? <Image src={channel.logo} alt={''} renderFallback={() => <Icon name={'tv'} />} /> : <Icon name={'tv'} />}
                            </div>
                            <div className={styles['channel-identity']}><h1>{meta.name}</h1><span>{addonName}</span></div>
                        </header>
                        <div className={styles['current-information']}>
                            <div aria-live={'polite'} aria-atomic={'true'}>
                                <div className={styles['current-time']}>
                                    {progress !== null || !selected ? <span className={styles['live-badge']}><span />{t('PLAYER_LIVE')}</span>
                                        : <span className={styles['program-status']}>{selected.endTime.getTime() <= now ? t('AIRED') : t('UPCOMING')}</span>}
                                    {dateLabel && <span>{dateLabel}</span>}
                                    {selected && <span>{formatEpgTimeRange(selected.startTime, selected.endTime, i18n.language)}</span>}
                                    {selected?.runtime && <span>{selected.runtime}</span>}
                                    {selected?.ratings?.filter((rating) => rating.value.trim()).map((rating, index) => <span key={`${rating.system}:${rating.value}:${index}`} className={styles['content-rating']} title={rating.system ? `${rating.system}: ${rating.value}` : rating.value}>
                                        {rating.icon ? <Image src={rating.icon} alt={rating.value} renderFallback={() => rating.value} /> : rating.value}
                                    </span>)}
                                </div>
                                <h2>{selected?.title ?? t('LIVE_TV_NO_PROGRAM', { defaultValue: 'No programme information right now' })}</h2>
                            </div>
                            <p className={styles['description']}>{selected?.overview ?? meta.description ?? (programs.length === 0 ? t('LIVE_TV_NO_SCHEDULE', { defaultValue: 'Programme information is unavailable for this channel.' }) : null)}</p>
                            {genres.length > 0 && <div className={styles['genres']}>{genres.map((genre) => <span key={genre}>{genre}</span>)}</div>}
                            {progress !== null && selected && <div className={styles['broadcast-progress']}>
                                <div className={styles['progress-track']}><div style={{ width: `${progress}%` }} /></div>
                                <span>{t('CONTINUE_WATCHING_TIME_LEFT', { minutes: Math.ceil((selected.endTime.getTime() - now) / 60000) })}</span>
                            </div>}
                        </div>
                        <LiveTvActions inLibrary={meta.inLibrary} onToggleLibrary={onToggleLibrary}>
                            {isMobile && <LiveTvPlayback streams={streams} mobile={true} />}
                        </LiveTvActions>
                    </div>
                </section>
                <div className={styles['guide-layout']}>
                    <LiveTvSchedule programs={programs} now={now} selected={selected} onProgramSelect={(program) => setSelectedKey(program ? programKey(program) : null)} />
                    {!isMobile && <LiveTvPlayback streams={streams} />}
                </div>
            </div>
        </div>
    );
};

export default LiveTvDetails;
