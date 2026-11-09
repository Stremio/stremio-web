// Copyright (C) 2017-2023 Smart code 203358507

const React = require('react');
const { useTranslation } = require('react-i18next');
const { useParams } = require('react-router');
const { useSearchParams } = require('react-router-dom');
const classnames = require('classnames');
const { default: Icon } = require('@stremio/stremio-icons/react');
const { useCore } = require('stremio/core');
const { CONSTANTS, useBinaryState, useMediaQuery, useOnScrollToBottom, withCoreSuspender } = require('stremio/common');
const { epgDateKey, parseEpgDate } = require('stremio/common/EPG');
const screenSizes = require('stremio/common/screen-sizes.less');
const { default: getMetaDetailsHref } = require('stremio/common/getMetaDetailsHref');
const { useRouteActive } = require('stremio/common/useRouteFocused');
const { useNavigateWithOrigin } = require('stremio-router');
const { AddonDetailsModal, Button, DelayedRenderer, Image, MainNavBars, MetaItem, MetaPreview, ModalDialog, MultiselectMenu } = require('stremio/components');
const { default: MetaPreviewSheet } = require('stremio/components/MetaPreviewSheet');
const useDiscover = require('./useDiscover');
const useSelectableInputs = require('./useSelectableInputs');
const { default: FiltersSheet } = require('./FiltersSheet');
const { default: Guide } = require('./Guide');
const { default: DaySelector } = require('./Guide/DaySelector');
const { default: ProgramPreview } = require('./Guide/ProgramPreview');
const { default: useLiveTvGuide } = require('./useLiveTvGuide');
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
    const [filtersOpen, openFilters, closeFilters] = useBinaryState(false);
    const selectedTypeOption = selectInputs[0].options.find(({ value }) => value === selectInputs[0].value);
    const selectedCatalogOption = selectInputs[1].options.find(({ value }) => value === selectInputs[1].value);
    const activeFilterCount = selectInputs.filter(({ active }) => active).length;
    const [addonModalOpen, openAddonModal, closeAddonModal] = useBinaryState(false);
    const [mobilePreviewOpen, openMobilePreview, closeMobilePreview] = useBinaryState(false);
    const [selectedMetaItemIndex, setSelectedMetaItemIndex] = React.useState(0);
    const isMobile = useMediaQuery(`(max-width: ${screenSizes.xsmall})`);

    const compactEpgDate = useMediaQuery(`(max-width: ${screenSizes.xsmall}) and (max-height: ${screenSizes['phone-landscape-size']}) and (orientation: landscape)`);

    const selectedMetaItem = React.useMemo(() => {
        return discover.catalog?.content.type === 'Ready' &&
            discover.catalog.content.content[selectedMetaItemIndex] || null;
    }, [discover.catalog, selectedMetaItemIndex]);

    const metasContainerRef = React.useRef();
    const previousCatalogSizeRef = React.useRef(0);

    const [epgSelection, setEpgSelection] = React.useState(null);
    const isEpgLayout = discover.selectable.catalogs.find(({ selected }) => selected)?.isEpgGuide === true;
    const guide = useLiveTvGuide(discover, epgDate, isEpgLayout);
    const selectedEpg = React.useMemo(() => {
        if (!isEpgLayout) {
            return null;
        }

        const selectedProgram = epgSelection && guide.programs[epgSelection.channelId]?.find(({ startTime }) => startTime.getTime() === epgSelection.start);
        const channel = guide.channels.find(({ id }) => selectedProgram ? id === epgSelection.channelId : guide.programs[id]?.length > 0);
        if (!channel) {
            return null;
        }

        const programs = guide.programs[channel.id];
        return {
            program: selectedProgram ?? programs.find(({ endTime }) => endTime.getTime() > guide.now) ?? programs[0],
            channelHref: getMetaDetailsHref(channel.deepLinks),
        };
    }, [isEpgLayout, epgSelection, guide.channels, guide.programs, guide.now]);
    const onEpgDayChange = React.useCallback((day) => {
        const date = epgDateKey(day);
        setEpgSelection(null);
        setQueryParams((params) => {
            const nextParams = new URLSearchParams(params);
            nextParams.set('epg_date', date);
            return nextParams;
        }, { replace: true });
    }, [setQueryParams]);
    const onEpgProgramFocus = React.useCallback((program, channel) => {
        setEpgSelection({ channelId: channel.id, start: program.startTime.getTime() });
    }, []);

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

        if (event.currentTarget.dataset.index !== selectedMetaItemIndex.toString()) {
            event.preventDefault();
            event.currentTarget.focus();
        }
    }, [isMobile, selectedMetaItemIndex, openMobilePreview]);
    const onEpgProgramClick = React.useCallback((program, channel) => {
        if (!isMobile && program === selectedEpg?.program) {
            if (selectedEpg.channelHref !== null) {
                navigateWithOrigin(selectedEpg.channelHref);
            }
            return;
        }

        onEpgProgramFocus(program, channel);
        if (isMobile) {
            openMobilePreview();
        }
    }, [isMobile, selectedEpg, onEpgProgramFocus, openMobilePreview, navigateWithOrigin]);
    const onScrollToBottom = React.useCallback(() => {
        if (hasNextPage) {
            loadNextPage();
        }
    }, [hasNextPage, loadNextPage]);
    const onScroll = useOnScrollToBottom(onScrollToBottom, SCROLL_TO_BOTTOM_THRESHOLD);
    React.useEffect(() => {
        if (!isMobile) closeFilters();
        closeAddonModal();
        closeMobilePreview();
        setSelectedMetaItemIndex(0);
        setEpgSelection(null);
    }, [discover.selected, isMobile, closeFilters, closeAddonModal, closeMobilePreview]);
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
                <Guide
                    {...guide}
                    selectedProgram={isMobile ? null : selectedEpg?.program ?? null}
                    onProgramClick={onEpgProgramClick}
                    onProgramFocus={onEpgProgramFocus}
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

    const showHref = selectedMetaItem?.deepLinks.player ?? selectedMetaItem?.deepLinks.metaDetailsStreams ?? selectedMetaItem?.deepLinks.metaDetailsVideos ?? null;
    const metaPreviewProps = selectedMetaItem && {
        name: selectedMetaItem.name,
        logo: selectedMetaItem.logo,
        runtime: selectedMetaItem.runtime,
        releaseInfo: selectedMetaItem.releaseInfo,
        released: selectedMetaItem.released,
        description: selectedMetaItem.description,
        trailerHref: selectedMetaItem.trailerStreams[0]?.deepLinks.player ?? null,
        inLibrary: selectedMetaItem.inLibrary,
        onToggleLibrary: selectedMetaItem.inLibrary ? removeFromLibrary : addToLibrary,
        watched: selectedMetaItem.watched,
        onToggleWatched: toggleWatched,
    };

    const renderMetaPreview = () => {
        if (isMobile) {
            return null;
        }

        if (isEpgLayout) {
            if (selectedEpg !== null) {
                return (
                    <ProgramPreview
                        className={styles['preview']}
                        program={selectedEpg.program}
                        now={guide.now}
                        channelHref={selectedEpg.channelHref}
                    />
                );
            } else if (guide.loading) {
                return <div className={styles['preview']} />;
            }

            return null;
        }

        if (selectedMetaItem !== null) {
            return (
                <MetaPreview
                    {...metaPreviewProps}
                    className={styles['preview']}
                    background={selectedMetaItem.poster}
                    links={selectedMetaItem.links}
                    show={showHref !== null ? { href: showHref } : null}
                />
            );
        } else if (discover.catalog?.content.type === 'Loading') {
            return <div className={styles['preview']} />;
        }

        return null;
    };

    React.useEffect(() => {
        if (!routeActive) {
            closeFilters();
            closeMobilePreview();
        }
    }, [routeActive, closeFilters, closeMobilePreview]);
    const pendingHrefRef = React.useRef(null);
    const onMobileShowClick = React.useCallback((event) => {
        event.preventDefault();
        pendingHrefRef.current = selectedEpg !== null ? selectedEpg.channelHref : getMetaDetailsHref(selectedMetaItem && selectedMetaItem.deepLinks);
        closeMobilePreview();
    }, [selectedEpg, selectedMetaItem, closeMobilePreview]);
    const onMobilePreviewExited = React.useCallback(() => {
        const href = pendingHrefRef.current;
        pendingHrefRef.current = null;
        if (typeof href === 'string') {
            navigateWithOrigin(href);
        }
    }, [navigateWithOrigin]);
    const renderMobilePreview = () => {
        if (selectedEpg !== null) {
            return (
                <ProgramPreview
                    program={selectedEpg.program}
                    now={guide.now}
                    channelHref={selectedEpg.channelHref}
                    onShowClick={onMobileShowClick}
                />
            );
        }

        return (
            <MetaPreview
                {...metaPreviewProps}
                background={selectedMetaItem.background || selectedMetaItem.poster}
                links={selectedMetaItem.links?.filter((link) => link?.category !== 'Cast' && link?.category !== 'Directors')}
                show={showHref !== null ? { href: showHref, icon: 'chevron-forward', onClick: onMobileShowClick } : null}
            />
        );
    };
    return (
        <MainNavBars className={styles['discover-container']} route={'discover'}>
            <div className={styles['discover-content']}>
                <div className={styles['catalog-container']}>
                    <div className={classnames(styles['selectable-inputs-container'], { [styles['epg-inputs']]: isEpgLayout })}>
                        {isMobile ? <div className={styles['mobile-filters']}>
                            <div className={styles['catalog-summary']}>
                                <div className={styles['catalog-type']}>{selectedTypeOption?.label ?? t('SELECT_TYPE')}</div>
                                <div className={styles['catalog-name']} title={selectedCatalogOption?.label}>{selectedCatalogOption?.label ?? t('SELECT_CATALOG')}</div>
                            </div>
                            <Button
                                className={styles['mobile-filter-button']}
                                role={'button'}
                                aria-label={t('CATALOG_FILTERS')}
                                aria-haspopup={'dialog'}
                                aria-expanded={filtersOpen}
                                onClick={openFilters}
                            >
                                <Icon name={'filters'} />
                                <span>{t('FILTERS')}</span>
                                {activeFilterCount > 0 && <span className={styles['filter-count']}>{activeFilterCount}</span>}
                            </Button>
                        </div> : <div className={styles['selectable-inputs']}>
                            {selectInputs.map(({ title, options, value, onSelect }, index) => (
                                <MultiselectMenu
                                    key={index}
                                    className={styles['select-input']}
                                    title={title}
                                    options={options}
                                    value={value}
                                    onSelect={onSelect}
                                    portal={isEpgLayout}
                                />
                            ))}
                            <div className={styles['filter-container']}>
                                <Button className={styles['filter-button']} title={t('ALL_FILTERS')} onClick={openFilters}>
                                    <Icon className={styles['filter-icon']} name={'filters'} />
                                </Button>
                            </div>
                        </div>}
                        {
                            isEpgLayout && compactEpgDate ?
                                <DaySelector
                                    compact={true}
                                    selectedDate={guide.selectedDate}
                                    today={guide.today}
                                    onDayChange={onEpgDayChange}
                                />
                                :
                                null
                        }
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
                    {
                        isEpgLayout && !compactEpgDate ?
                            <DaySelector
                                selectedDate={guide.selectedDate}
                                today={guide.today}
                                onDayChange={onEpgDayChange}
                            />
                            :
                            null
                    }
                    {renderCatalogContent()}
                </div>
                {renderMetaPreview()}
            </div>
            {
                selectedEpg !== null || selectedMetaItem !== null ?
                    <MetaPreviewSheet
                        show={isMobile && mobilePreviewOpen}
                        onCloseRequest={closeMobilePreview}
                        onExited={onMobilePreviewExited}
                        ariaLabel={selectedEpg?.program.title ?? selectedMetaItem.name}
                    >
                        {renderMobilePreview()}
                    </MetaPreviewSheet>
                    :
                    null
            }
            <FiltersSheet inputs={selectInputs} show={isMobile && filtersOpen} onCloseRequest={closeFilters} />
            {
                filtersOpen && !isMobile ?
                    <ModalDialog title={t('CATALOG_FILTERS')} className={styles['selectable-inputs-modal']} onCloseRequest={closeFilters}>
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
