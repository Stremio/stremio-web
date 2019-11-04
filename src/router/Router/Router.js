const React = require('react');
const ReactIs = require('react-is');
const PropTypes = require('prop-types');
const classnames = require('classnames');
const UrlUtils = require('url');
const { RouteFocusedProvider } = require('../RouteFocusedContext');
const Route = require('../Route');

const Router = ({ className, onPathNotMatch, ...props }) => {
    const [{ homePath, viewsConfig }] = React.useState(() => ({
        homePath: props.homePath,
        viewsConfig: props.viewsConfig
    }));
    const routeConfigForPath = React.useCallback((path) => {
        for (const viewConfig of viewsConfig) {
            for (const routeConfig of viewConfig) {
                if (typeof path === 'string' && path.match(routeConfig.regexp)) {
                    return routeConfig;
                }
            }
        }

        return null;
    }, []);
    const [views, setViews] = React.useState(() => {
        return Array(viewsConfig.length).fill(null);
    });
    React.useEffect(() => {
        if (typeof homePath === 'string') {
            const { pathname, path } = UrlUtils.parse(window.location.hash.slice(1));
            if (homePath !== path) {
                window.location.replace(`#${homePath}`);
                const routeConfig = routeConfigForPath(pathname);
                if (routeConfig) {
                    window.location = `#${path}`;
                }
            }
        }
    }, []);
    React.useEffect(() => {
        const onLocationHashChange = () => {
            const { pathname, query } = UrlUtils.parse(window.location.hash.slice(1));
            const queryParams = new URLSearchParams(typeof query === 'string' ? query : '');
            const routeConfig = routeConfigForPath(pathname);
            if (!routeConfig) {
                if (typeof onPathNotMatch === 'function') {
                    const component = onPathNotMatch();
                    if (ReactIs.isValidElementType(component)) {
                        setViews([
                            {
                                key: '-1',
                                component,
                                urlParams: {},
                                queryParams
                            },
                            ...Array(viewsConfig.length - 1).fill(null)
                        ]);
                    }
                }

                return;
            }

            const matches = pathname.match(routeConfig.regexp);
            const urlParams = routeConfig.urlParamsNames.reduce((urlParams, name, index) => {
                if (Array.isArray(matches) && typeof matches[index + 1] === 'string') {
                    urlParams[name] = decodeURIComponent(matches[index + 1]);
                } else {
                    urlParams[name] = null;
                }

                return urlParams;
            }, {});
            const routeViewIndex = viewsConfig.findIndex((vc) => vc.includes(routeConfig));
            const routeIndex = viewsConfig[routeViewIndex].findIndex((rc) => rc === routeConfig);
            setViews((views) => {
                return views.map((view, index) => {
                    if (index < routeViewIndex) {
                        return view;
                    } else if (index === routeViewIndex) {
                        return {
                            key: `${routeViewIndex}${routeIndex}`,
                            component: routeConfig.component,
                            urlParams,
                            queryParams
                        };
                    } else {
                        return null;
                    }
                });
            });
        };
        window.addEventListener('hashchange', onLocationHashChange);
        onLocationHashChange();
        return () => {
            window.removeEventListener('hashchange', onLocationHashChange);
        };
    }, [onPathNotMatch]);
    return (
        <div className={classnames(className, 'routes-container')}>
            {
                views
                    .filter(view => view !== null)
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
    homePath: PropTypes.string,
    onPathNotMatch: PropTypes.func,
    viewsConfig: PropTypes.arrayOf(PropTypes.arrayOf(PropTypes.exact({
        regexp: PropTypes.instanceOf(RegExp).isRequired,
        urlParamsNames: PropTypes.arrayOf(PropTypes.string).isRequired,
        component: PropTypes.elementType.isRequired
    }))).isRequired
};

module.exports = Router;
