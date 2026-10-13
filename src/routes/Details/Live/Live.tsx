// Copyright (C) 2017-2026 Smart code 203358507

import React, { useCallback, useMemo, useRef, useState } from 'react';
import classNames from 'classnames';
import { useTranslation } from 'react-i18next';
import Image from 'stremio/components/Image';
import { useRouteActive } from 'stremio/common/useRouteFocused';
import { EPGProgram, useLiveRefresh } from 'stremio/common/EPG';
import Background from '../Background';
import Logo from '../Hero/Logo';
import Bar from '../HeroArt/Bar';
import useHeroCollapse from '../useHeroCollapse';
import Panel from '../Panel';
import Streams from '../Streams';
import Programme from './Programme';
import Playback from './Playback';
import StreamPicker from './StreamPicker';
import GuideHeader from './Guide/GuideHeader';
import GuideBody from './Guide/GuideBody';
import useGuide from './Guide/useGuide';
import useProgrammes from './useProgrammes';
import getProgrammeKey from './getProgrammeKey';
import styles from './Live.less';

type Props = {
    className?: string,
    contentRef: React.RefObject<HTMLDivElement>,
    meta: MetaItemMetaDetails,
    streams: MetaDetails['streams'],
    isMobile: boolean,
    onToggleLibrary: () => void,
    children: React.ReactNode,
};

const renderFallback = () => null;

const Live = ({ className, contentRef, meta, streams, isMobile, onToggleLibrary, children }: Props) => {
    const { t } = useTranslation();
    const active = useRouteActive();
    const now = useLiveRefresh('MetaDetails', 'meta_details', active);
    const { channel, programmes, current } = useProgrammes(meta, now);
    const [selectedKey, setSelectedKey] = useState<string | null>(null);
    const [streamsOpen, setStreamsOpen] = useState(false);
    const rootRef = useRef<HTMLDivElement>(null);
    useHeroCollapse(rootRef, contentRef, isMobile);

    const selected = useMemo(() => {
        return programmes.find((programme) => getProgrammeKey(programme) === selectedKey)
            ?? programmes.find((programme) => programme.endTime.getTime() > now)
            ?? programmes[programmes.length - 1]
            ?? null;
    }, [programmes, selectedKey, now]);
    const selectedProgrammeKey = selected !== null ? getProgrammeKey(selected) : null;
    const live = selected !== null && selected === current;
    const artwork = selected?.thumbnail ?? meta.background;

    const onSelect = useCallback((programme: EPGProgram | null) => {
        setSelectedKey(programme !== null ? getProgrammeKey(programme) : null);
    }, []);

    const onStreamsToggle = useCallback(() => setStreamsOpen((open) => !open), []);
    const onStreamsClose = useCallback(() => setStreamsOpen(false), []);

    const guide = useGuide({ programmes, selected, isMobile, onSelect });

    const panel = (
        <Panel
            ariaLabel={t('LIVE_TV_SCHEDULE')}
            resetKey={guide.view}
            header={
                <GuideHeader
                    view={guide.view}
                    hasProgrammes={programmes.length > 0}
                    canPrevious={guide.canPrevious}
                    canNext={guide.canNext}
                    canZoomIn={guide.canZoomIn}
                    canZoomOut={guide.canZoomOut}
                    isMobile={isMobile}
                    onViewSelect={guide.onViewSelect}
                    onPrevious={guide.onPrevious}
                    onNow={guide.onNow}
                    onNext={guide.onNext}
                    onZoomIn={guide.onZoomIn}
                    onZoomOut={guide.onZoomOut}
                    onFit={guide.onFit}
                />
            }
        >
            <GuideBody
                view={guide.view}
                programmes={programmes}
                now={now}
                selectedKey={selectedProgrammeKey}
                nowToken={guide.nowToken}
                fitToken={guide.fitToken}
                scale={guide.scale}
                isMobile={isMobile}
                onSelect={onSelect}
                onScale={guide.onScale}
            />
        </Panel>
    );

    const playback = (
        <Playback
            className={styles['playback']}
            streams={streams}
            streamsOpen={streamsOpen}
            inLibrary={meta.inLibrary}
            minutesLeft={live && current !== null ? Math.ceil((current.endTime.getTime() - now) / 60000) : null}
            currentProgrammeTitle={!live ? current?.title ?? null : null}
            onStreamsToggle={onStreamsToggle}
            onToggleLibrary={onToggleLibrary}
        />
    );

    return (
        <div ref={rootRef} className={classNames(className, styles['live'])}>
            {
                !isMobile ?
                    <Background src={artwork} />
                    :
                    null
            }
            {children}
            <div ref={contentRef} className={styles['content']}>
                {
                    isMobile ?
                        <React.Fragment>
                            <Bar logo={meta.logo} name={channel.name} />
                            <header className={styles['hero-art']}>
                                <div className={styles['pin']}>
                                    <div className={styles['art']} aria-hidden={'true'}>
                                        {
                                            typeof artwork === 'string' && artwork.length > 0 ?
                                                <Image key={artwork} className={styles['image']} src={artwork} alt={''} renderFallback={renderFallback} />
                                                :
                                                null
                                        }
                                    </div>
                                </div>
                            </header>
                            <div className={styles['copy']}>
                                <Logo name={channel.name} logo={meta.logo} />
                                <Programme className={styles['headline']} programme={selected} now={now} part={'headline'} />
                            </div>
                            <div className={styles['scrim']} aria-hidden={'true'} />
                            <section className={styles['summary']}>
                                <Programme programme={selected} now={now} part={'details'} />
                                {playback}
                            </section>
                            <h2 className={styles['guide-title']}>{t('LIVE_TV_SCHEDULE')}</h2>
                            {panel}
                            <StreamPicker
                                open={streamsOpen}
                                streams={streams}
                                live={live}
                                programmeTitle={selected?.title ?? null}
                                channelName={channel.name}
                                onClose={onStreamsClose}
                            />
                        </React.Fragment>
                        :
                        <React.Fragment>
                            <div className={styles['main']}>
                                <Logo name={channel.name} logo={meta.logo} />
                                <div className={styles['spacer']} />
                                <Programme className={styles['programme']} programme={selected} now={now} />
                                {playback}
                            </div>
                            {
                                streamsOpen ?
                                    <Streams
                                        streams={streams}
                                        video={null}
                                        type={meta.type}
                                        canMarkWatched={false}
                                        title={[selected?.title, channel.name].filter((part) => typeof part === 'string' && part.length > 0).join(' · ')}
                                        onBack={onStreamsClose}
                                    />
                                    :
                                    panel
                            }
                        </React.Fragment>
                }
            </div>
        </div>
    );
};

export default Live;
