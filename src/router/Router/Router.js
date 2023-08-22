// Copyright (C) 2017-2023 Smart code 203358507

const React = require('react');
const ReactIs = require('react-is');
const PropTypes = require('prop-types');
const classnames = require('classnames');
const UrlUtils = require('url');
const isEqual = require('lodash.isequal');
const { RouteFocusedProvider } = require('../RouteFocusedContext');
const Route = require('../Route');
const routeConfigForPath = require('./routeConfigForPath');
const urlParamsForPath = require('./urlParamsForPath');

const Router = ({ className, onPathNotMatch, onRouteChange, ...props }) => {
    const viewsConfig = React.useMemo(() => props.viewsConfig, []);
    const [views, setViews] = React.useState(() => {
        return Array(viewsConfig.length).fill(null);
    });
    React.useLayoutEffect(() => {
        const onLocationHashChange = () => {
            const { pathname, query } = UrlUtils.parse(window.location.hash.slice(1));
            const queryParams = new URLSearchParams(typeof query === 'string' ? query : '');
            const routeConfig = routeConfigForPath(viewsConfig, typeof pathname === 'string' ? pathname : '');
            if (routeConfig === null) {
                if (typeof onPathNotMatch === 'function') {
                    const component = onPathNotMatch();
                    if (ReactIs.isValidElementType(component)) {
                        setViews((views) => {
                            return views
                                .slice(0, viewsConfig.length)
                                .concat({
                                    key: '-1',
                                    component
                                });
                        });
                    }
                }

                return;
            }

            const urlParams = urlParamsForPath(routeConfig, typeof pathname === 'string' ? pathname : '');
            const routeViewIndex = viewsConfig.findIndex((vc) => vc.includes(routeConfig));
            const routeIndex = viewsConfig[routeViewIndex].findIndex((rc) => rc === routeConfig);
            const handled = typeof onRouteChange === 'function' && onRouteChange(routeConfig, urlParams, queryParams);
            if (!handled) {
                setViews((views) => {
                    return views
                        .slice(0, viewsConfig.length)
                        .map((view, index) => {
                            if (index < routeViewIndex) {
                                return view;
                            } else if (index === routeViewIndex) {
                                return {
                                    key: `${routeViewIndex}${routeIndex}`,
                                    component: routeConfig.component,
                                    urlParams: view !== null && isEqual(view.urlParams, urlParams) ?
                                        view.urlParams
                                        :
                                        urlParams,
                                    queryParams: view !== null && isEqual(Array.from(view.queryParams.entries()), Array.from(queryParams.entries())) ?
                                        view.queryParams
                                        :
                                        queryParams
                                };
                            } else {
                                return null;
                            }
                        });
                });
            }
        };
        window.addEventListener('hashchange', onLocationHashChange);
        onLocationHashChange();
        return () => {
            window.removeEventListener('hashchange', onLocationHashChange);
        };
    }, [onPathNotMatch, onRouteChange]);
    return (
        <div className={classnames(className, 'routes-container')}>
            {
                views
                    .filter((view) => view !== null)
                    .map(({ key, component, urlParams, queryParams }, index, views) => (
                        <RouteFocusedProvider key={key} value={index === views.length - 1}>
                            <Route>
                                {React.createElement(component, { urlParams, queryParams })}
                            </Route>
                        </RouteFocusedProvider>
                    ))
            }
        </div>
    );
};

Router.propTypes = {
    className: PropTypes.string,
    onPathNotMatch: PropTypes.func,
    onRouteChange: PropTypes.func,
    viewsConfig: PropTypes.arrayOf(PropTypes.arrayOf(PropTypes.exact({
        regexp: PropTypes.instanceOf(RegExp).isRequired,
        urlParamsNames: PropTypes.arrayOf(PropTypes.string).isRequired,
        component: PropTypes.elementType.isRequired
    }))).isRequired
};

module.exports = Router;
