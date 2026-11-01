// Copyright (C) 2017-2023 Smart code 203358507

const React = require('react');
const { useLocation, useNavigate } = require('react-router');
const { default: toPath } = require('stremio-router/toPath');
const { useGoBack } = require('stremio-router');
const PropTypes = require('prop-types');
const classnames = require('classnames');
const { useTranslation } = require('react-i18next');
const { default: Icon } = require('@stremio/stremio-icons/react');
const { Button, Image, MultiselectMenu } = require('stremio/components');
const { useCore } = require('stremio/core');
const Stream = require('./Stream');
const styles = require('./styles');
const { usePlatform, useProfile } = require('stremio/common');
const { default: SeasonEpisodePicker } = require('../EpisodePicker');
const { getBandwidthMbps, getTargetHeight, warmBandwidthProbe } = require('./smartPlayCapabilities');
const { writeCachedCandidates } = require('./smartPlayCache');
const { selectSmartPlayCandidate } = require('./smartPlaySelection');
const { parseQuality, streamKey, streamLabel } = require('./streamQuality');

const ALL_ADDONS_KEY = 'ALL';

const StreamsList = ({ className, video, type, metaId, metaItem, externalPlayerCallbackCanMarkWatched, onEpisodeSearch, ...props }) => {
    const { t } = useTranslation();
    const core = useCore();
    const platform = usePlatform();
    const profile = useProfile();
    const navigate = useNavigate();
    const goBack = useGoBack();
    const streamsContainerRef = React.useRef(null);
    const [selectedAddon, setSelectedAddon] = React.useState(ALL_ADDONS_KEY);
    const onAddonSelected = React.useCallback((value) => {
        streamsContainerRef.current.scrollTo({ top: 0, left: 0, behavior: platform.name === 'ios' ? 'smooth' : 'instant' });
        setSelectedAddon(value);
    }, [platform]);
    const location = useLocation();
    const searchParams = React.useMemo(() => new URLSearchParams(location.search), [location.search]);
    const smartPlay = searchParams.get('smartPlay') === '1';
    const manual = searchParams.get('manual') === '1';
    const targetHeightParam = parseInt(searchParams.get('targetHeight') ?? '0', 10);
    const skipKey = searchParams.get('skipKey');
    const retryToken = searchParams.get('retry');
    const videoId = video?.id ?? null;
    const cacheVideoId = type === 'movie' ? null : videoId;
    const [smartPlayFailed, setSmartPlayFailed] = React.useState(false);
    const [smartPlayDeadlineReached, setSmartPlayDeadlineReached] = React.useState(false);
    const smartPlayAttemptRef = React.useRef(null);
    const smartPlayAttemptKey = `${type}:${metaId ?? ''}:${videoId ?? ''}:${targetHeightParam}:${skipKey ?? ''}:${retryToken ?? ''}`;
    const ignoredKeys = React.useMemo(() => {
        const ignoredStreams = profile?.settings?.ignoredStreams ?? [];
        const keys = new Set(
            ignoredStreams
                .filter((ignored) => {
                    if (ignored.metaId !== metaId) {
                        return false;
                    }
                    if (type === 'movie') {
                        return ignored.videoId === null || ignored.videoId === undefined || ignored.videoId === metaId || ignored.videoId === videoId;
                    }
                    return (ignored.videoId ?? null) === (videoId ?? null);
                })
                .map((ignored) => ignored.key)
        );
        if (typeof skipKey === 'string' && skipKey.length > 0) {
            keys.add(skipKey);
        }
        return keys;
    }, [profile?.settings?.ignoredStreams, metaId, videoId, type, skipKey]);
    React.useEffect(() => {
        setSmartPlayFailed(false);
        setSmartPlayDeadlineReached(false);
        smartPlayAttemptRef.current = null;
    }, [smartPlayAttemptKey]);
    React.useEffect(() => {
        if (!smartPlay) {
            return;
        }
        const timer = window.setTimeout(() => setSmartPlayDeadlineReached(true), 8000);
        return () => window.clearTimeout(timer);
    }, [smartPlay, smartPlayAttemptKey]);
    React.useEffect(() => {
        if (smartPlay) {
            warmBandwidthProbe();
        }
    }, [smartPlay]);
    const clearSmartPlay = React.useCallback(() => {
        setSmartPlayFailed(true);
        const nextParams = new URLSearchParams(location.search);
        nextParams.delete('smartPlay');
        nextParams.delete('targetHeight');
        nextParams.delete('skipKey');
        nextParams.delete('retry');
        const nextSearch = nextParams.toString();
        navigate(`${location.pathname}${nextSearch ? `?${nextSearch}` : ''}`, { replace: true });
    }, [location.pathname, location.search, navigate]);
    const startSmartPlay = React.useCallback(() => {
        setSmartPlayFailed(false);
        setSmartPlayDeadlineReached(false);
        smartPlayAttemptRef.current = null;
        const nextParams = new URLSearchParams(location.search);
        nextParams.set('smartPlay', '1');
        nextParams.delete('targetHeight');
        nextParams.delete('skipKey');
        nextParams.delete('retry');
        navigate(`${location.pathname}?${nextParams.toString()}`, { replace: true });
    }, [location.pathname, location.search, navigate]);
    const showInstallAddonsButton = React.useMemo(() => {
        return !profile || profile.auth === null || profile.auth?.user?.isNewUser === true && !video?.upcoming;
    }, [profile, video]);
    const backButtonOnClick = React.useCallback(() => {
        if (video.deepLinks && typeof video.deepLinks.metaDetailsVideos === 'string') {
            const navigateTo = `${video.deepLinks.metaDetailsVideos}${
                typeof video.season === 'number'
                    ? `?${new URLSearchParams({ 'season': video.season })}`
                    : ''}`;
            navigate(toPath(navigateTo), { replace: true });
        } else {
            goBack();
        }
    }, [video, navigate, goBack]);
    const countLoadingAddons = React.useMemo(() => {
        return props.streams.filter((stream) => stream.content.type === 'Loading').length;
    }, [props.streams]);
    const hasStreamData = props.streams.length > 0;
    const streamsByAddon = React.useMemo(() => {
        return props.streams
            .filter((streams) => streams.content.type === 'Ready')
            .reduce((streamsByAddon, streams) => {
                streamsByAddon[streams.addon.transportUrl] = {
                    addon: streams.addon,
                    streams: streams.content.content
                        .filter((stream) => !ignoredKeys.has(streamKey(stream, streams.addon.transportUrl)))
                        .map((stream) => ({
                            ...stream,
                            onClick: () => {
                                core.transport.analytics({
                                    event: 'StreamClicked',
                                    args: {
                                        stream
                                    }
                                });
                                if (profile.settings.playerType !== null) {
                                    core.transport.dispatch({
                                        action: 'MetaDetails',
                                        args: {
                                            action: 'ExternalPlayerStreamOpened',
                                            args: stream
                                        }
                                    });
                                }
                            },
                            addonName: streams.addon.manifest.name
                        }))
                };

                return streamsByAddon;
            }, {});
    }, [props.streams, profile.settings.playerType, ignoredKeys]);
    const effectiveSelectedAddon = Object.prototype.hasOwnProperty.call(streamsByAddon, selectedAddon) ? selectedAddon : ALL_ADDONS_KEY;
    const filteredStreams = React.useMemo(() => {
        return effectiveSelectedAddon === ALL_ADDONS_KEY ?
            Object.values(streamsByAddon).map(({ streams }) => streams).flat(1)
            :
            streamsByAddon[effectiveSelectedAddon].streams;
    }, [streamsByAddon, effectiveSelectedAddon]);
    const selectableOptions = React.useMemo(() => {
        return {
            options: [
                {
                    value: ALL_ADDONS_KEY,
                    label: t('ALL_ADDONS'),
                    title: t('ALL_ADDONS')
                },
                ...Object.keys(streamsByAddon).map((transportUrl) => ({
                    value: transportUrl,
                    label: streamsByAddon[transportUrl].addon.manifest.name,
                    title: streamsByAddon[transportUrl].addon.manifest.name,
                }))
            ],
            value: effectiveSelectedAddon,
            onSelect: onAddonSelected
        };
    }, [streamsByAddon, effectiveSelectedAddon, onAddonSelected, t]);

    React.useEffect(() => {
        const groups = Object.values(streamsByAddon);
        if (groups.length === 0) {
            return;
        }
        const seen = new Set();
        const candidates = [];
        groups.forEach((group) => {
            group.streams.forEach((stream) => {
                const key = streamKey(stream, group.addon.transportUrl);
                if (seen.has(key)) {
                    return;
                }
                seen.add(key);
                const quality = parseQuality(stream);
                candidates.push({
                    key,
                    label: streamLabel(stream, group.addon.manifest.name),
                    addonName: group.addon.manifest.name,
                    height: quality.height,
                    hdr: quality.hdr,
                });
            });
        });
        writeCachedCandidates(type, metaId, cacheVideoId, candidates);
    }, [streamsByAddon, type, metaId, cacheVideoId]);

    const canSmartPlaySelect = smartPlay && !smartPlayFailed &&
        (hasStreamData || smartPlayDeadlineReached) &&
        (countLoadingAddons === 0 || smartPlayDeadlineReached);
    React.useEffect(() => {
        if (!canSmartPlaySelect) {
            return;
        }
        if (smartPlayAttemptRef.current === smartPlayAttemptKey) {
            return;
        }
        const result = selectSmartPlayCandidate({
            groups: Object.values(streamsByAddon),
            type,
            video,
            metaItem,
            targetHeight: getTargetHeight(targetHeightParam),
            hdrPreference: profile.settings.smartPlayHdrPreference ?? 'auto',
            ignoredKeys,
            hasExternalPlayer: profile.settings.playerType !== null,
            bandwidthMbps: getBandwidthMbps(),
        });
        if (!result.candidate) {
            if (countLoadingAddons > 0) {
                return;
            }
            smartPlayAttemptRef.current = smartPlayAttemptKey;
            clearSmartPlay();
            return;
        }
        smartPlayAttemptRef.current = smartPlayAttemptKey;
        const selected = result.candidate;
        const mapped = streamsByAddon[selected.addon.transportUrl]?.streams.find((stream) => {
            return streamKey(stream, selected.addon.transportUrl) === selected.key;
        });
        if (mapped?.onClick) {
            mapped.onClick();
        }
        if (profile.settings.playerType === null) {
            const href = selected.stream.deepLinks?.player;
            if (typeof href === 'string') {
                navigate(toPath(href), { replace: true });
            } else {
                clearSmartPlay();
            }
        } else {
            clearSmartPlay();
        }
    }, [
        canSmartPlaySelect,
        hasStreamData,
        countLoadingAddons,
        smartPlayAttemptKey,
        streamsByAddon,
        type,
        video,
        metaItem,
        targetHeightParam,
        profile.settings.smartPlayHdrPreference,
        profile.settings.playerType,
        ignoredKeys,
        clearSmartPlay,
        navigate,
    ]);

    const smartPlayAutoStartedRef = React.useRef(null);
    const smartPlayAutoKey = `${type}:${metaId ?? ''}:${cacheVideoId ?? ''}`;
    React.useEffect(() => {
        if (manual || !profile.settings.smartPlay || smartPlay || smartPlayFailed) {
            return;
        }
        if (type !== 'movie' || Object.keys(streamsByAddon).length === 0) {
            return;
        }
        if (smartPlayAutoStartedRef.current === smartPlayAutoKey) {
            return;
        }
        smartPlayAutoStartedRef.current = smartPlayAutoKey;
        startSmartPlay();
    }, [manual, profile.settings.smartPlay, smartPlay, smartPlayFailed, type, streamsByAddon, smartPlayAutoKey, startSmartPlay]);

    const handleEpisodePicker = React.useCallback((season, episode) => {
        onEpisodeSearch(season, episode);
    }, [onEpisodeSearch]);

    if (smartPlay && !smartPlayFailed) {
        return (
            <div className={classnames(className, styles['streams-list-container'])}>
                <div className={styles['message-container']}>
                    <div className={styles['label']}>
                        {t('PLAYER_SMART_PLAY_SELECTING', { defaultValue: 'Choosing the best source…' })}
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className={classnames(className, styles['streams-list-container'])}>
            <div className={styles['select-choices-wrapper']}>
                {
                    video ?
                        <React.Fragment>
                            <Button className={classnames(styles['button-container'], styles['back-button-container'])} tabIndex={0} onClick={backButtonOnClick}>
                                <Icon className={styles['icon']} name={'chevron-back'} />
                            </Button>
                            <div className={styles['episode-title']}>
                                {typeof video.season === 'number' && typeof video.episode === 'number'
                                    ? `S${video.season}E${video.episode}${video.title ? ` ${video.title}` : ''}`
                                    : (video.title ?? '')}
                            </div>
                        </React.Fragment>
                        :
                        null
                }
                {
                    Object.keys(streamsByAddon).length > 1 ?
                        <MultiselectMenu
                            {...selectableOptions}
                            className={styles['select-input-container']}
                        />
                        :
                        null
                }
                {
                    profile.settings.smartPlay && !smartPlay ?
                        <Button className={styles['smart-play-button-container']} onClick={startSmartPlay}>
                            <Icon className={styles['icon']} name={'play'} />
                            <div className={styles['label']}>
                                {t('PLAYER_SMART_PLAY_BUTTON', { defaultValue: 'Smart Play' })}
                            </div>
                        </Button>
                        :
                        null
                }
            </div>
            {
                props.streams.length === 0 ?
                    <div className={styles['message-container']}>
                        {
                            type === 'series' ?
                                <SeasonEpisodePicker className={styles['search']} onSubmit={handleEpisodePicker} />
                                : null
                        }
                        <Image className={styles['image']} src={require('/assets/images/empty.png')} alt={' '} />
                        <div className={styles['label']}>{t('ERR_NO_ADDONS_FOR_STREAMS')}</div>
                    </div>
                    :
                    props.streams.every((streams) => streams.content.type === 'Err') ?
                        <div className={styles['message-container']}>
                            {
                                type === 'series' ?
                                    <SeasonEpisodePicker className={styles['search']} onSubmit={handleEpisodePicker} />
                                    : null
                            }
                            {
                                video?.upcoming ?
                                    <div className={styles['label']}>{t('UPCOMING')}...</div>
                                    : null
                            }
                            <Image className={styles['image']} src={require('/assets/images/empty.png')} alt={' '} />
                            <div className={styles['label']}>{t('NO_STREAM')}</div>
                            {
                                showInstallAddonsButton ?
                                    <Button className={styles['install-button-container']} title={t('ADDON_CATALOGUE_MORE')} href={'#/addons'}>
                                        <Icon className={styles['icon']} name={'addons'} />
                                        <div className={styles['label']}>{t('ADDON_CATALOGUE_MORE')}</div>
                                    </Button>
                                    :
                                    null
                            }
                        </div>
                        :
                        filteredStreams.length === 0 ?
                            <div className={styles['streams-container']}>
                                <Stream.Placeholder />
                                <Stream.Placeholder />
                            </div>
                            :
                            <React.Fragment>
                                <div className={styles['streams-container']} ref={streamsContainerRef}>
                                    {filteredStreams.map((stream, index) => (
                                        <Stream
                                            key={index}
                                            videoId={video?.id}
                                            videoReleased={video?.released}
                                            addonName={stream.addonName}
                                            name={stream.name}
                                            description={stream.description}
                                            thumbnail={stream.thumbnail}
                                            progress={stream.progress}
                                            deepLinks={stream.deepLinks}
                                            externalPlayerCallbackCanMarkWatched={externalPlayerCallbackCanMarkWatched}
                                            onClick={stream.onClick}
                                        />
                                    ))}
                                    {
                                        showInstallAddonsButton ?
                                            <Button className={styles['install-button-container']} title={t('ADDON_CATALOGUE_MORE')} href={'#/addons'}>
                                                <Icon className={styles['icon']} name={'addons'} />
                                                <div className={styles['label']}>{t('ADDON_CATALOGUE_MORE')}</div>
                                            </Button>
                                            :
                                            null
                                    }
                                </div>
                                {
                                    countLoadingAddons > 0 ?
                                        <div className={styles['addons-loading-container']}>
                                            <div className={styles['addons-loading']}>
                                                {countLoadingAddons} {t('MOBILE_ADDONS_LOADING')}
                                            </div>
                                            <span className={styles['addons-loading-bar']}></span>
                                        </div>
                                        :
                                        null
                                }
                            </React.Fragment>
            }
        </div>
    );
};

StreamsList.propTypes = {
    className: PropTypes.string,
    streams: PropTypes.arrayOf(PropTypes.object).isRequired,
    video: PropTypes.object,
    type: PropTypes.string,
    metaId: PropTypes.string,
    metaItem: PropTypes.object,
    externalPlayerCallbackCanMarkWatched: PropTypes.bool,
    onEpisodeSearch: PropTypes.func
};

module.exports = StreamsList;
