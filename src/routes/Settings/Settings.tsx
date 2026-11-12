// Copyright (C) 2017-2023 Smart code 203358507

import React, { useCallback, useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router';
import classnames from 'classnames';
import { useBinaryState, useMediaQuery, useProfile, useRouteFocused, useStreamingServer, withCoreSuspender } from 'stremio/common';
import screenSizes from 'stremio/common/screen-sizes.less';
import { MainNavBars } from 'stremio/components';
import { Page } from './components';
import { PAGES } from './constants';
import useSettingsPages from './useSettingsPages';
import useTraktAuth from './useTraktAuth';
import useAccountExport from './useAccountExport';
import useBoardCatalogs from './Interface/SpotlightSettings/useBoardCatalogs';
import useSettingsSearch from './useSettingsSearch';
import SearchHitContext from './SearchHitContext';
import Menu from './Menu';
import Hub from './Hub';
import Results from './Results';
import Interface from './Interface';
import Player from './Player';
import Integrations from './Integrations';
import Device from './Device';
import Streaming from './Streaming';
import Account from './Account';
import Shortcuts from './Shortcuts';
import Help from './Help';
import styles from './Settings.less';

const Settings = () => {
    const { page: pageId } = useParams();
    const navigate = useNavigate();
    const location = useLocation();
    const routeFocused = useRouteFocused();
    const profile = useProfile();
    const streamingServer = useStreamingServer();
    const hubLayout = useMediaQuery(`(max-width: ${screenSizes.xsmall})`);
    const { groups, pages } = useSettingsPages();
    const trakt = useTraktAuth(profile);
    const dataExport = useAccountExport();
    const [spotlightPickerOpen, openSpotlightPicker, closeSpotlightPicker] = useBinaryState(false);
    const boardCatalogs = useBoardCatalogs(spotlightPickerOpen);
    const spotlight = useMemo(() => ({
        catalogs: boardCatalogs,
        pickerOpen: spotlightPickerOpen,
        openPicker: openSpotlightPicker,
        closePicker: closeSpotlightPicker,
    }), [boardCatalogs, spotlightPickerOpen, openSpotlightPicker, closeSpotlightPicker]);

    const paneRef = useRef<HTMLDivElement>(null);
    const pendingFocusRef = useRef<string | null>(null);
    const hitPageRef = useRef<string | null>(null);
    const [query, setQuery] = useState('');
    const [hit, setHit] = useState<{ row: string } | null>(null);
    const spotlightPicks = useMemo(() => boardCatalogs.catalogs.filter(({ selected }) => selected !== null).length, [boardCatalogs.catalogs]);
    const results = useSettingsSearch(query, groups, profile, streamingServer, spotlightPicks);
    const searching = query.trim().length > 0;

    const page = pages.find(({ id }) => id === pageId) ?? (hubLayout ? null : pages[0]);

    const onQueryChange = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
        setQuery(event.target.value);
    }, []);

    const clearQuery = useCallback(() => {
        setQuery('');
    }, []);

    const onSelectResult = useCallback((event: React.MouseEvent<HTMLDivElement>) => {
        if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) {
            return;
        }

        event.preventDefault();
        const { page: target, target: row } = event.currentTarget.dataset;
        pendingFocusRef.current = event.currentTarget === document.activeElement ? 'hit' : null;
        hitPageRef.current = target ?? null;
        setQuery('');
        setHit({ row: row ?? '' });
        if (target !== pageId) {
            navigate(`/settings/${target}`, hubLayout ? { state: { fromHub: true } } : undefined);
        }
    }, [navigate, pageId, hubLayout]);

    const onOpenPage = useCallback((event: React.MouseEvent<HTMLDivElement>) => {
        if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) {
            return;
        }

        event.preventDefault();
        pendingFocusRef.current = event.currentTarget === document.activeElement ? 'back' : null;
        navigate(`/settings/${event.currentTarget.dataset.page}`, { state: { fromHub: true } });
    }, [navigate]);

    const onBack = useCallback((event: React.MouseEvent<HTMLDivElement>) => {
        event.preventDefault();
        pendingFocusRef.current = event.currentTarget === document.activeElement ? page?.id ?? null : null;
        if (location.state?.fromHub) {
            navigate(-1);
        } else {
            navigate('/settings', { replace: true });
        }
    }, [location.state, navigate, page?.id]);

    useLayoutEffect(() => {
        paneRef.current?.scrollTo(0, 0);

        const focusTarget = pendingFocusRef.current;
        if (focusTarget === 'hit') return;
        pendingFocusRef.current = null;
        if (focusTarget !== null && paneRef.current) {
            const selector = focusTarget === 'back' ? '[data-back]' : `[data-page="${focusTarget}"]`;
            const element = Array.from(paneRef.current.querySelectorAll<HTMLElement>(selector)).pop();
            element?.focus({ preventScroll: true });
        }
    }, [page?.id]);

    useEffect(() => {
        closeSpotlightPicker();
    }, [page?.id, closeSpotlightPicker]);

    useEffect(() => {
        setQuery('');
    }, [page?.id]);

    useEffect(() => {
        if (!routeFocused || !searching) return;

        const onKeyDown = (event: KeyboardEvent) => {
            if (event.key === 'Escape' && !event.defaultPrevented) {
                setQuery('');
            }
        };
        window.addEventListener('keydown', onKeyDown);
        return () => window.removeEventListener('keydown', onKeyDown);
    }, [routeFocused, searching]);

    useEffect(() => {
        if (hit === null || page?.id !== hitPageRef.current) return;

        const element = hit.row ? paneRef.current?.querySelector<HTMLElement>(`[data-row="${hit.row}"]`) : null;
        element?.scrollIntoView({ block: 'center' });
        if (pendingFocusRef.current === 'hit') {
            pendingFocusRef.current = null;
            const target = element ?
                element.querySelector<HTMLElement>('[tabindex="0"]') ?? element
                :
                paneRef.current?.querySelector<HTMLElement>('[tabindex="0"]');
            target?.focus({ preventScroll: true });
        }

        const timeout = setTimeout(() => {
            setHit(null);
        }, 1900);
        return () => clearTimeout(timeout);
    }, [hit, page?.id]);

    const resultsView = (
        <Results query={query} results={results} compact={hubLayout} onSelect={onSelectResult} />
    );

    let content: React.ReactNode;
    if (page === null) {
        content = (
            <Hub
                groups={groups}
                profile={profile}
                streamingServer={streamingServer}
                query={query}
                results={searching ? resultsView : null}
                onQueryChange={onQueryChange}
                onOpenPage={onOpenPage}
            />
        );
    } else if (searching && !hubLayout) {
        content = resultsView;
    } else {
        content = (
            <Page title={page.label} scope={page.scope} onBack={hubLayout ? onBack : undefined}>
                {page.id === PAGES.INTERFACE && <Interface profile={profile} spotlight={spotlight} />}
                {page.id === PAGES.PLAYER && <Player profile={profile} />}
                {page.id === PAGES.INTEGRATIONS && <Integrations profile={profile} trakt={trakt} />}
                {page.id === PAGES.DEVICE && <Device profile={profile} />}
                {page.id === PAGES.STREAMING && <Streaming profile={profile} streamingServer={streamingServer} />}
                {page.id === PAGES.ACCOUNT && <Account profile={profile} dataExport={dataExport} />}
                {page.id === PAGES.SHORTCUTS && <Shortcuts />}
                {page.id === PAGES.HELP && <Help streamingServer={streamingServer} />}
            </Page>
        );
    }

    return (
        <MainNavBars className={styles['settings-container']} route={'settings'}>
            <div className={classnames(styles['settings-content'], 'animation-fade-in')}>
                {
                    !hubLayout && page &&
                        <Menu
                            groups={groups}
                            selected={searching ? null : page.id}
                            query={query}
                            onQueryChange={onQueryChange}
                            onNavigate={clearQuery}
                        />
                }
                <div ref={paneRef} className={styles['pane']}>
                    <div className={styles['page-container']}>
                        <SearchHitContext.Provider value={hit?.row ?? null}>
                            {content}
                        </SearchHitContext.Provider>
                    </div>
                </div>
            </div>
        </MainNavBars>
    );
};

const SettingsFallback = () => (
    <MainNavBars className={styles['settings-container']} route={'settings'} />
);

export default withCoreSuspender(Settings, SettingsFallback);
