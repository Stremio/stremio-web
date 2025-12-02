// Copyright (C) 2017-2023 Smart code 203358507

import React, { useCallback, useLayoutEffect, useMemo, useRef, useState } from 'react';
import classnames from 'classnames';
import throttle from 'lodash.throttle';
import { useRouteFocused } from 'stremio-router';
import { usePlatform, useProfile, useStreamingServer, withCoreSuspender } from 'stremio/common';
import { MainNavBars } from 'stremio/components';
import { SECTIONS } from './constants';
import Menu from './Menu';
import General from './General';
import Player from './Player';
import Streaming from './Streaming';
import Shortcuts from './Shortcuts';
import Info from './Info';
import styles from './Settings.less';

const Settings = () => {
    const { routeFocused } = useRouteFocused();
    const profile = useProfile();
    const platform = usePlatform();
    const streamingServer = useStreamingServer();

    const sectionsContainerRef = useRef<HTMLDivElement>(null);
    const generalSectionRef = useRef<HTMLDivElement>(null);
    const playerSectionRef = useRef<HTMLDivElement>(null);
    const streamingServerSectionRef = useRef<HTMLDivElement>(null);
    const shortcutsSectionRef = useRef<HTMLDivElement>(null);

    const sections = useMemo(() => ([
        { ref: generalSectionRef, id: SECTIONS.GENERAL },
        { ref: playerSectionRef, id: SECTIONS.PLAYER },
        { ref: streamingServerSectionRef, id: SECTIONS.STREAMING },
        { ref: shortcutsSectionRef, id: SECTIONS.SHORTCUTS },
    ]), []);

    const [selectedSectionId, setSelectedSectionId] = useState(SECTIONS.GENERAL);

    const updateSelectedSectionId = useCallback(() => {
        const container = sectionsContainerRef.current;
        for (const section of sections) {
            const sectionContainer = section.ref.current;
            if (sectionContainer && (sectionContainer.offsetTop + container!.offsetTop) < container!.scrollTop + 50) {
                setSelectedSectionId(section.id);
            }
        }
    }, []);

    const onMenuSelect = useCallback((event: React.MouseEvent<HTMLDivElement>) => {
        const section = sections.find((section) => {
            return section.id === event.currentTarget.dataset.section;
        });

        const container = sectionsContainerRef.current;
        section && container!.scrollTo({
            top: section.ref.current!.offsetTop - container!.offsetTop,
            behavior: 'smooth'
        });
    }, []);

    const onContainerScroll = useCallback(throttle(() => {
        updateSelectedSectionId();
    }, 50), []);

    useLayoutEffect(() => {
        if (routeFocused) {
            updateSelectedSectionId();
        }
    }, [routeFocused]);

    return (
        <MainNavBars className={styles['settings-container']} route={'settings'}>
            <div className={classnames(styles['settings-content'], 'animation-fade-in')}>
                <Menu
                    selected={selectedSectionId}
                    streamingServer={streamingServer}
                    onSelect={onMenuSelect}
                />

                <div ref={sectionsContainerRef} className={styles['sections-container']} onScroll={onContainerScroll}>
                    <General
                        ref={generalSectionRef}
                        profile={profile}
                    />
                    <Player
                        ref={playerSectionRef}
                        profile={profile}
                    />
                    <Streaming
                        ref={streamingServerSectionRef}
                        profile={profile}
                        streamingServer={streamingServer}
                    />
                    {
                        !platform.isMobile && <Shortcuts ref={shortcutsSectionRef} />
                    }
                    <Info streamingServer={streamingServer} />
                </div>
            </div>
        </MainNavBars>
    );
};

const SettingsFallback = () => (
    <MainNavBars className={styles['settings-container']} route={'settings'} />
);

export default withCoreSuspender(Settings, SettingsFallback);
