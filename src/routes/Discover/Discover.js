// Copyright (C) 2017-2023 Smart code 203358507

const React = require('react');
const { useTranslation } = require('react-i18next');
const { useParams } = require('react-router');
const { useSearchParams } = require('react-router-dom');
const classnames = require('classnames');
const { default: Icon } = require('@stremio/stremio-icons/react');
const { useCore } = require('stremio/core');
const { CONSTANTS, useBinaryState, useModelState, useOnScrollToBottom, withCoreSuspender } = require('stremio/common');
const { AddonDetailsModal, Button, DelayedRenderer, Image, MainNavBars, MetaItem, MetaPreview, ModalDialog, MultiselectMenu } = require('stremio/components');
const useDiscover = require('./useDiscover');
const useSelectableInputs = require('./useSelectableInputs');
const { default: EpgGuide } = require('./EpgGuide');
const { useEpgNow } = require('stremio/common/EPG');
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
        return date !== null && /^\d{4}-\d{2}-\d{2}$/.test(date) ? date : null;
    }, [queryParams]);
    const catalogQueryParams = React.useMemo(() => {
        const params = new URLSearchParams(queryParams);
        params.delete('epg_date');
        return params;
    }, [queryParams]);
    const { t } = useTranslation();
    const core = useCore();
    const [discover, loadNextPage] = useDiscover(urlParams, catalogQueryParams);
    const [selectInputs, hasNextPage] = useSelectableInputs(discover);
    const [inputsModalOpen, openInputsModal, closeInputsModal] = useBinaryState(false);
    const [addonModalOpen, openAddonModal, closeAddonModal] = useBinaryState(false);
    const [selectedMetaItemIndex, setSelectedMetaItemIndex] = React.useState(0);

    const selectedMetaItem = React.useMemo(() => {
        return discover.catalog?.content.type === 'Ready' &&
            discover.catalog.content.content[selectedMetaItemIndex] || null;
    }, [discover.catalog, selectedMetaItemIndex]);

    const metasContainerRef = React.useRef();
    const metaPreviewRef = React.useRef();

    const [selectedEpgProgram, setSelectedEpgProgram] = React.useState(null);
    const isEpgLayout = React.useMemo(() => {
        const selectedAddon = discover.selectable.catalogs.find(({ selected }) => selected)?.addon ?? null;
        return selectedAddon?.manifest?.behaviorHints?.epgProvider === true;
    }, [discover.selectable.catalogs]);
    // Load the core LiveTvGuide model for the selected guide catalog.
    // `date` is the user's local date (null defaults to the local today);
    // core resolves it to a UTC window via `utcOffset`, fetches a catalog
    // page per overlapping UTC date and buckets the shows back into the day.
    const loadLiveTvGuide = React.useCallback(() => {
        if (!isEpgLayout || !discover.selected?.request) {
            return;
        }

        core.transport.dispatch({
            action: 'Load',
            args: {
                model: 'LiveTvGuide',
                args: {
                    request: discover.selected.request,
                    date: epgDate,
                    utcOffset: -new Date().getTimezoneOffset(),
                },
            },
        }, 'live_tv_guide');
    }, [isEpgLayout, discover.selected, epgDate]);
    React.useEffect(() => {
        loadLiveTvGuide();

        return () => {
            core.transport.dispatch({ action: 'Unload' }, 'live_tv_guide');
        };
    }, [loadLiveTvGuide]);
    const liveTvGuide = useModelState({ model: 'live_tv_guide' });
    const epgNow = useEpgNow(isEpgLayout);
    const epgChannels = React.useMemo(() => {
        return (liveTvGuide?.channels ?? []).map(({ channel, deepLinks }) => ({
            id: channel.id,
            type: channel.type,
            name: channel.name,
            logo: channel.logo ?? channel.poster ?? null,
            deepLinks,
        }));
    }, [liveTvGuide]);
    const epgPrograms = React.useMemo(() => {
        return (liveTvGuide?.channels ?? []).reduce((programs, { channel, shows }) => {
            programs[channel.id] = shows.map((show) => ({
                id: show.id,
                title: show.title ?? channel.name,
                overview: show.overview ?? null,
                thumbnail: show.thumbnail ?? null,
                links: show.links,
                runtime: show.runtime ?? null,
                releaseInfo: show.releaseInfo ?? null,
                released: show.released ?? null,
                genres: show.genres,
                cast: show.cast,
                directors: show.directors,
                startTime: new Date(show.startTime),
                endTime: new Date(show.endTime),
                channelId: channel.id,
                channelName: channel.name,
                channelLogo: channel.logo ?? channel.poster ?? null,
                deepLinks: show.deepLinks,
                raw: show,
            }));
            return programs;
        }, {});
    }, [liveTvGuide]);
    const epgLoading = React.useMemo(() => {
        const catalog = liveTvGuide?.catalog ?? [];
        return catalog.length === 0 || catalog[catalog.length - 1].type === 'Loading';
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
        const date = [
            day.getFullYear(),
            String(day.getMonth() + 1).padStart(2, '0'),
            String(day.getDate()).padStart(2, '0'),
        ].join('-');
        setQueryParams((params) => {
            const nextParams = new URLSearchParams(params);
            nextParams.set('epg_date', date);
            return nextParams;
        }, { replace: true });
    }, [setQueryParams]);
    const onProgramSelect = React.useCallback((program, channel) => {
        setSelectedEpgProgram({ program, channel });
    }, []);
    const closeEpgPreviewModal = React.useCallback(() => {
        setSelectedEpgProgram(null);
    }, []);

    React.useEffect(() => {
        if (!isEpgLayout && discover.catalog?.content.type === 'Loading' && metasContainerRef.current) {
            metasContainerRef.current.scrollTop = 0;
        }
    }, [discover.catalog, isEpgLayout]);
    React.useEffect(() => {
        if (!isEpgLayout && hasNextPage && metasContainerRef.current) {
            const containerHeight = metasContainerRef.current.scrollHeight;
            const viewportHeight = metasContainerRef.current.clientHeight;
            if (containerHeight <= viewportHeight + SCROLL_TO_BOTTOM_THRESHOLD) {
                loadNextPage();
            }
        }
    }, [isEpgLayout, hasNextPage, loadNextPage]);

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
        const visible = window.getComputedStyle(metaPreviewRef.current).display !== 'none';
        if (event.currentTarget.dataset.index !== selectedMetaItemIndex.toString() && visible) {
            event.preventDefault();
            event.currentTarget.focus();
        }
    }, [selectedMetaItemIndex]);
    const onScrollToBottom = React.useCallback(() => {
        if (hasNextPage) {
            loadNextPage();
        }
    }, [hasNextPage, loadNextPage]);
    const onScroll = useOnScrollToBottom(onScrollToBottom, SCROLL_TO_BOTTOM_THRESHOLD);
    React.useEffect(() => {
        closeInputsModal();
        closeAddonModal();
        setSelectedMetaItemIndex(0);
        setSelectedEpgProgram(null);
    }, [discover.selected]);
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
                    programsLoading={epgLoading}
                    catalogLoading={epgLoading}
                    selectedDate={liveTvGuide?.selected?.date ?? epgDate}
                    today={liveTvGuide?.selectable?.today ?? null}
                    error={epgError}
                    onRetry={loadLiveTvGuide}
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

        const { program } = selectedEpgProgram;
        const isCurrentProgram = program.startTime.getTime() <= epgNow && epgNow < program.endTime.getTime();

        return (
            <ModalDialog
                className={styles['epg-preview-modal']}
                background={program.thumbnail ?? undefined}
                onCloseRequest={closeEpgPreviewModal}
            >
                <MetaPreview
                    className={styles['epg-preview']}
                    compact={true}
                    name={program.title}
                    logo={program.channelLogo}
                    background={program.thumbnail}
                    runtime={program.runtime}
                    releaseInfo={program.releaseInfo}
                    released={program.released}
                    description={program.overview}
                    links={program.links}
                    deepLinks={isCurrentProgram ? program.deepLinks : undefined}
                />
            </ModalDialog>
        );
    };

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
