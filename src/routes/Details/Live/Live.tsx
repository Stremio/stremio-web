// Copyright (C) 2017-2026 Smart code 203358507

import React, { useCallback, useMemo, useState } from 'react';
import classNames from 'classnames';
import { useTranslation } from 'react-i18next';
import Image from 'stremio/components/Image';
import { useRouteActive } from 'stremio/common/useRouteFocused';
import { EPGProgram, useLiveRefresh } from 'stremio/common/EPG';
import Background from '../Background';
import Panel from '../Panel';
import Channel from './Channel';
import Programme from './Programme';
import Playback from './Playback';
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
    addonName: string,
    streams: MetaDetails['streams'],
    isMobile: boolean,
    onToggleLibrary: () => void,
    children: React.ReactNode,
};

const renderFallback = () => null;

const Live = ({ className, contentRef, meta, addonName, streams, isMobile, onToggleLibrary, children }: Props) => {
    const { t } = useTranslation();
    const active = useRouteActive();
    const now = useLiveRefresh('MetaDetails', 'meta_details', active);
    const { channel, programmes, current } = useProgrammes(meta, now);
    const [selectedKey, setSelectedKey] = useState<string | null>(null);

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
                    isMobile={isMobile}
                    onViewSelect={guide.onViewSelect}
                    onPrevious={guide.onPrevious}
                    onNow={guide.onNow}
                    onNext={guide.onNext}
                />
            }
        >
            <GuideBody
                view={guide.view}
                programmes={programmes}
                now={now}
                selectedKey={selectedProgrammeKey}
                nowToken={guide.nowToken}
                isMobile={isMobile}
                onSelect={onSelect}
            />
        </Panel>
    );

    const playback = (
        <Playback
            className={styles['playback']}
            streams={streams}
            programmeTitle={selected?.title ?? null}
            channelName={channel.name}
            live={live}
            isMobile={isMobile}
            inLibrary={meta.inLibrary}
            onToggleLibrary={onToggleLibrary}
        />
    );

    return (
        <div className={classNames(className, styles['live'])}>
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
                            <header className={styles['hero-art']}>
                                <div className={styles['art']} aria-hidden={'true'}>
                                    {
                                        typeof artwork === 'string' && artwork.length > 0 ?
                                            <Image key={artwork} className={styles['image']} src={artwork} alt={''} renderFallback={renderFallback} />
                                            :
                                            null
                                    }
                                </div>
                                <div className={styles['copy']}>
                                    <Channel name={channel.name} logo={channel.logo} addonName={addonName} compact={true} />
                                    <Programme className={styles['headline']} programme={selected} now={now} part={'headline'} />
                                </div>
                            </header>
                            <div className={styles['scrim']} aria-hidden={'true'} />
                            <section className={styles['summary']}>
                                <Programme programme={selected} now={now} part={'details'} />
                                {playback}
                            </section>
                            <h2 className={styles['guide-title']}>{t('LIVE_TV_SCHEDULE')}</h2>
                            {panel}
                        </React.Fragment>
                        :
                        <React.Fragment>
                            <div className={styles['main']}>
                                <Channel name={channel.name} logo={channel.logo} addonName={addonName} />
                                <div className={styles['spacer']} />
                                <Programme programme={selected} now={now} />
                                {playback}
                            </div>
                            {panel}
                        </React.Fragment>
                }
            </div>
        </div>
    );
};

export default Live;
