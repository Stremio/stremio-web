// Copyright (C) 2017-2026 Smart code 203358507

import React, { useCallback, useEffect, useMemo, useRef } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router';
import { useTranslation } from 'react-i18next';
import { useGoBack, useNavigateWithOrigin } from 'stremio-router';
import { HorizontalNavBar } from 'stremio/components/NavBar';
import DelayedRenderer from 'stremio/components/DelayedRenderer';
import { useContentGamepadNavigation } from 'stremio/services/GamepadNavigation';
import { useProfile, withCoreSuspender } from 'stremio/common';
import { hidesSpoiler } from './format';
import useMediaQuery from 'stremio/common/useMediaQuery';
import screenSizes from 'stremio/common/screen-sizes.less';
import useDetails from './useDetails';
import useSeason from './useSeason';
import useEpisodeNavigation from './useEpisodeNavigation';
import useExternalPlayerCallback from './useExternalPlayerCallback';
import useDetailsActions from './useDetailsActions';
import usePrimaryAction from './usePrimaryAction';
import useHeroCollapse from './useHeroCollapse';
import useMetaLinks from './Hero/useMetaLinks';
import Background from './Background';
import HeroArt from './HeroArt';
import Hero from './Hero';
import Actions from './Actions';
import Toolbar from './Actions/Toolbar';
import Videos from './Videos';
import type { ScrollMemory } from './Videos';
import Streams from './Streams';
import Live from './Live';
import Placeholder from './Placeholder';
import Panel from './Panel';
import Message from './Message';
import styles from './Details.less';

const GAMEPAD_HANDLER_ID = 'metadetails';

const useIsMobile = () => useMediaQuery(`(max-width: ${screenSizes.xxsmall})`);

const LivePlaceholder = () => {
    const { t } = useTranslation();
    const isMobile = useIsMobile();

    return (
        <div className={styles['content']}>
            <Placeholder className={styles['hero']} variant={'live'} />
            <Panel ariaLabel={t('LIVE_TV_SCHEDULE')} header={<Placeholder variant={'guide'} />}>
                <Placeholder variant={isMobile ? 'agenda' : 'timeline'} />
            </Panel>
        </div>
    );
};

const Details = () => {
    const { type, id, videoId } = useParams();
    const location = useLocation();
    const navigate = useNavigate();
    const { getStoredOrigin } = useNavigateWithOrigin();
    const { t } = useTranslation();
    const isMobile = useIsMobile();
    const profile = useProfile();
    const rootRef = useRef<HTMLDivElement>(null);
    const contentRef = useRef<HTMLDivElement>(null);
    const scrollMemoryRef = useRef<ScrollMemory | null>(null);
    const details = useDetails({ type, id, videoId });
    const metaItem = details.metaItem?.content.type === 'Ready' ? details.metaItem.content.content : null;
    const metaPath = details.selected?.metaPath ?? null;
    const metaLoading = details.metaItem?.content.type === 'Loading';
    const streamPath = details.selected?.streamPath ?? null;
    const video = useMemo(() => {
        return streamPath !== null && metaItem !== null ?
            metaItem.videos.find((video) => video.id === streamPath.id) ?? null
            :
            null;
    }, [metaItem, streamPath]);
    const addonUrl = details.metaItem?.addon.transportUrl;
    const isEpgProvider = useMemo(() => {
        return profile.addons.some((addon) => addon.transportUrl === addonUrl && addon.manifest.behaviorHints?.epgProvider === true);
    }, [profile.addons, addonUrl]);
    const isLiveMeta = isEpgProvider && metaItem !== null && (metaItem.behaviorHints?.isLive === true || metaItem.type === 'tv');
    const canMarkWatched = video !== null && details.libraryItem?.state.video_id === video.id && details.libraryItem.state.duration > 0;
    const { share } = useMetaLinks(metaItem?.links);
    const trailerHref = metaItem?.trailerStreams[0]?.deepLinks.player ?? null;
    const [season, setSeason] = useSeason();
    const actions = useDetailsActions(metaItem, details.libraryItem);
    const primary = usePrimaryAction(metaItem, video, details.libraryItem, details.streams, canMarkWatched);
    const originPath = useMemo(() => getStoredOrigin(), [getStoredOrigin]);
    const leave = useGoBack(originPath);
    const { fromVideos, insertVideos } = useEpisodeNavigation();

    useExternalPlayerCallback({ type, id, videoId }, details);
    useContentGamepadNavigation(contentRef, GAMEPAD_HANDLER_ID);
    useHeroCollapse(rootRef, contentRef, isMobile && !isLiveMeta);

    const insertedVideosKeyRef = useRef<string | null>(null);
    useEffect(() => {
        if (video !== null && video.id === videoId && !fromVideos && !metaItem?.behaviorHints.defaultVideoId && insertedVideosKeyRef.current !== location.key) {
            insertedVideosKeyRef.current = location.key;
            insertVideos(video);
        }
    }, [video, videoId, fromVideos, metaItem, location.key, insertVideos]);

    const onEpisodeSearch = useCallback((season: number, episode: number) => {
        const nextVideoId = encodeURIComponent(`${id}:${season}:${episode}`);
        const pathname = location.pathname;
        const nextPathname = typeof videoId !== 'string' || videoId.length === 0 ?
            `${pathname}${pathname.endsWith('/') ? '' : '/'}${nextVideoId}`
            :
            pathname.replace(encodeURIComponent(videoId), nextVideoId);
        navigate(nextPathname, { replace: true, state: location.state });
    }, [id, videoId, location.pathname, location.state, navigate]);

    const navBar = (
        <HorizontalNavBar
            className={styles['nav-bar']}
            backButton={true}
            fullscreenButton={true}
            navMenu={true}
            originPath={fromVideos ? undefined : originPath}
            onBackButtonClick={isMobile ? undefined : leave}
        />
    );

    if (type === 'tv' && (details.selected === null || (isEpgProvider && details.metaItem?.content.type === 'Loading'))) {
        return (
            <div className={styles['details']}>
                {navBar}
                <LivePlaceholder />
            </div>
        );
    }

    if (isLiveMeta && metaItem !== null) {
        return (
            <Live
                key={metaItem.id}
                className={styles['details']}
                contentRef={contentRef}
                meta={metaItem}
                addonName={details.metaItem?.addon.manifest.name ?? ''}
                streams={details.streams}
                isMobile={isMobile}
                onToggleLibrary={actions.toggleLibrary}
            >
                {navBar}
            </Live>
        );
    }

    return (
        <div ref={rootRef} className={styles['details']}>
            {
                !isMobile ?
                    <Background src={metaItem?.background} />
                    :
                    null
            }
            {navBar}
            <div ref={contentRef} className={styles['content']}>
                {
                    isMobile && metaItem !== null ?
                        <HeroArt
                            art={video?.thumbnail || metaItem.background}
                            logo={metaItem.logo}
                            name={metaItem.name}
                            label={
                                video !== null && typeof video.season === 'number' && typeof video.episode === 'number' ?
                                    `${metaItem.name} · ${t('SEASON_NUMBER', { season: video.season })} · ${t('EPISODE')} ${video.episode}`
                                    :
                                    video !== null ? metaItem.name : null
                            }
                            title={video !== null ? video.title || video.id : null}
                            blurred={video !== null && typeof video.thumbnail === 'string' && video.thumbnail.length > 0 && hidesSpoiler(video, profile.settings.hideSpoilers)}
                        />
                        :
                        null
                }
                <div className={styles['hero']}>
                    {
                        metaPath === null ?
                            <DelayedRenderer delay={500}>
                                <Message label={t('ERR_NO_META_SELECTED')} />
                            </DelayedRenderer>
                            :
                            details.metaItem === null ?
                                <Message label={t('ERR_NO_ADDONS_FOR_META')} />
                                :
                                details.metaItem.content.type === 'Err' ?
                                    <Message label={t('ERR_NO_META_FOUND')} />
                                    :
                                    metaItem === null ?
                                        <Placeholder variant={streamPath !== null && type !== 'movie' ? 'episode' : 'hero'} />
                                        :
                                        <Hero metaItem={metaItem} video={video} libraryItem={details.libraryItem} compact={isMobile}>
                                            <Actions
                                                primary={primary}
                                                trailerHref={trailerHref}
                                                inLibrary={metaItem.inLibrary}
                                                onToggleLibrary={actions.toggleLibrary}
                                                watched={metaItem.watched}
                                                onToggleWatched={actions.toggleWatched}
                                                ratingInfo={details.ratingInfo}
                                                shareUrl={share?.href ?? null}
                                                toggles={!isMobile}
                                            />
                                        </Hero>
                    }
                </div>
                {
                    streamPath !== null ?
                        <Streams
                            streams={details.streams}
                            video={video}
                            type={streamPath.type}
                            canMarkWatched={canMarkWatched}
                            onEpisodeSearch={onEpisodeSearch}
                        />
                        :
                        metaPath !== null && type === 'movie' && metaLoading ?
                            <Panel ariaLabel={t('STREAMS')} header={<Placeholder variant={'control'} />}>
                                <Placeholder variant={'streams'} />
                            </Panel>
                            :
                            metaPath !== null ?
                                <Videos
                                    key={metaItem?.id}
                                    metaItem={metaItem}
                                    error={details.metaItem?.content.type === 'Err'}
                                    libraryItem={details.libraryItem}
                                    season={season}
                                    onSeasonSelect={setSeason}
                                    onToggleNotifications={actions.toggleNotifications}
                                    onMarkVideoWatched={actions.markVideoWatched}
                                    onMarkSeasonWatched={actions.markSeasonWatched}
                                    onEpisodeSearch={onEpisodeSearch}
                                    scrollMemoryRef={scrollMemoryRef}
                                />
                                :
                                null
                }
            </div>
            {
                isMobile && metaItem !== null ?
                    <Toolbar
                        inLibrary={metaItem.inLibrary}
                        onToggleLibrary={actions.toggleLibrary}
                        watched={metaItem.watched}
                        onToggleWatched={actions.toggleWatched}
                        ratingInfo={details.ratingInfo}
                    />
                    :
                    isMobile && metaLoading ?
                        <Placeholder variant={'dock'} />
                        :
                        null
            }
        </div>
    );
};

const DetailsFallback = () => {
    const { type } = useParams();

    return (
        <div className={styles['details']}>
            <HorizontalNavBar
                className={styles['nav-bar']}
                backButton={true}
                fullscreenButton={true}
                navMenu={true}
            />
            {
                type === 'tv' ?
                    <LivePlaceholder />
                    :
                    null
            }
        </div>
    );
};

export default withCoreSuspender(Details, DetailsFallback);
