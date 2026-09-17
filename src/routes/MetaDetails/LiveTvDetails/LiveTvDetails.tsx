// Copyright (C) 2017-2026 Smart code 203358507

import React, { useCallback, useMemo, useState } from 'react';
import classNames from 'classnames';
import Image from 'stremio/components/Image';
import { useRouteActive } from 'stremio/common/useRouteFocused';
import useMediaQuery from 'stremio/common/useMediaQuery';
import screenSizes from 'stremio/common/screen-sizes.less';
import { EPGChannel, EPGProgram, toEpgProgram, useLiveRefresh } from 'stremio/common/EPG';
import Hero from './Hero';
import Schedule from './Schedule';
import Playback from './Playback';
import Actions from './Actions';
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
    const active = useRouteActive();
    const isMobile = useMediaQuery(`(max-width: ${screenSizes.xsmall})`);
    const now = useLiveRefresh('MetaDetails', 'meta_details', active);
    const [selectedKey, setSelectedKey] = useState<string | null>(null);
    const channel = useMemo<EPGChannel>(() => ({
        id: meta.id,
        type: meta.type,
        name: meta.name,
        logo: meta.logo ?? meta.poster,
        deepLinks: meta.deepLinks,
    }), [meta.id, meta.type, meta.name, meta.logo, meta.poster, meta.deepLinks]);
    const programs = useMemo(() => {
        return meta.videos
            .map((video) => toEpgProgram(video, channel))
            .filter((program): program is EPGProgram => program !== null)
            .sort((a, b) => a.startTime.getTime() - b.startTime.getTime());
    }, [meta.videos, channel]);
    const selected = programs.find((program) => programKey(program) === selectedKey)
        ?? programs.find((program) => program.endTime.getTime() > now)
        ?? programs[programs.length - 1]
        ?? null;
    const artwork = selected?.thumbnail ?? meta.background;

    const onProgramSelect = useCallback((program: EPGProgram | null) => {
        setSelectedKey(program ? programKey(program) : null);
    }, []);
    const renderChannelBackdrop = () => {
        return channel.logo ?
            <Image
                className={classNames(styles['backdrop-image'], styles['channel-artwork'])}
                src={channel.logo}
                alt={''}
                renderFallback={() => null}
            />
            :
            null;
    };

    return (
        <div className={classNames(className, styles['live-details'])}>
            <div className={styles['backdrop']} aria-hidden={'true'}>
                {
                    artwork ?
                        <Image className={styles['backdrop-image']} src={artwork} alt={''} renderFallback={renderChannelBackdrop} />
                        :
                        renderChannelBackdrop()
                }
                <div className={styles['backdrop-shade']} />
            </div>
            {children}
            <div ref={contentRef} className={styles['channel-page']}>
                <Hero
                    channel={channel}
                    addonName={addonName}
                    description={meta.description}
                    hasSchedule={programs.length > 0}
                    selected={selected}
                    now={now}
                >
                    <Actions inLibrary={meta.inLibrary} onToggleLibrary={onToggleLibrary}>
                        {
                            isMobile ?
                                <Playback streams={streams} mobile={true} />
                                :
                                null
                        }
                    </Actions>
                </Hero>
                <div className={styles['guide-layout']}>
                    <Schedule programs={programs} now={now} selected={selected} onProgramSelect={onProgramSelect} />
                    {
                        !isMobile ?
                            <Playback streams={streams} />
                            :
                            null
                    }
                </div>
            </div>
        </div>
    );
};

export default LiveTvDetails;
