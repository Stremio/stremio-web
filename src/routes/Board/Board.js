// Copyright (C) 2017-2023 Smart code 203358507

const React = require('react');
const classnames = require('classnames');
const useTranslate = require('stremio/common/useTranslate');
const { default: useVisibleCatalogs } = require('stremio/common/useVisibleCatalogs');
const { useStreamingServer, useNotifications, withCoreSuspender, useProfile, useHeroCardSettings } = require('stremio/common');
const { ContinueWatchingItem, EventModal, LiveTvContinueWatchingItem, MainNavBars, MetaItem, MetaRow } = require('stremio/components');
const HeroCard = require('./HeroCard').default;
const useBoard = require('./useBoard');
const useContinueWatchingPreview = require('./useContinueWatchingPreview');
const { default: useLiveTvContinueWatching } = require('./useLiveTvContinueWatching');
const styles = require('./styles');
const { default: StreamingServerWarning } = require('./StreamingServerWarning');

const THRESHOLD = 5;

const CATALOG_VALUE_SEPARATOR = '|';

const parseHeroCatalogValue = (catalogValue) => {
    if (typeof catalogValue !== 'string' || catalogValue.length === 0) {
        return null;
    }

    const firstSeparator = catalogValue.indexOf(CATALOG_VALUE_SEPARATOR);
    const secondSeparator = firstSeparator >= 0 ? catalogValue.indexOf(CATALOG_VALUE_SEPARATOR, firstSeparator + 1) : -1;

    if (firstSeparator < 0 || secondSeparator < 0) {
        return null;
    }

    return {
        key: catalogValue.slice(0, firstSeparator),
        type: catalogValue.slice(firstSeparator + 1, secondSeparator),
        id: catalogValue.slice(secondSeparator + 1),
    };
};

const isTransportKey = (key) => key.indexOf('://') >= 0;

const getCatalogAddonId = (catalog) => catalog?.addon?.manifest?.id;
const getCatalogTransportUrl = (catalog) => catalog?.addon?.transportUrl ?? catalog?.transportUrl;

const isHeroCatalog = (catalog, catalogValue) => {
    const parsed = parseHeroCatalogValue(catalogValue);

    if (!catalog || parsed === null || catalog.id !== parsed.id || catalog.type !== parsed.type) {
        return false;
    }

    if (isTransportKey(parsed.key)) {
        const catalogTransportUrl = getCatalogTransportUrl(catalog);
        return typeof catalogTransportUrl !== 'string' || catalogTransportUrl === parsed.key;
    }

    const catalogAddonId = getCatalogAddonId(catalog);

    if (typeof catalogAddonId === 'string') {
        return catalogAddonId === parsed.key;
    }

    const catalogTransportUrl = getCatalogTransportUrl(catalog);
    return typeof catalogTransportUrl !== 'string' || catalogTransportUrl === parsed.key;
};

const findHeroCatalogIndex = (catalogs, catalogValue) => {
    if (!Array.isArray(catalogs)) {
        return -1;
    }

    const parsed = parseHeroCatalogValue(catalogValue);

    if (parsed === null) {
        return -1;
    }

    const index = catalogs.findIndex((catalog) => isHeroCatalog(catalog, catalogValue));

    if (index >= 0) {
        return index;
    }

    // Some board catalogs do not carry the addon manifest; fall back to type + id,
    // which is still unique for the vast majority of addons.
    return catalogs.findIndex((catalog) => catalog?.type === parsed.type && catalog?.id === parsed.id);
};

const getHeroItems = (catalog) => {
    if (catalog?.content?.type !== 'Ready' || !Array.isArray(catalog.content.content)) {
        return [];
    }

    const content = catalog.content.content.filter((item) => item !== null && typeof item === 'object');

    // Newer cores expose catalog pages as an array of arrays.
    return content.length > 0 && Array.isArray(content[0]) ?
        content.reduce((items, page) => Array.isArray(page) ? items.concat(page) : items, []).filter((item) => item !== null && typeof item === 'object')
        :
        content;
};

const Board = () => {
    const t = useTranslate();
    const streamingServer = useStreamingServer();
    const continueWatchingPreview = useContinueWatchingPreview();
    const liveTvContinueWatching = useLiveTvContinueWatching();
    const [board, loadBoardRows] = useBoard();
    const notifications = useNotifications();
    const profile = useProfile();
    const [heroCardSettings] = useHeroCardSettings();
    const liveTvCatalog = React.useMemo(() => ({
        items: (Array.isArray(liveTvContinueWatching.items) ? liveTvContinueWatching.items : [])
            .map((item) => ({ ...item, posterShape: 'landscape' })),
    }), [liveTvContinueWatching.items]);
    const heroCatalogIndex = React.useMemo(() => {
        if (!heroCardSettings.enabled || heroCardSettings.catalog === 'continue_watching') {
            return -1;
        }

        return findHeroCatalogIndex(board.catalogs, heroCardSettings.catalog);
    }, [heroCardSettings.enabled, heroCardSettings.catalog, board.catalogs]);
    const heroCatalog = heroCatalogIndex >= 0 ? board.catalogs[heroCatalogIndex] : null;
    const heroItems = React.useMemo(() => {
        if (!heroCardSettings.enabled) {
            return [];
        }

        if (heroCardSettings.catalog === 'continue_watching') {
            return Array.isArray(continueWatchingPreview.items) ? continueWatchingPreview.items : [];
        }

        return getHeroItems(heroCatalog);
    }, [heroCardSettings.enabled, heroCardSettings.catalog, heroCatalog, continueWatchingPreview.items]);
    const heroCatalogRequestedRef = React.useRef(null);
    React.useEffect(() => {
        if (!heroCardSettings.enabled || heroCardSettings.catalog === 'continue_watching' || heroCatalogIndex < 0) {
            heroCatalogRequestedRef.current = null;
            return;
        }

        const contentType = heroCatalog?.content?.type;

        // Nothing to request when the catalog is already loaded or failed.
        if (contentType === 'Ready' || contentType === 'Err') {
            return;
        }

        if (heroCatalogRequestedRef.current === heroCardSettings.catalog) {
            return;
        }

        heroCatalogRequestedRef.current = heroCardSettings.catalog;
        loadBoardRows({ start: heroCatalogIndex, end: heroCatalogIndex + 1 });
    }, [heroCardSettings.enabled, heroCardSettings.catalog, heroCatalogIndex, heroCatalog, loadBoardRows]);
    const boardCatalogsOffset =
        (heroItems.length > 0 ? 1 : 0) +
        (continueWatchingPreview.items.length > 0 ? 1 : 0) +
        (liveTvCatalog.items.length > 0 ? 1 : 0);
    const showStreamingServerWarning = React.useMemo(() => {
        return streamingServer.settings !== null && streamingServer.settings.type === 'Err' && (
            isNaN(profile.settings.streamingServerWarningDismissed.getTime()) ||
            profile.settings.streamingServerWarningDismissed.getTime() < Date.now());
    }, [profile.settings, streamingServer.settings]);
    const { catalogRows, scrollContainerRef, onScroll } = useVisibleCatalogs({
        catalogs: board.catalogs,
        loadRange: loadBoardRows,
        leadingRows: boardCatalogsOffset,
        preloadRows: THRESHOLD,
    });
    return (
        <div className={styles['board-container']}>
            <EventModal />
            <MainNavBars className={styles['board-content-container']} route={'board'}>
                <div ref={scrollContainerRef} className={styles['board-content']} onScroll={onScroll}>
                    {
                        heroItems.length > 0 ?
                            <HeroCard items={heroItems} />
                            :
                            null
                    }
                    {
                        continueWatchingPreview.items.length > 0 ?
                            <MetaRow
                                className={classnames(styles['board-row'], styles['continue-watching-row'], 'animation-fade-in')}
                                title={t.string('BOARD_CONTINUE_WATCHING')}
                                catalog={continueWatchingPreview}
                                itemComponent={ContinueWatchingItem}
                                notifications={notifications}
                            />
                            :
                            null
                    }
                    {
                        liveTvCatalog.items.length > 0 ?
                            <MetaRow
                                className={classnames(styles['board-row'], styles['board-row-landscape'], 'animation-fade-in')}
                                title={t.string('BOARD_CONTINUE_WATCHING_LIVE')}
                                catalog={liveTvCatalog}
                                itemComponent={LiveTvContinueWatchingItem}
                                notifications={notifications}
                            />
                            :
                            null
                    }
                    {catalogRows.map(({ catalog, index }) => {
                        switch (catalog.content?.type) {
                            case 'Ready': {
                                const posterShape = Array.isArray(catalog.content.content) && catalog.content.content[0] !== undefined ?
                                    catalog.content.content[0].posterShape
                                    :
                                    'poster';
                                return (
                                    <MetaRow
                                        key={index}
                                        className={classnames(styles['board-row'], styles[`board-row-${posterShape ?? 'poster'}`], 'animation-fade-in')}
                                        catalog={catalog}
                                        itemComponent={MetaItem}
                                    />
                                );
                            }
                            case 'Err': {
                                if (catalog.content.content !== 'EmptyContent') {
                                    return (
                                        <MetaRow
                                            key={index}
                                            className={classnames(styles['board-row'], 'animation-fade-in')}
                                            catalog={catalog}
                                            message={catalog.content.content}
                                        />
                                    );
                                }
                                return null;
                            }
                            default: {
                                return (
                                    <MetaRow.Placeholder
                                        key={index}
                                        className={classnames(styles['board-row'], styles['board-row-poster'], 'animation-fade-in')}
                                        catalog={catalog}
                                        title={t.catalogTitle(catalog)}
                                    />
                                );
                            }
                        }
                    })}
                </div>
            </MainNavBars>
            {
                showStreamingServerWarning ?
                    <StreamingServerWarning className={styles['board-warning-container']} />
                    :
                    null
            }
        </div>
    );
};

const BoardFallback = () => (
    <div className={styles['board-container']}>
        <MainNavBars className={styles['board-content-container']} route={'board'} />
    </div>
);

module.exports = withCoreSuspender(Board, BoardFallback);
