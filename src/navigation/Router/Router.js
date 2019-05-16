const React = require('react');
const PropTypes = require('prop-types');
const classnames = require('classnames');
const PathToRegexp = require('path-to-regexp');
const UrlUtils = require('url');
const { RoutesContainerProvider } = require('../RoutesContainerContext');
const Route = require('./Route');
const styles = require('./styles');

const Router = ({ className, homePath, ...props }) => {
    const onPathNotMatch = React.useRef(props.onPathNotMatch);
    const viewsConfig = React.useMemo(() => {
        return props.viewsConfig.map((viewConfig) => {
            return viewConfig.map(({ path, options, ...props }) => {
                const keys = [];
                const regexp = PathToRegexp(path, keys, options);
                return { path, keys, regexp, ...props };
            });
        });
    }, []);
    const [views, setViews] = React.useState(() => {
        return Array(viewsConfig.length).fill({
            routeConfig: null,
            queryParams: null,
            urlParams: null
        });
    });
    const routeConfigForPath = React.useCallback((path) => {
        for (const viewConfig of viewsConfig) {
            for (const routeConfig of viewConfig) {
                const match = routeConfig.regexp.exec(path);
                if (match) {
                    return routeConfig;
                }
            }
        }

        return null;
    }, []);
    const onLocationHashChanged = React.useCallback(() => {
        const { pathname, query } = UrlUtils.parse(window.location.hash.slice(1));
        const routeConfig = routeConfigForPath(pathname);
        if (routeConfig === null) {
            if (typeof onPathNotMatch.current === 'function') {
                onPathNotMatch.current();
            }

            return;
        }

        const routeViewIndex = viewsConfig.findIndex((v) => v.includes(routeConfig));
        const match = routeConfig.regexp.exec(pathname);
        const queryParams = new URLSearchParams(query);
        const urlParams = routeConfig.keys.reduce((urlParams, key, index) => {
            urlParams[key.name] = match[index + 1];
            return urlParams;
        }, {});
        setViews((views) => {
            return views.map((view, index) => {
                if (index < routeViewIndex) {
                    return view;
                } else if (index === routeViewIndex) {
                    return {
                        routeConfig,
                        queryParams,
                        urlParams
                    };
                } else {
                    return {
                        routeConfig: null,
                        queryParams: null,
                        urlParams: null
                    };
                }
            });
        });
    }, []);
    React.useEffect(() => {
        onPathNotMatch.current = props.onPathNotMatch;
    }, [props.onPathNotMatch]);
    React.useEffect(() => {
        if (typeof homePath === 'string') {
            const { pathname, path } = UrlUtils.parse(window.location.hash.slice(1));
            if (homePath !== path) {
                window.location.replace(`#${homePath}`);
                const routeConfig = routeConfigForPath(pathname);
                if (routeConfig !== null) {
                    window.location = `#${path}`;
                }
            }
        }

        window.addEventListener('hashchange', onLocationHashChanged);
        onLocationHashChanged();
        return () => {
            window.removeEventListener('hashchange', onLocationHashChanged);
        };
    }, []);

    return (
        <RoutesContainerProvider containerClassName={classnames(className, styles['router-container'])}>
            {
                views
                    .filter(({ routeConfig }) => routeConfig !== null)
                    .map(({ routeConfig, queryParams, urlParams }) => (
                        <Route key={routeConfig.path}>
                            {React.createElement(routeConfig.component, { queryParams, urlParams })}
                        </Route>
                    ))
            }
        </RoutesContainerProvider>
    );
};

Router.propTypes = {
    className: PropTypes.string,
    homePath: PropTypes.string,
    onPathNotMatch: PropTypes.func,
    viewsConfig: PropTypes.arrayOf(PropTypes.arrayOf(PropTypes.exact({
        path: PropTypes.string.isRequired,
        component: PropTypes.elementType.isRequired,
        options: PropTypes.object
    }))).isRequired
};

module.exports = Router;
