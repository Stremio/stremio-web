// Copyright (C) 2017-2026 Smart code 203358507

import React, { useCallback, useMemo, useRef, useState } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router';
import { useTranslation } from 'react-i18next';
import { useGoBack, useNavigateWithOrigin } from 'stremio-router';
import { HorizontalNavBar } from 'stremio/components/NavBar';
import DelayedRenderer from 'stremio/components/DelayedRenderer';
import { useContentGamepadNavigation } from 'stremio/services/GamepadNavigation';
import { useProfile, withCoreSuspender } from 'stremio/common';
import { hidesSpoiler } from 'stremio/common/format';
import useMediaQuery from 'stremio/common/useMediaQuery';
import screenSizes from 'stremio/common/screen-sizes.less';
import useDetails from './useDetails';
import useSeason from './useSeason';
import useEpisodeNavigation from './useEpisodeNavigation';
import useDirectEpisode from './useDirectEpisode';
import useLiveChannel from './useLiveChannel';
import useExternalPlayerCallback from './useExternalPlayerCallback';
import useDetailsActions from './useDetailsActions';
import usePrimaryAction from './usePrimaryAction';
import useHeroCollapse from './useHeroCollapse';
import useMetaLinks from 'stremio/common/useMetaLinks';
import Background from './Background';
import HeroArt from './HeroArt';
import Hero from './Hero';
import Actions from './Actions';
import type { PrimaryAction } from './Actions';
import Toolbar from './Actions/Toolbar';
import Videos from './Videos';
import type { ScrollMemory } from './Videos';
import Streams from './Streams';
import Live from './Live';
import Placeholder from './Placeholder';
import Panel from './Panel';
import Message from 'stremio/components/Message';
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

type MetaHeroArtProps = {
    metaItem: MetaItemMetaDetails,
    video: Video | null,
    hideSpoilers: boolean,
};

const MetaHeroArt = ({ metaItem, video, hideSpoilers }: MetaHeroArtProps) => {
    const { t } = useTranslation();

    if (video === null) {
        return (
            <HeroArt art={metaItem.background} logo={metaItem.logo} name={metaItem.name} />
        );
    }

    return (
        <HeroArt
            art={metaItem.background}
            still={video.thumbnail}
            logo={metaItem.logo}
            name={metaItem.name}
            label={
                typeof video.season === 'number' && typeof video.episode === 'number' ?
                    `${metaItem.name} · ${t('SEASON_NUMBER', { season: video.season })} · ${t('EPISODE')} ${video.episode}`
                    :
                    metaItem.name
            }
            title={video.title || video.id}
            blurred={typeof video.thumbnail === 'string' && video.thumbnail.length > 0 && hidesSpoiler(video, hideSpoilers)}
        />
    );
};

type HeroContentProps = {
    metaPath: ResourceRequestPath | null,
    meta: MetaDetails['metaItem'],
    metaItem: MetaItemMetaDetails | null,
    placeholder: 'hero' | 'episode',
    video: Video | null,
    libraryItem: LibraryItem | null,
    ratingInfo: MetaDetails['ratingInfo'],
    primary: PrimaryAction | null,
    actions: ReturnType<typeof useDetailsActions>,
    isMobile: boolean,
};

const HeroContent = ({ metaPath, meta, metaItem, placeholder, video, libraryItem, ratingInfo, primary, actions, isMobile }: HeroContentProps) => {
    const { t } = useTranslation();
    const { share } = useMetaLinks(metaItem?.links);

    if (metaPath === null) {
        return (
            <DelayedRenderer delay={500}>
                <Message label={t('ERR_NO_META_SELECTED')} />
            </DelayedRenderer>
        );
    }

    if (meta === null) {
        return (
            <Message label={t('ERR_NO_ADDONS_FOR_META')} />
        );
    }

    if (meta.content.type === 'Err') {
        return (
            <Message label={t('ERR_NO_META_FOUND')} />
        );
    }

    if (metaItem === null) {
        return (
            <Placeholder variant={placeholder} />
        );
    }

    return (
        <Hero key={metaItem.id} metaItem={metaItem} video={video} libraryItem={libraryItem} compact={isMobile}>
            <Actions
                primary={primary}
                trailerHref={metaItem.trailerStreams[0]?.deepLinks.player ?? null}
                inLibrary={metaItem.inLibrary}
                onToggleLibrary={actions.toggleLibrary}
                watched={metaItem.watched}
                onToggleWatched={actions.toggleWatched}
                ratingInfo={ratingInfo}
                shareUrl={share?.href ?? null}
                toggles={!isMobile}
            />
        </Hero>
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
    const live = useLiveChannel(type, details, metaItem, profile.addons);
    const canMarkWatched = video !== null && details.libraryItem?.state.video_id === video.id && details.libraryItem.state.duration > 0;
    const [season, setSeason] = useSeason();
    const actions = useDetailsActions(metaItem, details.libraryItem);
    const primary = usePrimaryAction(metaItem, video, details.libraryItem, details.streams, canMarkWatched);
    const originPath = useMemo(() => getStoredOrigin(), [getStoredOrigin]);
    const leave = useGoBack(originPath);
    const { fromVideos, openEpisode } = useEpisodeNavigation();

    const streamsLoading = streamPath === null && metaPath !== null && type === 'movie' && metaLoading;
    const videosVisible = streamPath === null && metaPath !== null && !(type === 'movie' && metaLoading);
    const [videosMounted, setVideosMounted] = useState(videosVisible);
    if (videosVisible && !videosMounted) {
        setVideosMounted(true);
    }
    const videosSeason = season ?? metaItem?.videos.find((episode) => episode.id === videoId)?.season ?? null;

    useExternalPlayerCallback({ type, id, videoId }, details);
    useContentGamepadNavigation(contentRef, GAMEPAD_HANDLER_ID);
    useHeroCollapse(rootRef, contentRef, isMobile && live.channel === null);
    const streams = useDirectEpisode(video, videoId, metaItem, details.streams);

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

    if (live.loading) {
        return (
            <div className={styles['details']}>
                {navBar}
                <LivePlaceholder />
            </div>
        );
    }

    if (live.channel !== null) {
        return (
            <Live
                key={live.channel.id}
                className={styles['details']}
                contentRef={contentRef}
                meta={live.channel}
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
                        <MetaHeroArt metaItem={metaItem} video={video} hideSpoilers={profile.settings.hideSpoilers} />
                        :
                        null
                }
                <div className={styles['hero']}>
                    <HeroContent
                        metaPath={metaPath}
                        meta={details.metaItem}
                        metaItem={metaItem}
                        placeholder={streamPath !== null && type !== 'movie' ? 'episode' : 'hero'}
                        video={video}
                        libraryItem={details.libraryItem}
                        ratingInfo={details.ratingInfo}
                        primary={primary}
                        actions={actions}
                        isMobile={isMobile}
                    />
                </div>
                {
                    streamPath !== null ?
                        <Streams
                            streams={streams}
                            video={video}
                            type={streamPath.type}
                            canMarkWatched={canMarkWatched}
                            onEpisodeSearch={onEpisodeSearch}
                        />
                        :
                        null
                }
                {
                    streamsLoading ?
                        <Panel ariaLabel={t('STREAMS')} header={<Placeholder variant={'control'} />}>
                            <Placeholder variant={'streams'} />
                        </Panel>
                        :
                        null
                }
                {
                    videosMounted ?
                        <Videos
                            key={metaItem?.id}
                            hidden={!videosVisible}
                            metaItem={metaItem}
                            hideSpoilers={profile.settings.hideSpoilers}
                            openEpisode={openEpisode}
                            error={details.metaItem?.content.type === 'Err'}
                            libraryItem={details.libraryItem}
                            season={videosSeason}
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
                    null
            }
            {
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
