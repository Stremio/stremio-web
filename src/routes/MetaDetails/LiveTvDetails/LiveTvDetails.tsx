// Copyright (C) 2017-2026 Smart code 203358507

import React, { useEffect, useMemo, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import classNames from 'classnames';
import Icon from '@stremio/stremio-icons/react';
import { useCore } from 'stremio/core';
import Button from 'stremio/components/Button';
import Image from 'stremio/components/Image';
import EpgProgramModal from 'stremio/components/EpgProgramModal';
import { EPGProgram, epgDateKey, epgDayWindow, formatEpgTimeRange, getEpgProgress, parseEpgDate, toEpgProgram, useEpgNow } from 'stremio/common/EPG';
import Stream from '../StreamsList/Stream';
import StreamsList from '../StreamsList';
import styles from './LiveTvDetails.less';

type Props = {
    meta: MetaItemMetaDetails;
    addonName: string;
    streams: MetaDetails['streams'];
    onToggleLibrary: () => void;
};

const LiveTvDetails = ({ meta, addonName, streams, onToggleLibrary }: Props) => {
    const { t, i18n } = useTranslation();
    const core = useCore();
    const now = useEpgNow(true);
    const today = epgDateKey(new Date(now));
    const [date, setDate] = useState<string | null>(null);
    const [preview, setPreview] = useState<EPGProgram | null>(null);
    const [previewOpen, setPreviewOpen] = useState(false);
    const [streamsOpen, setStreamsOpen] = useState(false);
    const scheduleRef = useRef<HTMLDivElement>(null);
    const currentRowRef = useRef<HTMLButtonElement>(null);
    const selectedDate = date ?? today;
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
    const day = epgDayWindow(parseEpgDate(selectedDate)!);
    const dayPrograms = programs.filter((program) => program.startTime.getTime() < day.end && program.endTime.getTime() > day.start);
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

    useEffect(() => {
        core.transport.dispatch({ action: 'MetaDetails', args: { action: 'RefreshLive' } }, 'meta_details');
    }, [core, meta.id, now]);

    useEffect(() => {
        const row = selectedDate === today ? currentRowRef.current : null;
        scheduleRef.current?.scrollTo({ top: row ? Math.max(0, row.offsetTop - 16) : 0 });
    }, [selectedDate]);

    return (
        <div className={styles['channel-page']}>
            <header className={styles['channel-header']}>
                <div className={styles['channel-logo']}>
                    {channel.logo ? <Image src={channel.logo} alt={''} /> : <Icon name={'tv'} />}
                </div>
                <div className={styles['channel-identity']}>
                    <div className={styles['eyebrow']}>{t('TYPE_tv')}<span>{addonName}</span></div>
                    <h1>{meta.name}</h1>
                </div>
                <Button
                    className={classNames(styles['library-button'], { [styles['saved']]: meta.inLibrary })}
                    title={meta.inLibrary ? t('REMOVE_FROM_LIB') : t('ADD_TO_LIB')}
                    aria-label={meta.inLibrary ? t('REMOVE_FROM_LIB') : t('ADD_TO_LIB')}
                    onClick={onToggleLibrary}
                >
                    <Icon name={meta.inLibrary ? 'remove-from-library' : 'add-to-library'} />
                </Button>
            </header>
            <div className={styles['layout']}>
                <div className={styles['overview']}>
                    <section className={styles['now-card']} aria-label={t('LIVE_TV_ON_NOW', { defaultValue: 'On now' })}>
                        {artwork && <Image className={styles['artwork']} src={artwork} alt={''} renderFallback={() => null} />}
                        <div className={styles['shade']} />
                        <div className={styles['now-content']}>
                            <div className={styles['live-badge']}><span />{t('PLAYER_LIVE')}</div>
                            <div className={styles['current-information']}>
                                <div className={styles['eyebrow']}>{t('LIVE_TV_ON_NOW', { defaultValue: 'On now' })}</div>
                                <h2>{current?.title ?? t('LIVE_TV_NO_PROGRAM', { defaultValue: 'No programme information right now' })}</h2>
                                {current && <div className={styles['current-time']}>{formatEpgTimeRange(current.startTime, current.endTime, i18n.language)}{current.runtime && <span>{current.runtime}</span>}</div>}
                                <p>{current?.overview ?? meta.description ?? (current === null && programs.length === 0 ? t('LIVE_TV_NO_SCHEDULE', { defaultValue: 'Programme information is unavailable for this channel.' }) : null)}</p>
                                {current?.overview && <Button className={styles['details-button']} onClick={() => openProgram(current)}>{t('LIBRARY_DETAILS')}<Icon name={'chevron-forward'} /></Button>}
                            </div>
                            {progress !== null && current && <div className={styles['broadcast-progress']}>
                                <div className={styles['progress-track']}><div style={{ width: `${progress}%` }} /></div>
                                <span>{t('CONTINUE_WATCHING_TIME_LEFT', { minutes: Math.ceil((current.endTime.getTime() - now) / 60000) })}</span>
                            </div>}
                        </div>
                    </section>
                    <div className={styles['playback']}>
                        {soleStream ? <Stream
                            className={styles['primary-stream']}
                            addonName={soleStream.addonName}
                            name={t('LIVE_TV_WATCH_LIVE', { defaultValue: 'Watch live' })}
                            description={soleStream.addonName}
                            progress={null}
                            deepLinks={soleStream.stream.deepLinks}
                            onClick={() => core.transport.analytics({ event: 'StreamClicked', args: { stream: soleStream.stream } })}
                        /> : readyStreams.length > 1 ? <Button className={styles['streams-button']} onClick={() => setStreamsOpen(!streamsOpen)} aria-expanded={streamsOpen}>
                            <Icon name={'play'} /><span>{t('LIVE_TV_PLAYBACK_OPTIONS', { defaultValue: 'Playback options' })}</span><span className={styles['stream-count']}>{readyStreams.length}</span>
                        </Button> : <div className={styles['stream-message']} role={'status'}>{loadingStreams ? t('STREAM_LOADING') : t('NO_STREAM')}</div>}
                        {readyStreams.length > 1 && streamsOpen && <StreamsList className={styles['stream-options']} streams={streams} isEpg={true} type={meta.type} />}
                    </div>
                    {next && <button className={styles['next-program']} onClick={() => openProgram(next)}>
                        {next.thumbnail && <Image src={next.thumbnail} alt={''} />}
                        <div><span>{t('LIVE_TV_UP_NEXT', { defaultValue: 'Up next' })} · {timeLabel(next.startTime)}</span><strong>{next.title}</strong></div>
                        <Icon name={'chevron-forward'} />
                    </button>}
                </div>
                <section className={styles['schedule']} aria-label={t('LIVE_TV_SCHEDULE', { defaultValue: 'Programme guide' })}>
                    <div className={styles['schedule-header']}><Icon name={'calendar'} /><h2>{t('LIVE_TV_SCHEDULE', { defaultValue: 'Programme guide' })}</h2></div>
                    <div className={styles['dates']}>
                        {dates.map((value) => <button key={value} className={classNames(styles['date'], { [styles['selected-date']]: value === selectedDate })} aria-pressed={value === selectedDate} onClick={() => setDate(value === today ? null : value)}>
                            <span>{value === today ? t('LIVE_TV_TODAY', { defaultValue: 'Today' }) : parseEpgDate(value)!.toLocaleDateString(i18n.language, { weekday: 'short' })}</span>
                            <strong>{parseEpgDate(value)!.toLocaleDateString(i18n.language, { day: 'numeric', month: 'short' })}</strong>
                        </button>)}
                    </div>
                    <div className={styles['programs']} ref={scheduleRef}>
                        {dayPrograms.length > 0 ? dayPrograms.map((program) => {
                            const isCurrent = program.id === current?.id;
                            const aired = program.endTime.getTime() <= now;
                            return <button
                                key={program.id}
                                ref={isCurrent ? currentRowRef : undefined}
                                className={classNames(styles['program'], { [styles['current']]: isCurrent, [styles['aired']]: aired })}
                                aria-current={isCurrent ? 'true' : undefined}
                                onClick={() => openProgram(program)}
                            >
                                <div className={styles['program-time']}><strong>{timeLabel(program.startTime)}</strong><span>{timeLabel(program.endTime)}</span></div>
                                <div className={styles['program-thumbnail']}>{program.thumbnail ? <Image src={program.thumbnail} alt={''} /> : <Icon name={'tv'} />}</div>
                                <div className={styles['program-info']}><strong>{program.title}</strong><span>{isCurrent ? t('LIVE_TV_ON_NOW', { defaultValue: 'On now' }) : aired ? t('AIRED') : t('UPCOMING')}</span></div>
                                <Icon name={'chevron-forward'} className={styles['program-arrow']} />
                            </button>;
                        }) : <div className={styles['empty-schedule']}><Icon name={'calendar'} /><p>{programs.length === 0 ? t('LIVE_TV_NO_SCHEDULE', { defaultValue: 'Programme information is unavailable for this channel.' }) : t('LIVE_TV_NO_PROGRAMS_DATE', { defaultValue: 'No programmes are listed for this day.' })}</p></div>}
                    </div>
                </section>
            </div>
            {preview && <EpgProgramModal program={preview} now={now} show={previewOpen} onCloseRequest={() => setPreviewOpen(false)} />}
        </div>
    );
};

export default LiveTvDetails;
