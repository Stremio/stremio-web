// Copyright (C) 2017-2023 Smart code 203358507

import React, { memo, useMemo } from 'react';
import classnames from 'classnames';
import { VerticalNavBar, HorizontalNavBar } from 'stremio/components/NavBar';
import { useContentGamepadNavigation, useVerticalNavGamepadNavigation } from 'stremio/services/GamepadNavigation';
import { useTheme, useThemeLayout } from 'stremio/common/Theme';
import styles from './MainNavBars.less';

const TABS = [
    { id: 'board', label: 'Board', icon: 'home', href: '/' },
    { id: 'discover', label: 'Discover', icon: 'discover', href: '/discover' },
    { id: 'library', label: 'Library', icon: 'library', href: '/library' },
    { id: 'calendar', label: 'Calendar', icon: 'calendar', href: '/calendar' },
    { id: 'addons', label: 'ADDONS', icon: 'addons', href: '/addons' },
    { id: 'settings', label: 'SETTINGS', icon: 'settings', href: '/settings' },
];

// Text-only links for the top bar of the Letterboxd-style layout
const TEXT_TABS = TABS.map(({ id, label, href }) => ({ id, label, href }));

// Storybook pictures that stand in for the tab icons in the Elenio theme
const ELENIO_TAB_LOGOS: Record<string, string> = {
    board: require('/assets/images/themes/eleinur/unicorn.webp'),
    discover: require('/assets/images/themes/eleinur/frog.webp'),
    library: require('/assets/images/themes/eleinur/tile.webp'),
    calendar: require('/assets/images/themes/eleinur/stamp.webp'),
};

const PICTURE_TABS = TABS.map((tab) => ({ ...tab, logo: ELENIO_TAB_LOGOS[tab.id] }));

type Props = {
    className: string,
    route?: string,
    query?: string,
    children?: React.ReactNode,
};

const MainNavBars = memo(({ className, route, query, children }: Props) => {
    const navRef = React.useRef(null);
    const contentRef = React.useRef(null);
    const theme = useTheme();
    const layout = useThemeLayout();

    const navRoute = route === 'continue_watching' ? 'library' : (route ?? '');
    useContentGamepadNavigation(contentRef, navRoute);
    useVerticalNavGamepadNavigation(navRef, navRoute);

    // The Letterboxd-style layout keeps its sections as links in the top bar
    const topNav = layout === 'boxd';
    const pictureTabs = theme === 'elenio';

    const tabs = useMemo(() => pictureTabs ? PICTURE_TABS : TABS, [pictureTabs]);

    return (
        <div className={classnames(className, styles['main-nav-bars-container'], { [styles['top-nav']]: topNav })}>
            <HorizontalNavBar
                className={styles['horizontal-nav-bar']}
                route={route}
                query={query}
                backButton={false}
                searchBar={true}
                fullscreenButton={true}
                navMenu={true}
                tabs={topNav ? (pictureTabs ? PICTURE_TABS : TEXT_TABS) : undefined}
                selectedTab={navRoute}
            />
            <VerticalNavBar
                ref={navRef}
                className={styles['vertical-nav-bar']}
                selected={route}
                tabs={tabs}
            />
            <div ref={contentRef} className={styles['nav-content-container']}>{children}</div>
        </div>
    );
});

export default MainNavBars;
