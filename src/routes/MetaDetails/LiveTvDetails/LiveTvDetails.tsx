// Copyright (C) 2017-2026 Smart code 203358507

import React, { useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import classNames from 'classnames';
import Icon from '@stremio/stremio-icons/react';
import { useCore } from 'stremio/core';
import Image from 'stremio/components/Image';
import EpgProgramModal from 'stremio/components/EpgProgramModal';
import { useRouteActive } from 'stremio/common/useRouteFocused';
import { EPGProgram, formatEpgTimeRange, getEpgProgress, toEpgProgram, useEpgNow } from 'stremio/common/EPG';
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

const LiveTvDetails = ({ className, contentRef, children, meta, addonName, streams, onToggleLibrary }: Props) => {
    const { t, i18n } = useTranslation();
    const core = useCore();
    const active = useRouteActive();
    const now = useEpgNow(true);
    const [preview, setPreview] = useState<EPGProgram | null>(null);
    const [previewOpen, setPreviewOpen] = useState(false);
    const channel = useMemo(() => ({
        id: meta.id, type: meta.type, name: meta.name, logo: meta.logo ?? meta.poster, deepLinks: meta.deepLinks,
    }), [meta.id, meta.type, meta.name, meta.logo, meta.poster, meta.deepLinks]);
    const programs = useMemo(() => meta.videos
        .map((video) => toEpgProgram(video, channel))
        .filter((program): program is EPGProgram => program !== null)
        .sort((a, b) => a.startTime.getTime() - b.startTime.getTime()), [meta.videos, channel]);
    const current = programs.find((program) => getEpgProgress(program, now) !== null) ?? null;
    const progress = current ? getEpgProgress(current, now) : null;
    const artwork = current?.thumbnail ?? meta.background;
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
                <section className={styles['hero']} aria-label={t('LIVE_TV_ON_NOW', { defaultValue: 'On now' })}>
                    <div className={styles['hero-content']}>
                        <header className={styles['channel-header']}>
                            <div className={styles['channel-logo']}>
                                {channel.logo ? <Image src={channel.logo} alt={''} renderFallback={() => <Icon name={'tv'} />} /> : <Icon name={'tv'} />}
                            </div>
                            <div className={styles['channel-identity']}><h1>{meta.name}</h1><span>{addonName}</span></div>
                        </header>
                        <div className={styles['current-information']}>
                            <div className={styles['current-time']}>
                                <span className={styles['live-badge']}><span />{t('PLAYER_LIVE')}</span>
                                {current && <span>{formatEpgTimeRange(current.startTime, current.endTime, i18n.language)}</span>}
                            </div>
                            <h2>{current?.title ?? t('LIVE_TV_NO_PROGRAM', { defaultValue: 'No programme information right now' })}</h2>
                            <p className={styles['description']}>{current?.overview ?? meta.description ?? (programs.length === 0 ? t('LIVE_TV_NO_SCHEDULE', { defaultValue: 'Programme information is unavailable for this channel.' }) : null)}</p>
                            {progress !== null && current && <div className={styles['broadcast-progress']}>
                                <div className={styles['progress-track']}><div style={{ width: `${progress}%` }} /></div>
                                <span>{t('CONTINUE_WATCHING_TIME_LEFT', { minutes: Math.ceil((current.endTime.getTime() - now) / 60000) })}</span>
                            </div>}
                        </div>
                        <LiveTvActions streams={streams} inLibrary={meta.inLibrary} onToggleLibrary={onToggleLibrary} onShowDetails={current ? () => openProgram(current) : undefined} />
                    </div>
                </section>
                <LiveTvSchedule programs={programs} now={now} onProgramSelect={openProgram} />
            </div>
            {preview && <EpgProgramModal program={programs.find((program) => program.id === preview.id) ?? preview} now={now} show={previewOpen} onCloseRequest={() => setPreviewOpen(false)} />}
        </div>
    );
};

export default LiveTvDetails;
