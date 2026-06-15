// Copyright (C) 2017-2023 Smart code 203358507

const React = require('react');
const { HashRouter } = require('react-router-dom');
const { useNavigate } = require('react-router');
const PropTypes = require('prop-types');
const classnames = require('classnames');
const { useShortcuts } = require('stremio/common');
const DeepLinkHandler = require('stremio/App/DeepLinkHandler');
const { default: OpenMediaHandler } = require('stremio/App/OpenMediaHandler');
const { default: Routes } = require('./Routes');

const NAVIGATE_TABS_ROUTES = ['/', '/discover', '/library', '/calendar', '/addons', '/settings'];

const KeyboardNavigationHandler = () => {
    const navigate = useNavigate();
    const { on, off } = useShortcuts();

    React.useEffect(() => {
        const onNavigateSearch = () => navigate('/search');
        const onNavigateTabs = (_combo, key) => {
            const index = Number(key) - 1;
            if (index >= 0 && index < NAVIGATE_TABS_ROUTES.length) navigate(NAVIGATE_TABS_ROUTES[index]);
        };
        const onNavigateHistory = (combo) => navigate(combo === 0 ? -1 : 1);

        on('navigateSearch', onNavigateSearch);
        on('navigateTabs', onNavigateTabs);
        on('navigateHistory', onNavigateHistory);
        return () => {
            off('navigateSearch', onNavigateSearch);
            off('navigateTabs', onNavigateTabs);
            off('navigateHistory', onNavigateHistory);
        };
    }, [navigate, on, off]);

    return null;
};

const Router = ({ className }) => {

    return (
        <div className={classnames(className, 'routes-container')}>
            <HashRouter>
                <DeepLinkHandler />
                <OpenMediaHandler />
                <KeyboardNavigationHandler />
                <Routes />
            </HashRouter>
        </div>
    );
};

Router.propTypes = {
    className: PropTypes.string,
};

module.exports = Router;
