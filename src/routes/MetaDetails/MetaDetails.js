// Copyright (C) 2017-2023 Smart code 203358507

const React = require('react');
const { useTranslation } = require('react-i18next');
const PropTypes = require('prop-types');
const classnames = require('classnames');
const { useServices } = require('stremio/services');
const { withCoreSuspender } = require('stremio/common');
const { VerticalNavBar, HorizontalNavBar, DelayedRenderer, Image, MetaPreview, ModalDialog } = require('stremio/components');
const StreamsList = require('./StreamsList');
const VideosList = require('./VideosList');
const useMetaDetails = require('./useMetaDetails');
const useSeason = require('./useSeason');
const useMetaExtensionTabs = require('./useMetaExtensionTabs');
const styles = require('./styles');

const MetaDetails = ({ urlParams, queryParams }) => {
    const { t } = useTranslation();
    const { core } = useServices();
    const metaDetails = useMetaDetails(urlParams);
    const [season, setSeason] = useSeason(urlParams, queryParams);
    const [tabs, metaExtension, clearMetaExtension] = useMetaExtensionTabs(metaDetails.metaExtensions);
    const [metaPath, streamPath] = React.useMemo(() => {
        return metaDetails.selected !== null ?
            [metaDetails.selected.metaPath, metaDetails.selected.streamPath]
            :
            [null, null];
    }, [metaDetails.selected]);
    const video = React.useMemo(() => {
        return streamPath !== null && metaDetails.metaItem !== null && metaDetails.metaItem.content.type === 'Ready' ?
            metaDetails.metaItem.content.content.videos.reduce((result, video) => {
                if (video.id === streamPath.id) {
                    return video;
                }

                return result;
            }, null)
            :
            null;
    }, [metaDetails.metaItem, streamPath]);
    const addToLibrary = React.useCallback(() => {
        if (metaDetails.metaItem === null || metaDetails.metaItem.content.type !== 'Ready') {
            return;
        }

        core.transport.dispatch({
            action: 'Ctx',
            args: {
                action: 'AddToLibrary',
                args: metaDetails.metaItem.content.content
            }
        });
    }, [metaDetails]);
    const removeFromLibrary = React.useCallback(() => {
        if (metaDetails.metaItem === null || metaDetails.metaItem.content.type !== 'Ready') {
            return;
        }

        core.transport.dispatch({
            action: 'Ctx',
            args: {
                action: 'RemoveFromLibrary',
                args: metaDetails.metaItem.content.content.id
            }
        });
    }, [metaDetails]);
    const markAsWatched = React.useCallback(async () => {
        if (metaDetails.libraryItem && typeof metaDetails.libraryItem._id === 'string') {
            await core.transport.dispatch({
                action: 'Ctx',
                args: {
                    action: 'LibraryItemMarkAsWatched',
                    args: {
                        id: metaDetails.libraryItem._id,
                        is_watched: true
                    }
                }
            });
            // after core processes the change, reload the board model so board cards get updated
            await core.transport.dispatch({
                action: 'Load',
                args: { model: 'CatalogsWithExtra', args: { extra: [] } }
            }, 'board');
        }
    }, [metaDetails.libraryItem]);

    const markAsUnwatched = React.useCallback(async () => {
        if (metaDetails.libraryItem && typeof metaDetails.libraryItem._id === 'string') {
            await core.transport.dispatch({
                action: 'Ctx',
                args: {
                    action: 'LibraryItemMarkAsWatched',
                    args: {
                        id: metaDetails.libraryItem._id,
                        is_watched: false
                    }
                }
            });
            // after core processes the change, reload the board model so the card watched state updates
            await core.transport.dispatch({
                action: 'Load',
                args: { model: 'CatalogsWithExtra', args: { extra: [] } }
            }, 'board');
        }
    }, [metaDetails.libraryItem]);

    // optimistic local watched state with persistence
    const [localWatched, setLocalWatched] = React.useState(() => {
        // Check localStorage for persisted state
        if (metaDetails.metaItem?.content?.content?.id) {
            const storedState = localStorage.getItem(`watched_${metaDetails.metaItem.content.content.id}`);
            return storedState ? JSON.parse(storedState) : null;
        }
        return null;
    });

    // set optimistic state when user clicks
    const watchedOverrides = require('stremio/common/watchedOverrides');

    const markAsWatchedOptimistic = React.useCallback(async () => {
        if (metaDetails.metaItem?.content?.content?.id) {
            const newState = true;
            setLocalWatched(newState);
            // Persist to localStorage
            localStorage.setItem(`watched_${metaDetails.metaItem.content.content.id}`, JSON.stringify(newState));
        }

        // if item not in library, add it first
        if (!(metaDetails.libraryItem && typeof metaDetails.libraryItem._id === 'string')) {
            if (metaDetails.metaItem && metaDetails.metaItem.content && metaDetails.metaItem.content.content) {
                // set client-side override immediately so board shows tick
                watchedOverrides.set(metaDetails.metaItem.content.content.id, true);
                await core.transport.dispatch({
                    action: 'Ctx',
                    args: {
                        action: 'AddToLibrary',
                        args: metaDetails.metaItem.content.content
                    }
                });
                // after adding, request board reload
                await core.transport.dispatch({
                    action: 'Load',
                    args: { model: 'CatalogsWithExtra', args: { extra: [] } }
                }, 'board');
            }
            return;
        }

        // otherwise dispatch mark now and reload board
        if (metaDetails.libraryItem && typeof metaDetails.libraryItem._id === 'string') {
            // set client-side override immediately so board shows tick
            if (metaDetails.metaItem && metaDetails.metaItem.content && metaDetails.metaItem.content.content) {
                watchedOverrides.set(metaDetails.metaItem.content.content.id, true);
            }
            await core.transport.dispatch({
                action: 'Ctx',
                args: {
                    action: 'LibraryItemMarkAsWatched',
                    args: {
                        id: metaDetails.libraryItem._id,
                        is_watched: true
                    }
                }
            });
            await core.transport.dispatch({
                action: 'Load',
                args: { model: 'CatalogsWithExtra', args: { extra: [] } }
            }, 'board');
        }
    }, [metaDetails.libraryItem]);

    const markAsUnwatchedOptimistic = React.useCallback(async () => {
        if (metaDetails.metaItem?.content?.content?.id) {
            const newState = false;
            setLocalWatched(newState);
            // Persist to localStorage
            localStorage.setItem(`watched_${metaDetails.metaItem.content.content.id}`, JSON.stringify(newState));
        }

        if (metaDetails.metaItem && metaDetails.metaItem.content && metaDetails.metaItem.content.content) {
            watchedOverrides.set(metaDetails.metaItem.content.content.id, false);
        }

        if (metaDetails.libraryItem && typeof metaDetails.libraryItem._id === 'string') {
            await core.transport.dispatch({
                action: 'Ctx',
                args: {
                    action: 'LibraryItemMarkAsWatched',
                    args: {
                        id: metaDetails.libraryItem._id,
                        is_watched: false
                    }
                }
            });
            await core.transport.dispatch({
                action: 'Load',
                args: { model: 'CatalogsWithExtra', args: { extra: [] } }
            }, 'board');
        }
    }, [metaDetails.libraryItem, metaDetails.metaItem]);

    // dispatch mark/unmark when library item appears or when localWatched changes
    const pendingMarkRef = React.useRef(false);
    React.useEffect(() => {
        const lib = metaDetails.libraryItem;
        if (!lib || typeof lib._id !== 'string') {
            return;
        }

        // if user requested watched and library item exists but core hasn't set it
        if (localWatched === true && !lib.state?.is_watched && !pendingMarkRef.current) {
            pendingMarkRef.current = true;
            (async () => {
                await core.transport.dispatch({
                    action: 'Ctx',
                    args: {
                        action: 'LibraryItemMarkAsWatched',
                        args: {
                            id: lib._id,
                            is_watched: true
                        }
                    }
                });
                // refresh board after core processes
                await core.transport.dispatch({
                    action: 'Load',
                    args: { model: 'CatalogsWithExtra', args: { extra: [] } }
                }, 'board');
                // clear pending after a tick
                setTimeout(() => { pendingMarkRef.current = false; }, 500);
            })();
        }

        if (localWatched === false && lib.state?.is_watched && !pendingMarkRef.current) {
            pendingMarkRef.current = true;
            (async () => {
                await core.transport.dispatch({
                    action: 'Ctx',
                    args: {
                        action: 'LibraryItemMarkAsWatched',
                        args: {
                            id: lib._id,
                            is_watched: false
                        }
                    }
                });
                await core.transport.dispatch({
                    action: 'Load',
                    args: { model: 'CatalogsWithExtra', args: { extra: [] } }
                }, 'board');
                setTimeout(() => { pendingMarkRef.current = false; }, 500);
            })();
        }
    }, [localWatched, metaDetails.libraryItem, core.transport]);

    // keep local override persisted and prefer localStorage overrides over server state
    React.useEffect(() => {
        const id = metaDetails.metaItem && metaDetails.metaItem.content && metaDetails.metaItem.content.content
            ? metaDetails.metaItem.content.content.id
            : null;

        if (!id) {
            // nothing to do if no meta id yet
            return;
        }

        // if user has a persisted override for this meta id, restore it and keep it
        const stored = localStorage.getItem(`watched_${id}`);
        if (stored !== null) {
            try {
                const parsed = JSON.parse(stored);
                setLocalWatched(parsed);
            } catch (e) {
                // malformed value -> remove it
                localStorage.removeItem(`watched_${id}`);
                setLocalWatched(null);
            }
            // don't clear watchedOverrides in this case — we intentionally persist the user's choice
            return;
        }

        // no persisted override -> clear optimistic local state and any watchedOverrides
        setLocalWatched(null);
        watchedOverrides.clear(id);
    }, [metaDetails.libraryItem?.state?.is_watched, metaDetails.libraryItem?._id, metaDetails.metaItem]);
    const toggleNotifications = React.useCallback(() => {
        if (metaDetails.libraryItem) {
            core.transport.dispatch({
                action: 'Ctx',
                args: {
                    action: 'ToggleLibraryItemNotifications',
                    args: [metaDetails.libraryItem._id, !metaDetails.libraryItem.state.noNotif],
                }
            });
        }
    }, [metaDetails.libraryItem]);
    const seasonOnSelect = React.useCallback((event) => {
        setSeason(event.value);
    }, [setSeason]);
    const handleEpisodeSearch = React.useCallback((season, episode) => {
        const searchVideoHash = encodeURIComponent(`${urlParams.id}:${season}:${episode}`);
        const url = window.location.hash;
        const searchVideoPath = url.replace(encodeURIComponent(urlParams.videoId), searchVideoHash);
        window.location = searchVideoPath;
    }, [urlParams, window.location]);

    const renderBackgroundImageFallback = React.useCallback(() => null, []);
    const renderBackground = React.useMemo(() => !!(
        metaPath &&
        metaDetails?.metaItem &&
        metaDetails.metaItem.content.type !== 'Loading' &&
        typeof metaDetails.metaItem.content.content?.background === 'string' &&
        metaDetails.metaItem.content.content.background.length > 0
    ), [metaPath, metaDetails]);

    return (
        <div className={styles['metadetails-container']}>
            {
                renderBackground ?
                    <div className={styles['background-image-layer']}>
                        <Image
                            className={styles['background-image']}
                            src={metaDetails.metaItem.content.content.background}
                            renderFallback={renderBackgroundImageFallback}
                            alt={' '}
                        />
                    </div>
                    :
                    null
            }
            <HorizontalNavBar
                className={styles['nav-bar']}
                backButton={true}
                fullscreenButton={true}
                navMenu={true}
            />
            <div className={styles['metadetails-content']}>
                {
                    tabs.length > 0 ?
                        <VerticalNavBar
                            className={styles['vertical-nav-bar']}
                            tabs={tabs}
                            selected={metaExtension !== null ? metaExtension.url : null}
                        />
                        :
                        null
                }
                {
                    metaPath === null ?
                        <DelayedRenderer delay={500}>
                            <div className={styles['meta-message-container']}>
                                <Image className={styles['image']} src={require('/images/empty.png')} alt={' '} />
                                <div className={styles['message-label']}>{t('ERR_NO_META_SELECTED')}</div>
                            </div>
                        </DelayedRenderer>
                        :
                        metaDetails.metaItem === null ?
                            <div className={styles['meta-message-container']}>
                                <Image className={styles['image']} src={require('/images/empty.png')} alt={' '} />
                                <div className={styles['message-label']}>{t('ERR_NO_ADDONS_FOR_META')}</div>
                            </div>
                            :
                            metaDetails.metaItem.content.type === 'Err' ?
                                <div className={styles['meta-message-container']}>
                                    <Image className={styles['image']} src={require('/images/empty.png')} alt={' '} />
                                    <div className={styles['message-label']}>{t('ERR_NO_META_FOUND')}</div>
                                </div>
                                :
                                metaDetails.metaItem.content.type === 'Loading' ?
                                    <MetaPreview.Placeholder className={styles['meta-preview']} />
                                    :
                                    <React.Fragment>
                                        <MetaPreview
                                            className={classnames(styles['meta-preview'], 'animation-fade-in')}
                                            name={metaDetails.metaItem.content.content.name}
                                            logo={metaDetails.metaItem.content.content.logo}
                                            runtime={metaDetails.metaItem.content.content.runtime}
                                            releaseInfo={metaDetails.metaItem.content.content.releaseInfo}
                                            released={metaDetails.metaItem.content.content.released}
                                            description={
                                                video !== null && typeof video.overview === 'string' && video.overview.length > 0 ?
                                                    video.overview
                                                    :
                                                    metaDetails.metaItem.content.content.description
                                            }
                                            links={metaDetails.metaItem.content.content.links}
                                            trailerStreams={metaDetails.metaItem.content.content.trailerStreams}
                                            inLibrary={metaDetails.metaItem.content.content.inLibrary}
                                            toggleInLibrary={metaDetails.metaItem.content.content.inLibrary ? removeFromLibrary : addToLibrary}
                                            watched={typeof localWatched === 'boolean' ? localWatched : metaDetails.libraryItem?.state?.is_watched}
                                            markAsWatched={markAsWatchedOptimistic}
                                            markAsUnwatched={markAsUnwatchedOptimistic}
                                            metaId={metaDetails.metaItem.content.content.id}
                                            ratingInfo={metaDetails.ratingInfo}
                                        />
                                    </React.Fragment>
                }
                <div className={styles['spacing']} />
                {
                    streamPath !== null ?
                        <StreamsList
                            className={styles['streams-list']}
                            streams={metaDetails.streams}
                            video={video}
                            type={streamPath.type}
                            onEpisodeSearch={handleEpisodeSearch}
                        />
                        :
                        metaPath !== null ?
                            <VideosList
                                className={styles['videos-list']}
                                metaItem={metaDetails.metaItem}
                                libraryItem={metaDetails.libraryItem}
                                season={season}
                                seasonOnSelect={seasonOnSelect}
                                toggleNotifications={toggleNotifications}
                            />
                            :
                            null
                }
            </div>
            {
                metaExtension !== null ?
                    <ModalDialog
                        className={styles['meta-extension-modal-container']}
                        title={metaExtension.name}
                        onCloseRequest={clearMetaExtension}>
                        <iframe
                            className={styles['meta-extension-modal-iframe']}
                            sandbox={'allow-forms allow-scripts allow-same-origin'}
                            src={metaExtension.url}
                        />
                    </ModalDialog>
                    :
                    null
            }
        </div>
    );
};

MetaDetails.propTypes = {
    urlParams: PropTypes.shape({
        type: PropTypes.string,
        id: PropTypes.string,
        videoId: PropTypes.string
    }),
    queryParams: PropTypes.instanceOf(URLSearchParams)
};

const MetaDetailsFallback = () => (
    <div className={styles['metadetails-container']}>
        <HorizontalNavBar
            className={styles['nav-bar']}
            backButton={true}
            fullscreenButton={true}
            navMenu={true}
        />
    </div>
);

module.exports = withCoreSuspender(MetaDetails, MetaDetailsFallback);
