// Copyright (C) 2017-2023 Smart code 203358507

import React, { useCallback, useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router';
import classnames from 'classnames';
import { useBinaryState, useMediaQuery, useProfile, useStreamingServer, withCoreSuspender } from 'stremio/common';
import screenSizes from 'stremio/common/screen-sizes.less';
import { MainNavBars } from 'stremio/components';
import { Page } from './components';
import { PAGES } from './constants';
import useSettingsPages from './useSettingsPages';
import useTraktAuth from './useTraktAuth';
import useBoardCatalogs from './Interface/SpotlightSettings/useBoardCatalogs';
import useAccountExport from './useAccountExport';
import Menu from './Menu';
import Hub from './Hub';
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
    const [query, setQuery] = useState('');

    const page = pages.find(({ id }) => id === pageId) ?? (hubLayout ? null : pages[0]);

    const onQueryChange = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
        setQuery(event.target.value);
    }, []);

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

    return (
        <MainNavBars className={styles['settings-container']} route={'settings'}>
            <div className={classnames(styles['settings-content'], 'animation-fade-in')}>
                {
                    !hubLayout && page &&
                        <Menu
                            groups={groups}
                            selected={page.id}
                            query={query}
                            onQueryChange={onQueryChange}
                        />
                }
                <div ref={paneRef} className={styles['pane']}>
                    <div className={styles['page-container']}>
                        {
                            page ?
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
                                :
                                <Hub
                                    groups={groups}
                                    profile={profile}
                                    streamingServer={streamingServer}
                                    query={query}
                                    onQueryChange={onQueryChange}
                                    onOpenPage={onOpenPage}
                                />
                        }
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
