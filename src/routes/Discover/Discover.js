// Copyright (C) 2017-2023 Smart code 203358507

const React = require('react');
const { useTranslation } = require('react-i18next');
const { useParams } = require('react-router');
const { useSearchParams } = require('react-router-dom');
const classnames = require('classnames');
const { default: Icon } = require('@stremio/stremio-icons/react');
const { useCore } = require('stremio/core');
const { CONSTANTS, useBinaryState, useMediaQuery, useModelState, useOnScrollToBottom, withCoreSuspender } = require('stremio/common');
const { XSMALL_WIDTH } = require('stremio/common/screenSizes');
const { default: getMetaDetailsHref } = require('stremio/common/getMetaDetailsHref');
const { useRouteActive } = require('stremio/common/useRouteFocused');
const { useNavigateWithOrigin } = require('stremio-router');
const { AddonDetailsModal, BottomSheet, Button, DelayedRenderer, Image, MainNavBars, MetaItem, MetaPreview, ModalDialog, MultiselectMenu } = require('stremio/components');
const useDiscover = require('./useDiscover');
const useSelectableInputs = require('./useSelectableInputs');
const { default: EpgGuide } = require('./EpgGuide');
const { default: EpgProgramModal } = require('stremio/components/EpgProgramModal');
const { useEpgNow, epgDateKey, epgDayWindow, parseEpgDate, toEpgProgram } = require('stremio/common/EPG');
const styles = require('./styles');

const SCROLL_TO_BOTTOM_THRESHOLD = 400;

const Discover = () => {
    const { type, transportUrl, catalogId } = useParams();
    const urlParams = React.useMemo(() => ({
        type,
        transportUrl,
        catalogId
    }), [type, transportUrl, catalogId]);
    const [queryParams, setQueryParams] = useSearchParams();
    // the selected EPG date lives in the `epg_date` query param only -
    // it is stripped from the catalog extra passed to the discover model
    const epgDate = React.useMemo(() => {
        const date = queryParams.get('epg_date');
        return parseEpgDate(date) !== null ? date : null;
    }, [queryParams]);
    const catalogQueryParams = React.useMemo(() => {
        const params = new URLSearchParams(queryParams);
        params.delete('epg_date');
        return params;
    }, [queryParams]);
    const { t } = useTranslation();
    const core = useCore();
    const { navigateWithOrigin } = useNavigateWithOrigin();
    const routeActive = useRouteActive();
    const [discover, loadNextPage] = useDiscover(urlParams, catalogQueryParams);
    const [selectInputs, hasNextPage] = useSelectableInputs(discover);
    const [inputsModalOpen, openInputsModal, closeInputsModal] = useBinaryState(false);
    const [addonModalOpen, openAddonModal, closeAddonModal] = useBinaryState(false);
    const [mobilePreviewOpen, openMobilePreview, closeMobilePreview] = useBinaryState(false);
    const [selectedMetaItemIndex, setSelectedMetaItemIndex] = React.useState(0);
    const isMobile = useMediaQuery(`(max-width: ${XSMALL_WIDTH}px)`);

    const selectedMetaItem = React.useMemo(() => {
        return discover.catalog?.content.type === 'Ready' &&
            discover.catalog.content.content[selectedMetaItemIndex] || null;
    }, [discover.catalog, selectedMetaItemIndex]);

    const metasContainerRef = React.useRef();
    const metaPreviewRef = React.useRef();
    const previousCatalogSizeRef = React.useRef(0);

    const [selectedEpgProgram, setSelectedEpgProgram] = React.useState(null);
    const [epgPreviewOpen, openEpgPreview, closeEpgPreviewModal] = useBinaryState(false);
    const isEpgLayout = React.useMemo(() => {
        return discover.selectable.catalogs.find(({ selected }) => selected)?.isEpgGuide === true;
    }, [discover.selectable.catalogs]);
    const epgNow = useEpgNow(isEpgLayout && routeActive);
    const epgFollowedDate = epgDate ?? epgDateKey(new Date(epgNow));
    const epgTimezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
    const epgDay = React.useMemo(() => {
        const { start, end } = epgDayWindow(parseEpgDate(epgFollowedDate));
        return { start: new Date(start).toISOString(), end: new Date(end).toISOString() };
    }, [epgFollowedDate, epgTimezone]);
    const loadLiveTvGuide = React.useCallback(() => {
        if (!isEpgLayout || !discover.selected?.request || !routeActive) return;
        core.transport.dispatch({
            action: 'Load',
            args: {
                model: 'LiveTvGuide',
                args: {
                    request: discover.selected.request,
                    date: epgFollowedDate,
                    day: epgDay,
                    utcOffset: -new Date().getTimezoneOffset(),
                },
            },
        }, 'live_tv_guide');
    }, [isEpgLayout, discover.selected, routeActive, epgFollowedDate, epgDay]);
    React.useEffect(() => {
        loadLiveTvGuide();
    }, [loadLiveTvGuide, epgNow]);
    React.useEffect(() => {
        if (!isEpgLayout) core.transport.dispatch({ action: 'Unload' }, 'live_tv_guide');
    }, [isEpgLayout]);
    const retryLiveTvGuide = React.useCallback(() => {
        core.transport.dispatch({ action: 'LiveTvGuide', args: { action: 'Retry' } }, 'live_tv_guide');
    }, []);
    const liveTvGuide = useModelState({ model: 'live_tv_guide' });
    const epgChannels = React.useMemo(() => {
        return (liveTvGuide?.channels ?? []).map(({ channel, deepLinks }) => ({
            id: channel.id,
            type: channel.type,
            name: channel.name,
            logo: channel.logo ?? channel.poster ?? null,
            deepLinks,
        }));
    }, [liveTvGuide?.channels]);
    const epgPrograms = React.useMemo(() => {
        return (liveTvGuide?.channels ?? []).reduce((programs, { channel, shows }) => {
            const epgChannel = { ...channel, logo: channel.logo ?? channel.poster ?? null };
            programs[channel.id] = shows.map((show) => toEpgProgram(show, epgChannel)).filter(Boolean);
            return programs;
        }, {});
    }, [liveTvGuide?.channels]);
    const epgLoading = React.useMemo(() => {
        const catalog = liveTvGuide?.catalog ?? [];
        return catalog.length === 0 || catalog.some((page) => page.type === 'Loading');
    }, [liveTvGuide]);
    const epgError = React.useMemo(() => {
        const page = (liveTvGuide?.catalog ?? []).find(({ type }) => type === 'Err');
        return page ?
            page.content?.content?.message ?? page.content?.type ?? 'Error'
            :
            null;
    }, [liveTvGuide]);
    const epgHasNextPage = (liveTvGuide?.selectable?.nextPage ?? null) !== null;
    const epgLoadNextPage = React.useCallback(() => {
        core.transport.dispatch({
            action: 'LiveTvGuide',
            args: { action: 'LoadNextPage' },
        }, 'live_tv_guide');
    }, []);
    const onEpgDayChange = React.useCallback((day) => {
        const date = epgDateKey(day);
        setQueryParams((params) => {
            const nextParams = new URLSearchParams(params);
            nextParams.set('epg_date', date);
            return nextParams;
        }, { replace: true });
    }, [setQueryParams]);
    const onProgramSelect = React.useCallback((program, channel) => {
        setSelectedEpgProgram({ program, channel });
        openEpgPreview();
    }, [openEpgPreview]);

    React.useEffect(() => {
        if (!isEpgLayout && discover.catalog?.content.type === 'Loading' && metasContainerRef.current) {
            metasContainerRef.current.scrollTop = 0;
            previousCatalogSizeRef.current = 0;
        }
    }, [discover.catalog, isEpgLayout]);
    React.useEffect(() => {
        if (!isEpgLayout && discover.catalog?.content.type === 'Ready') {
            const catalogSize = discover.catalog.content.content.length;
            const hasNewItems = catalogSize > previousCatalogSizeRef.current;
            previousCatalogSizeRef.current = catalogSize;
            if (!hasNextPage || !hasNewItems || !metasContainerRef.current) {
                return;
            }

            const containerHeight = metasContainerRef.current.scrollHeight;
            const viewportHeight = metasContainerRef.current.clientHeight;
            if (containerHeight <= viewportHeight + SCROLL_TO_BOTTOM_THRESHOLD) {
                loadNextPage();
            }
        }
    }, [discover.catalog, isEpgLayout, hasNextPage, loadNextPage]);
    const addToLibrary = React.useCallback(() => {
        if (selectedMetaItem === null) {
            return;
        }

        core.transport.dispatch({
            action: 'Ctx',
            args: {
                action: 'AddToLibrary',
                args: selectedMetaItem
            }
        });
    }, [selectedMetaItem]);
    const removeFromLibrary = React.useCallback(() => {
        if (selectedMetaItem === null) {
            return;
        }

        core.transport.dispatch({
            action: 'Ctx',
            args: {
                action: 'RemoveFromLibrary',
                args: selectedMetaItem.id
            }
        });
    }, [selectedMetaItem]);
    const toggleWatched = React.useCallback(() => {
        if (selectedMetaItem === null) {
            return;
        }

        core.transport.dispatch({
            action: 'Ctx',
            args: {
                action: 'MetaItemMarkAsWatched',
                args: {
                    meta_item: selectedMetaItem,
                    is_watched: !selectedMetaItem.watched,
                }
            }
        });
    }, [selectedMetaItem]);
    const metaItemsOnFocusCapture = React.useCallback((event) => {
        if (event.target.dataset.index !== null && !isNaN(event.target.dataset.index)) {
            setSelectedMetaItemIndex(parseInt(event.target.dataset.index, 10));
        }
    }, []);
    const metaItemOnClick = React.useCallback((event) => {
        const index = Number(event.currentTarget.dataset.index);
        const hasIndex = Number.isInteger(index);

        if (isMobile && hasIndex) {
            event.preventDefault();
            setSelectedMetaItemIndex(index);
            openMobilePreview();
            return;
        }

        if (!hasIndex) {
            return;
        }

        const visible = metaPreviewRef.current && window.getComputedStyle(metaPreviewRef.current).display !== 'none';
        if (event.currentTarget.dataset.index !== selectedMetaItemIndex.toString() && visible) {
            event.preventDefault();
            event.currentTarget.focus();
        }
    }, [isMobile, selectedMetaItemIndex, openMobilePreview]);
    const onScrollToBottom = React.useCallback(() => {
        if (hasNextPage) {
            loadNextPage();
        }
    }, [hasNextPage, loadNextPage]);
    const onScroll = useOnScrollToBottom(onScrollToBottom, SCROLL_TO_BOTTOM_THRESHOLD);
    React.useEffect(() => {
        closeInputsModal();
        closeAddonModal();
        closeMobilePreview();
        setSelectedMetaItemIndex(0);
        setSelectedEpgProgram(null);
    }, [discover.selected, closeInputsModal, closeAddonModal, closeMobilePreview]);
    const renderEmptyState = () => (
        <DelayedRenderer delay={500}>
            <div className={styles['message-container']}>
                <Image className={styles['image']} src={require('/assets/images/empty.png')} alt={' '} />
                <div className={styles['message-label']}>{t('NO_CATALOG_SELECTED')}</div>
            </div>
        </DelayedRenderer>
    );

    const renderErrorState = (msg) => (
        <div className={styles['message-container']}>
            <Image className={styles['image']} src={require('/assets/images/empty.png')} alt={' '} />
            <div className={styles['message-label']}>{msg}</div>
        </div>
    );

    const renderCatalogContent = () => {
        // in EPG mode the discover catalog is intentionally not loaded -
        // the guide feeds from the LiveTvGuide model instead
        if (isEpgLayout) {
            return (
                <EpgGuide
                    channels={epgChannels}
                    programs={epgPrograms}
                    loading={epgLoading}
                    dayWindow={liveTvGuide?.selected?.day}
                    selectedDate={liveTvGuide?.selected?.date ?? epgDate}
                    today={liveTvGuide?.selectable?.today ?? null}
                    error={epgError}
                    onRetry={retryLiveTvGuide}
                    hasNextPage={epgHasNextPage}
                    loadNextPage={epgLoadNextPage}
                    now={epgNow}
                    onProgramSelect={onProgramSelect}
                    onDayChange={onEpgDayChange}
                />
            );
        }

        if (discover.catalog === null) return renderEmptyState();
        if (discover.catalog.content.type === 'Err') return renderErrorState(discover.catalog.content.content);

        if (discover.catalog.content.type === 'Loading') {
            return (
                <div ref={metasContainerRef} className={classnames(styles['meta-items-container'], 'animation-fade-in')}>
                    {Array(CONSTANTS.CATALOG_PAGE_SIZE).fill(null).map((_, index) => (
                        <div key={index} className={styles['meta-item-placeholder']}>
                            <div className={styles['poster-container']} />
                            <div className={styles['title-bar-container']}>
                                <div className={styles['title-label']} />
                            </div>
                        </div>
                    ))}
                </div>
            );
        }

        return (
            <div ref={metasContainerRef} className={classnames(styles['meta-items-container'], 'animation-fade-in')} onScroll={onScroll} onFocusCapture={metaItemsOnFocusCapture}>
                {discover.catalog.content.content.map((metaItem, index) => (
                    <MetaItem
                        key={index}
                        className={classnames({ 'selected': selectedMetaItemIndex === index })}
                        type={metaItem.type}
                        name={metaItem.name}
                        poster={metaItem.poster}
                        posterShape={metaItem.posterShape}
                        playname={selectedMetaItemIndex === index}
                        deepLinks={metaItem.deepLinks}
                        watched={metaItem.watched}
                        data-index={index}
                        onClick={metaItemOnClick}
                    />
                ))}
            </div>
        );
    };

    const renderMetaPreview = () => {
        if (isEpgLayout) {
            return null;
        }

        if (selectedMetaItem !== null) {
            return <MetaPreview
                className={styles['meta-preview-container']}
                compact={true}
                ref={metaPreviewRef}
                name={selectedMetaItem.name}
                logo={selectedMetaItem.logo}
                background={selectedMetaItem.poster}
                runtime={selectedMetaItem.runtime}
                releaseInfo={selectedMetaItem.releaseInfo}
                released={selectedMetaItem.released}
                description={selectedMetaItem.description}
                links={selectedMetaItem.links}
                deepLinks={selectedMetaItem.deepLinks}
                trailerStreams={selectedMetaItem.trailerStreams}
                inLibrary={selectedMetaItem.inLibrary}
                toggleInLibrary={selectedMetaItem.inLibrary ? removeFromLibrary : addToLibrary}
                watched={selectedMetaItem.watched}
                toggleWatched={toggleWatched}
                metaId={selectedMetaItem.id}
                like={selectedMetaItem.like}
            />;
        } else if (discover.catalog !== null && discover.catalog.content.type === 'Loading') {
            return <div className={styles['meta-preview-container']} />;
        }

        return null;
    };
    const renderEpgPreviewModal = () => {
        if (!isEpgLayout || selectedEpgProgram === null) {
            return null;
        }

        const { program, channel } = selectedEpgProgram;
        return <EpgProgramModal
            program={program}
            now={epgNow}
            show={epgPreviewOpen}
            onCloseRequest={closeEpgPreviewModal}
            channelHref={getMetaDetailsHref(channel.deepLinks)}
        />;
    };

    React.useEffect(() => {
        if (!isMobile) {
            closeMobilePreview();
        }
    }, [isMobile, closeMobilePreview]);
    React.useEffect(() => {
        if (!routeActive) {
            closeMobilePreview();
            setSelectedEpgProgram(null);
        }
    }, [routeActive, closeMobilePreview]);
    const onMobileShowClick = React.useCallback((event) => {
        event.preventDefault();
        const href = getMetaDetailsHref(selectedMetaItem && selectedMetaItem.deepLinks);
        closeMobilePreview();
        if (typeof href === 'string') {
            navigateWithOrigin(href);
        }
    }, [selectedMetaItem, closeMobilePreview, navigateWithOrigin]);
    return (
        <MainNavBars className={styles['discover-container']} route={'discover'}>
            <div className={styles['discover-content']}>
                <div className={styles['catalog-container']}>
                    <div className={styles['selectable-inputs-container']}>
                        {selectInputs.map(({ title, options, value, onSelect }, index) => (
                            <MultiselectMenu
                                key={index}
                                className={styles['select-input']}
                                title={title}
                                options={options}
                                value={value}
                                onSelect={onSelect}
                            />
                        ))}
                        <div className={styles['filter-container']}>
                            <Button className={styles['filter-button']} title={t('ALL_FILTERS')} onClick={openInputsModal}>
                                <Icon className={styles['filter-icon']} name={'filters'} />
                            </Button>
                        </div>
                    </div>
                    {
                        discover.catalog !== null && !discover.catalog.installed ?
                            <div className={styles['missing-addon-warning-container']}>
                                <div className={styles['warning-label']}>{t('ERR_ADDON_NOT_INSTALLED')}</div>
                                <Button className={styles['install-button']} title={t('INSTALL_ADDON')} onClick={openAddonModal}>
                                    <div className={styles['label']}>{t('ADDON_INSTALL')}</div>
                                </Button>
                            </div>
                            :
                            null
                    }
                    {renderCatalogContent()}
                </div>
                {renderMetaPreview()}
            </div>
            {renderEpgPreviewModal()}
            {
                selectedMetaItem !== null ?
                    <BottomSheet
                        className={styles['mobile-bottom-sheet']}
                        show={isMobile && mobilePreviewOpen}
                        onCloseRequest={closeMobilePreview}
                        closeOnContentClick={false}
                        closeOnOrientationChange={false}
                        flush={true}
                        ariaLabel={selectedMetaItem.name}
                    >
                        <MetaPreview
                            className={styles['mobile-preview']}
                            compact={true}
                            name={selectedMetaItem.name}
                            logo={selectedMetaItem.logo}
                            background={selectedMetaItem.poster}
                            runtime={selectedMetaItem.runtime}
                            releaseInfo={selectedMetaItem.releaseInfo}
                            released={selectedMetaItem.released}
                            description={selectedMetaItem.description}
                            links={selectedMetaItem.links}
                            deepLinks={selectedMetaItem.deepLinks}
                            trailerStreams={selectedMetaItem.trailerStreams}
                            inLibrary={selectedMetaItem.inLibrary}
                            toggleInLibrary={selectedMetaItem.inLibrary ? removeFromLibrary : addToLibrary}
                            watched={selectedMetaItem.watched}
                            toggleWatched={toggleWatched}
                            metaId={selectedMetaItem.id}
                            like={selectedMetaItem.like}
                            onShowClick={onMobileShowClick}
                        />
                    </BottomSheet>
                    :
                    null
            }
            {
                inputsModalOpen ?
                    <ModalDialog title={t('CATALOG_FILTERS')} className={styles['selectable-inputs-modal']} onCloseRequest={closeInputsModal}>
                        {selectInputs.map(({ title, options, value, onSelect }, index) => (
                            <MultiselectMenu
                                key={index}
                                className={styles['select-input']}
                                title={title}
                                options={options}
                                value={value}
                                onSelect={onSelect}
                            />
                        ))}
                    </ModalDialog>
                    :
                    null
            }
            {
                addonModalOpen && discover.selected !== null ?
                    <AddonDetailsModal transportUrl={discover.selected.request.base} onCloseRequest={closeAddonModal} />
                    :
                    null
            }
        </MainNavBars>
    );
};

const DiscoverFallback = () => (
    <MainNavBars className={styles['discover-container']} route={'discover'} />
);

module.exports = withCoreSuspender(Discover, DiscoverFallback);
