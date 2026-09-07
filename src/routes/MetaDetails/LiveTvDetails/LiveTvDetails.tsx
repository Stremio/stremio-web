// Copyright (C) 2017-2026 Smart code 203358507

import React, { useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import classNames from 'classnames';
import Icon from '@stremio/stremio-icons/react';
import { useCore } from 'stremio/core';
import Button from 'stremio/components/Button';
import Image from 'stremio/components/Image';
import ModalDialog from 'stremio/components/ModalDialog';
import EpgProgramModal from 'stremio/components/EpgProgramModal';
import useMediaQuery from 'stremio/common/useMediaQuery';
import { EPGProgram, epgDateKey, epgDayWindow, formatEpgTimeRange, getEpgProgress, parseEpgDate, toEpgProgram, useEpgNow } from 'stremio/common/EPG';
import Stream from '../StreamsList/Stream';
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
    const now = useEpgNow(true);
    const today = epgDateKey(new Date(now));
    const [schedulePage, setSchedulePage] = useState<{ date: string; start: number } | null>(null);
    const [preview, setPreview] = useState<EPGProgram | null>(null);
    const [previewOpen, setPreviewOpen] = useState(false);
    const [streamsOpen, setStreamsOpen] = useState(false);
    const smallScreen = useMediaQuery('(max-width: 700px)');
    const wideScreen = useMediaQuery('(min-width: 1400px)');
    const pageSize = smallScreen ? 2 : wideScreen ? 4 : 3;
    const selectedDate = schedulePage?.date ?? today;
    const channel = useMemo(() => ({
        id: meta.id, type: meta.type, name: meta.name, logo: meta.logo ?? meta.poster, deepLinks: meta.deepLinks,
    }), [meta.id, meta.type, meta.name, meta.logo, meta.poster, meta.deepLinks]);
    const programs = useMemo(() => meta.videos
        .map((video) => toEpgProgram(video, channel))
        .filter((program): program is EPGProgram => program !== null)
        .sort((a, b) => a.startTime.getTime() - b.startTime.getTime()), [meta.videos, channel]);
    const current = programs.find((program) => getEpgProgress(program, now) !== null) ?? null;
    const next = programs.find((program) => program.startTime.getTime() > now) ?? null;
    const progress = current ? getEpgProgress(current, now) : null;
    const dates = useMemo(() => Array.from(new Set([today, ...programs.flatMap((program) => [
        epgDateKey(program.startTime), epgDateKey(new Date(program.endTime.getTime() - 1)),
    ])])).sort(), [programs, today]);
    const currentIndex = programs.findIndex((program) => program.endTime.getTime() > now);
    const maxStart = Math.max(0, programs.length - pageSize);
    const initialStart = currentIndex < 0 ? maxStart : Math.max(0, currentIndex - (pageSize > 2 ? 1 : 0));
    const start = Math.min(schedulePage?.start ?? initialStart, maxStart);
    const visiblePrograms = programs.slice(start, start + pageSize);
    const readyStreams = streams.flatMap((resource) => resource.content.type === 'Ready'
        ? resource.content.content.map((stream) => ({ stream, addonName: resource.addon.manifest.name })) : []);
    const loadingStreams = streams.some((resource) => resource.content.type === 'Loading');
    const soleStream = readyStreams.length === 1 ? readyStreams[0] : null;
    const artwork = current?.thumbnail ?? meta.background;
    const timeLabel = (value: Date) => value.toLocaleTimeString(i18n.language, { hour: '2-digit', minute: '2-digit' });
    const openProgram = (program: EPGProgram) => {
        setPreview(program);
        setPreviewOpen(true);
    };
    const changePage = (nextStart: number) => setSchedulePage({ date: epgDateKey(programs[nextStart].startTime), start: nextStart });
    const renderChannelBackdrop = () => channel.logo ? <Image className={classNames(styles['backdrop-image'], styles['channel-artwork'])} src={channel.logo} alt={''} renderFallback={() => null} /> : null;

    useEffect(() => {
        core.transport.dispatch({ action: 'MetaDetails', args: { action: 'RefreshLive' } }, 'meta_details');
    }, [core, meta.id, now]);

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
                        <div className={styles['playback']}>
                            {soleStream ? <Stream
                                className={styles['primary-stream']}
                                addonName={soleStream.addonName}
                                name={t('LIVE_TV_WATCH_LIVE', { defaultValue: 'Watch live' })}
                                description={soleStream.addonName}
                                progress={null}
                                deepLinks={soleStream.stream.deepLinks}
                                onClick={() => core.transport.analytics({ event: 'StreamClicked', args: { stream: soleStream.stream } })}
                            /> : readyStreams.length > 1 ? <button className={styles['streams-button']} onClick={() => setStreamsOpen(true)} aria-haspopup={'dialog'}>
                                <Icon name={'play'} /><span>{t('LIVE_TV_WATCH_LIVE', { defaultValue: 'Watch live' })}</span>
                            </button> : <div className={styles['stream-message']} role={'status'}>{loadingStreams ? t('STREAM_LOADING') : t('NO_STREAM')}</div>}
                            <button
                                className={classNames(styles['library-button'], { [styles['saved']]: meta.inLibrary })}
                                title={meta.inLibrary ? t('REMOVE_FROM_LIB') : t('ADD_TO_LIB')}
                                aria-label={meta.inLibrary ? t('REMOVE_FROM_LIB') : t('ADD_TO_LIB')}
                                onClick={onToggleLibrary}
                            ><Icon name={meta.inLibrary ? 'remove-from-library' : 'add-to-library'} /></button>
                            {current && <Button className={styles['details-button']} onClick={() => openProgram(current)}>{t('LIBRARY_DETAILS')}<Icon name={'chevron-forward'} /></Button>}
                        </div>
                    </div>
                </section>
                <section className={styles['schedule']} aria-label={t('LIVE_TV_SCHEDULE', { defaultValue: 'Programme guide' })}>
                    <div className={styles['schedule-header']}>
                        <h2>{t('LIVE_TV_SCHEDULE', { defaultValue: 'Programme guide' })}</h2>
                        <div className={styles['schedule-controls']}>
                            <div className={styles['date-control']}>
                                <Icon name={'calendar'} />
                                <select value={selectedDate} aria-label={t('LIVE_TV_SCHEDULE', { defaultValue: 'Programme guide' })} onChange={(event) => {
                                    const value = event.target.value;
                                    const day = epgDayWindow(parseEpgDate(value)!);
                                    const firstIndex = programs.findIndex((program) => program.endTime.getTime() > day.start);
                                    setSchedulePage(value === today ? null : { date: value, start: firstIndex < 0 ? maxStart : firstIndex });
                                }}>
                                    {dates.map((value) => <option key={value} value={value}>
                                        {value === today ? t('LIVE_TV_TODAY', { defaultValue: 'Today' }) : parseEpgDate(value)!.toLocaleDateString(i18n.language, { weekday: 'short', day: 'numeric', month: 'short' })}
                                    </option>)}
                                </select>
                                <Icon name={'chevron-down'} />
                            </div>
                            {programs.length > 0 && <span className={styles['page-count']} aria-live={'polite'}>{start + 1}–{start + visiblePrograms.length} / {programs.length}</span>}
                            <div className={styles['pagination']}>
                                <button aria-label={t('BUTTON_PREV')} title={t('BUTTON_PREV')} disabled={start === 0} onClick={() => changePage(Math.max(0, start - pageSize))}><Icon name={'chevron-back'} /></button>
                                <button aria-label={t('BUTTON_NEXT')} title={t('BUTTON_NEXT')} disabled={start >= maxStart} onClick={() => changePage(Math.min(maxStart, start + pageSize))}><Icon name={'chevron-forward'} /></button>
                            </div>
                        </div>
                    </div>
                    <div className={styles['programs']}>
                        {visiblePrograms.length > 0 ? visiblePrograms.map((program) => {
                            const isCurrent = program.id === current?.id;
                            const aired = program.endTime.getTime() <= now;
                            return <button
                                key={program.id}
                                className={classNames(styles['program'], { [styles['current']]: isCurrent, [styles['aired']]: aired })}
                                aria-current={isCurrent ? 'true' : undefined}
                                onClick={() => openProgram(program)}
                            >
                                <div className={styles['program-thumbnail']}>
                                    <Image src={program.thumbnail ?? channel.logo ?? ''} alt={''} renderFallback={() => <Icon name={'tv'} />} className={program.thumbnail ? undefined : styles['channel-thumbnail']} />
                                </div>
                                <div className={styles['program-info']}>
                                    <div className={styles['program-time']}><span>{epgDateKey(program.startTime) !== selectedDate && `${program.startTime.toLocaleDateString(i18n.language, { month: 'short', day: 'numeric' })} · `}{timeLabel(program.startTime)}</span><span>{isCurrent ? t('LIVE_TV_ON_NOW', { defaultValue: 'On now' }) : aired ? t('AIRED') : program.id === next?.id ? t('LIVE_TV_UP_NEXT', { defaultValue: 'Up next' }) : t('UPCOMING')}</span></div>
                                    <strong>{program.title}</strong>
                                </div>
                            </button>;
                        }) : <div className={styles['empty-schedule']}><Icon name={'calendar'} /><p>{t('LIVE_TV_NO_SCHEDULE', { defaultValue: 'Programme information is unavailable for this channel.' })}</p></div>}
                    </div>
                </section>
            </div>
            {streamsOpen && <ModalDialog className={styles['streams-modal']} title={t('LIVE_TV_PLAYBACK_OPTIONS', { defaultValue: 'Playback options' })} onCloseRequest={() => setStreamsOpen(false)} role={'dialog'} aria-modal={'true'} aria-label={t('LIVE_TV_PLAYBACK_OPTIONS', { defaultValue: 'Playback options' })}>
                <div className={styles['stream-options']}>
                    {readyStreams.map(({ stream, addonName }, index) => <Stream
                        key={index}
                        addonName={addonName}
                        name={stream.name || addonName}
                        description={stream.description}
                        progress={null}
                        deepLinks={stream.deepLinks}
                        onClick={() => core.transport.analytics({ event: 'StreamClicked', args: { stream } })}
                    />)}
                </div>
            </ModalDialog>}
            {preview && <EpgProgramModal program={preview} now={now} show={previewOpen} onCloseRequest={() => setPreviewOpen(false)} />}
        </div>
    );
};

export default LiveTvDetails;
