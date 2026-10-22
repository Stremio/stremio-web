// Copyright (C) 2017-2023 Smart code 203358507

const React = require('react');
const { Link } = require('react-router-dom');
const { useGoBack } = require('stremio-router');
const PropTypes = require('prop-types');
const classnames = require('classnames');
const { default: Icon } = require('@stremio/stremio-icons/react');
const { Button, BrandLogo } = require('stremio/components');
const { useFullscreen } = require('stremio/common/Fullscreen');
const { useHorizontalNavGamepadNavigation } = require('stremio/services/GamepadNavigation');
const SearchBar = require('./SearchBar');
const NavMenu = require('./NavMenu');
const styles = require('./styles');
const { t } = require('i18next');

const HorizontalNavBar = React.memo(({ className, route, query, title, backButton, searchBar, fullscreenButton, navMenu, originPath, hdrInfo, tabs, selectedTab, ...props }) => {
    const backButtonOnClick = useGoBack(originPath);
    const [fullscreen, requestFullscreen, exitFullscreen, , supported] = useFullscreen();
    const renderNavMenuLabel = React.useCallback(({ ref, className, onClick, children, }) => (
        <Button ref={ref} className={classnames(className, styles['button-container'], styles['menu-button-container'])} tabIndex={-1} onClick={onClick}>
            <Icon className={styles['icon']} name={'person-outline'} />
            {children}
        </Button>
    ), []);
    useHorizontalNavGamepadNavigation(route || className, backButton ? backButtonOnClick : undefined);
    return (
        <nav {...props} className={classnames(className, styles['horizontal-nav-bar-container'])}>
            {
                backButton ?
                    <Button className={classnames(styles['button-container'], styles['back-button-container'])} tabIndex={-1} onClick={backButtonOnClick}>
                        <Icon className={styles['icon']} name={'chevron-back'} />
                    </Button>
                    :
                    <Link className={styles['logo-container']} to={'/'} tabIndex={-1}>
                        <BrandLogo className={styles['logo']} />
                    </Link>
            }
            {
                Array.isArray(tabs) && tabs.length > 0 ?
                    <div className={styles['tabs-container']}>
                        {
                            tabs.map((tab) => (
                                <Link
                                    key={tab.id}
                                    className={classnames(styles['tab'], { 'selected': tab.id === selectedTab })}
                                    to={tab.href}
                                    tabIndex={-1}
                                >
                                    {
                                        typeof tab.logo === 'string' && tab.logo.length > 0 ?
                                            <img className={styles['tab-logo']} src={tab.logo} alt={''} />
                                            :
                                            typeof tab.icon === 'string' && tab.icon.length > 0 ?
                                                <Icon className={styles['tab-icon']} name={tab.id === selectedTab ? tab.icon : `${tab.icon}-outline`} />
                                                :
                                                null
                                    }
                                    <span className={styles['tab-label']}>{t(tab.label)}</span>
                                </Link>
                            ))
                        }
                    </div>
                    :
                    null
            }
            {
                typeof title === 'string' && title.length > 0 ?
                    <h2 className={styles['title']}>{title}</h2>
                    :
                    null
            }
            {
                searchBar && route !== 'addons' ?
                    <SearchBar className={styles['search-bar']} query={query} active={route === 'search'} />
                    :
                    null
            }
            <div className={styles['buttons-container']}>
                {
                    hdrInfo && (hdrInfo.gamma === 'pq' || hdrInfo.gamma === 'hlg') ?
                        <div className={styles['hdr-indicator']} title={hdrInfo.gamma === 'pq' ? 'HDR10' : 'HLG'}>
                            <Icon className={styles['icon']} name={'hdr'} />
                        </div>
                        :
                        null
                }
                {
                    supported && fullscreenButton ?
                        <Button className={styles['button-container']} title={fullscreen ? t('EXIT_FULLSCREEN') : t('ENTER_FULLSCREEN')} tabIndex={-1} onClick={fullscreen ? exitFullscreen : requestFullscreen}>
                            <Icon className={styles['icon']} name={fullscreen ? 'minimize' : 'maximize'} />
                        </Button>
                        :
                        null
                }
                {
                    navMenu ?
                        <NavMenu renderLabel={renderNavMenuLabel} />
                        :
                        null
                }
            </div>
        </nav>
    );
});

HorizontalNavBar.displayName = 'HorizontalNavBar';

HorizontalNavBar.propTypes = {
    className: PropTypes.string,
    route: PropTypes.string,
    query: PropTypes.string,
    title: PropTypes.string,
    backButton: PropTypes.bool,
    searchBar: PropTypes.bool,
    fullscreenButton: PropTypes.bool,
    navMenu: PropTypes.bool,
    originPath: PropTypes.string,
    hdrInfo: PropTypes.shape({
        gamma: PropTypes.string,
    }),
    tabs: PropTypes.arrayOf(PropTypes.shape({
        id: PropTypes.string,
        label: PropTypes.string,
        href: PropTypes.string,
        logo: PropTypes.string,
        icon: PropTypes.string,
    })),
    selectedTab: PropTypes.string,
};

module.exports = HorizontalNavBar;
