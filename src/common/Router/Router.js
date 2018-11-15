import React, { Component, Fragment } from 'react';
import pathToRegexp from 'path-to-regexp';
import PathUtils from 'path';
import UrlUtils from 'url';

class Router extends Component {
    constructor(props) {
        super(props);

        this.viewsConfig = props.config.views
            .map((viewConfig) => ({
                ...viewConfig,
                routes: viewConfig.routes.map((routeConfig) => {
                    const keys = [];
                    const regexp = pathToRegexp(routeConfig.path, keys, {
                        strict: false,
                        sensitive: false,
                        end: true,
                        ...routeConfig.options
                    });
                    return {
                        ...routeConfig,
                        keys,
                        regexp
                    };
                })
            }));

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
        return nextState.views !== this.state.views;
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
            for (const routeConfig of viewConfig.routes) {
                const { keys, regexp } = routeConfig;
                const match = regexp.exec(pathname);
                if (match) {
                    const urlParams = keys.reduce((urlParams, key, index) => {
                        urlParams[key.name] = match[index + 1];
                        return urlParams;
                    }, {});
                    this.setState(({ views }) => ({
                        views: views.map((view, viewIndex) => {
                            if (viewIndex > viewConfigIndex) {
                                return {
                                    path: null,
                                    element: null
                                };
                            } else if (viewIndex === viewConfigIndex) {
                                return {
                                    path: routeConfig.path,
                                    element: React.createElement(routeConfig.component, { queryParams, urlParams })
                                };
                            } else {
                                return view;
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
            <Fragment>
                {
                    this.state.views
                        .filter(({ element }) => React.isValidElement(element))
                        .map(({ path, element }) => <div key={path} className={this.props.routeContainerClassName}>{element}</div>)
                }
            </Fragment>
        );
    }
}

export default Router;
