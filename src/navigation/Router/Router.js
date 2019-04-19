const React = require('react');
const PropTypes = require('prop-types');
const PathToRegexp = require('path-to-regexp');
const PathUtils = require('path');
const UrlUtils = require('url');
const Route = require('./Route');

class Router extends React.Component {
    constructor(props) {
        super(props);

        this.viewsConfig = props.viewsConfig.map((viewConfig) => {
            return viewConfig.map(({ path, component, options }) => {
                const keys = [];
                const regexp = PathToRegexp(path, keys, {
                    strict: false,
                    sensitive: false,
                    end: true,
                    ...options
                });
                return {
                    path,
                    component,
                    keys,
                    regexp
                };
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
        window.addEventListener('hashchange', this.onLocationChanged);
        this.onLocationChanged();
    }

    componentWillUnmount() {
        window.removeEventListener('hashchange', this.onLocationChanged);
    }

    shouldComponentUpdate(nextProps, nextState) {
        return nextState.views !== this.state.views ||
            nextProps.className !== this.props.className;
    }

    onLocationChanged = () => {
        const hashIndex = window.location.href.indexOf('#');
        const hashPath = hashIndex === -1 ? '' : window.location.href.substring(hashIndex + 1);
        const path = PathUtils.join('/', hashPath);
        if (hashPath !== path) {
            window.location.replace(`#${path}`);
            return;
        }

        const { pathname, query } = UrlUtils.parse(path);
        const queryParams = new URLSearchParams(query);
        for (let viewConfigIndex = 0; viewConfigIndex < this.viewsConfig.length; viewConfigIndex++) {
            const viewConfig = this.viewsConfig[viewConfigIndex];
            for (const routeConfig of viewConfig) {
                const match = routeConfig.regexp.exec(pathname);
                if (match) {
                    const urlParams = routeConfig.keys.reduce((urlParams, key, index) => {
                        urlParams[key.name] = match[index + 1];
                        return urlParams;
                    }, {});
                    this.setState(({ views }) => ({
                        views: views.map((view, viewIndex) => {
                            if (viewIndex < viewConfigIndex) {
                                return view;
                            } else if (viewIndex === viewConfigIndex) {
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
                    return;
                }
            }
        }

        window.location.replace('#/');
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
    viewsConfig: PropTypes.arrayOf(PropTypes.arrayOf(PropTypes.exact({
        path: PropTypes.string.isRequired,
        component: PropTypes.elementType.isRequired,
        options: PropTypes.object
    }))).isRequired
};

module.exports = Router;
