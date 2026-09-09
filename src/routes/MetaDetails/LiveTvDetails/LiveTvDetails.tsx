// Copyright (C) 2017-2026 Smart code 203358507

import React, { useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import classNames from 'classnames';
import Icon from '@stremio/stremio-icons/react';
import { useCore } from 'stremio/core';
import Image from 'stremio/components/Image';
import EpgProgramModal from 'stremio/components/EpgProgramModal';
import { useRouteActive } from 'stremio/common/useRouteFocused';
import { EPGProgram, epgDateKey, formatEpgTimeRange, getEpgProgress, toEpgProgram, useEpgNow } from 'stremio/common/EPG';
import LiveTvActions from './LiveTvActions';
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
    const now = useEpgNow(true);
    const [selectedKey, setSelectedKey] = useState<string | null>(null);
    const [preview, setPreview] = useState<EPGProgram | null>(null);
    const [previewOpen, setPreviewOpen] = useState(false);
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
    const dateLabel = selected && epgDateKey(selected.startTime) !== epgDateKey(new Date(now))
        ? selected.startTime.toLocaleDateString(i18n.language, { weekday: 'short', month: 'short', day: 'numeric' }) : null;
    const openProgram = (program: EPGProgram) => {
        setPreview(program);
        setPreviewOpen(true);
    };
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
                                    {selected?.ratings?.filter((rating) => rating.value.trim()).map((rating, index) => <span key={`${rating.system}:${rating.value}:${index}`} className={styles['content-rating']} title={rating.system}>
                                        {rating.icon && <Image src={rating.icon} alt={''} renderFallback={() => null} />}
                                        {rating.value}
                                    </span>)}
                                </div>
                                <h2>{selected?.title ?? t('LIVE_TV_NO_PROGRAM', { defaultValue: 'No programme information right now' })}</h2>
                            </div>
                            <p className={styles['description']}>{selected?.overview ?? meta.description ?? (programs.length === 0 ? t('LIVE_TV_NO_SCHEDULE', { defaultValue: 'Programme information is unavailable for this channel.' }) : null)}</p>
                            {progress !== null && selected && <div className={styles['broadcast-progress']}>
                                <div className={styles['progress-track']}><div style={{ width: `${progress}%` }} /></div>
                                <span>{t('CONTINUE_WATCHING_TIME_LEFT', { minutes: Math.ceil((selected.endTime.getTime() - now) / 60000) })}</span>
                            </div>}
                        </div>
                        <LiveTvActions streams={streams} inLibrary={meta.inLibrary} onToggleLibrary={onToggleLibrary} onShowDetails={selected ? () => openProgram(selected) : undefined} />
                    </div>
                </section>
                <LiveTvSchedule programs={programs} now={now} selected={selected} onProgramSelect={(program) => setSelectedKey(program ? programKey(program) : null)} />
            </div>
            {preview && <EpgProgramModal program={programs.find((program) => program.id === preview.id) ?? preview} now={now} show={previewOpen} onCloseRequest={() => setPreviewOpen(false)} />}
        </div>
    );
};

export default LiveTvDetails;
