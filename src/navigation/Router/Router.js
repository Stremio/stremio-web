const React = require('react');
const PropTypes = require('prop-types');
const PathToRegexp = require('path-to-regexp');
const UrlUtils = require('url');
const Route = require('./Route');

class Router extends React.Component {
    constructor(props) {
        super(props);

        this.viewsConfig = props.viewsConfig.map((viewConfig) => {
            return viewConfig.map(({ path, options, ...props }) => {
                const keys = [];
                const regexp = PathToRegexp(path, keys, {
                    strict: false,
                    sensitive: false,
                    end: true,
                    ...options
                });
                return { path, keys, regexp, ...props };
            });
        });

        this.state = {
            views: Array(this.viewsConfig.length).fill({
                path: null,
                element: null
            })
        };
    }

    componentDidMount() {
        if (typeof this.props.homePath === 'string') {
            const { pathname, href } = this.getParsedHashPath();
            if (pathname !== this.props.homePath) {
                window.location.replace(`#${this.props.homePath}`);
                const routeConfig = this.routeConfigForPath(pathname);
                if (routeConfig !== null) {
                    window.location = `#${href}`;
                }
            }
        }

        window.addEventListener('hashchange', this.onHashChanged);
        this.onHashChanged();
    }

    componentWillUnmount() {
        window.removeEventListener('hashchange', this.onHashChanged);
    }

    shouldComponentUpdate(nextProps, nextState) {
        return nextState.views !== this.state.views ||
            nextProps.className !== this.props.className;
    }

    getParsedHashPath = () => {
        const hashPath = window.location.hash.startsWith('#') ?
            window.location.hash.slice(1)
            :
            '';
        return UrlUtils.parse(hashPath);
    }

    routeConfigForPath = (path) => {
        for (const viewConfig of this.viewsConfig) {
            for (const routeConfig of viewConfig) {
                const match = routeConfig.regexp.exec(path);
                if (match) {
                    return routeConfig;
                }
            }
        }

        return null;
    }

    onHashChanged = (event) => {
        const { pathname, query } = this.getParsedHashPath();
        const routeConfig = this.routeConfigForPath(pathname);
        if (routeConfig === null) {
            if (typeof this.props.onPathNotMatch === 'function') {
                this.props.onPathNotMatch(event);
            } else if (typeof this.props.homePath === 'string') {
                window.location.replace(`#${this.props.homePath}`);
            }

            return;
        }

        const routeViewIndex = this.viewsConfig.findIndex((v) => v.includes(routeConfig));
        const match = routeConfig.regexp.exec(pathname);
        const queryParams = new URLSearchParams(query);
        const urlParams = routeConfig.keys.reduce((urlParams, key, index) => {
            urlParams[key.name] = match[index + 1];
            return urlParams;
        }, {});
        this.setState(({ views }) => ({
            views: views.map((view, index) => {
                if (index < routeViewIndex) {
                    return view;
                } else if (index === routeViewIndex) {
                    return {
                        path: routeConfig.path,
                        element: React.createElement(routeConfig.component, { queryParams, urlParams })
                    };
                } else {
                    return {
                        path: null,
                        element: null
                    };
                }
            })
        }));
    }

    render() {
        return (
            <div className={this.props.className}>
                {
                    this.state.views
                        .filter(({ element }) => React.isValidElement(element))
                        .map(({ path, element }) => (
                            <Route key={path}>{element}</Route>
                        ))
                }
            </div>
        );
    }
}

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
