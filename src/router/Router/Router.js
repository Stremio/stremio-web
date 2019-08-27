const React = require('react');
const PropTypes = require('prop-types');
const ReactIs = require('react-is');
const UrlUtils = require('url');
const { RoutesContainerProvider } = require('../RoutesContainerContext');
const queryParamsForQuery = require('./queryParamsForQuery');
const routeConfigForPath = require('./routeConfigForPath');
const urlParamsForPath = require('./urlParamsForPath');
const Route = require('./Route');

const Router = ({ onPathNotMatch, ...props }) => {
    const [{ homePath, viewsConfig }] = React.useState(() => ({
        homePath: props.homePath,
        viewsConfig: props.viewsConfig
    }));
    const [views, setViews] = React.useState([]);
    React.useEffect(() => {
        if (typeof homePath === 'string') {
            const { pathname, path } = UrlUtils.parse(window.location.hash.slice(1));
            if (homePath !== path) {
                window.location.replace(`#${homePath}`);
                const routeConfig = routeConfigForPath(viewsConfig, pathname);
                if (routeConfig) {
                    window.location = `#${path}`;
                }
            }
        }
    }, []);
    React.useEffect(() => {
        const onLocationHashChanged = () => {
            const { pathname, query } = UrlUtils.parse(window.location.hash.slice(1));
            const routeConfig = routeConfigForPath(viewsConfig, pathname);
            if (!routeConfig) {
                if (typeof onPathNotMatch === 'function') {
                    const component = onPathNotMatch();
                    if (ReactIs.isValidElementType(component)) {
                        setViews([{
                            key: '-1',
                            component,
                            urlParams: {},
                            queryParams: {}
                        }]);
                    }
                }

                return;
            }

            const urlParams = urlParamsForPath(routeConfig, pathname);
            const queryParams = queryParamsForQuery(typeof query === 'string' ? query : '');
            const routeViewIndex = viewsConfig.findIndex((vc) => vc.includes(routeConfig));
            const routeIndex = viewsConfig[routeViewIndex].findIndex((rc) => rc === routeConfig);
            setViews((views) => {
                return views.slice(0, routeViewIndex).concat([{
                    key: `${routeViewIndex}${routeIndex}`,
                    component: routeConfig.component,
                    urlParams,
                    queryParams
                }]);
            });
        };
        window.addEventListener('hashchange', onLocationHashChanged);
        onLocationHashChanged();
        return () => {
            window.removeEventListener('hashchange', onLocationHashChanged);
        };
    }, [onPathNotMatch]);
    return (
        <RoutesContainerProvider>
            {views.map(({ key, component, urlParams, queryParams }) => (
                <Route key={key}>
                    {React.createElement(component, { urlParams, queryParams })}
                </Route>
            ))}
        </RoutesContainerProvider>
    );
};

Router.propTypes = {
    homePath: PropTypes.string,
    onPathNotMatch: PropTypes.func,
    viewsConfig: PropTypes.arrayOf(PropTypes.arrayOf(PropTypes.exact({
        regexp: PropTypes.instanceOf(RegExp).isRequired,
        keys: PropTypes.arrayOf(PropTypes.shape({
            name: PropTypes.string.isRequired
        })).isRequired,
        component: PropTypes.elementType.isRequired
    }))).isRequired
};

module.exports = Router;
