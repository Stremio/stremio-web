import React, { Component } from 'react';
import { matchPath } from 'react-router-dom';
import { join as joinPaths } from 'path';

class Router extends Component {
    constructor(props) {
        super(props);

        this.historyLength = history.length;
        this.state = {
            views: Array.apply(null, { length: props.config.views.length }).map(() => ({
                id: -1,
                element: null
            }))
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

    onLocationChanged = ({ timeStamp: id } = { timeStamp: 0 }) => {
        const hashIndex = window.location.href.indexOf('#');
        const hashPath = hashIndex === -1 ? '' : window.location.href.substring(hashIndex + 1);
        const path = joinPaths('/', hashPath);
        const isPushAction = this.historyLength < history.length;
        this.historyLength = history.length;
        this.props.config.views.forEach((viewConfig, viewConfigIndex) => {
            viewConfig.routes.forEach((routeConfig) => {
                if (matchPath(path, routeConfig)) {
                    this.setState(({ views }) => ({
                        views: views.map((view, viewIndex) => {
                            if (viewIndex > viewConfigIndex) {
                                return {
                                    id: -1,
                                    element: null
                                };
                            } else if (viewIndex === viewConfigIndex) {
                                if (!isPushAction && React.isValidElement(view.element) && view.element.type === routeConfig.component) {
                                    return view;
                                } else {
                                    return {
                                        id,
                                        element: React.createElement(routeConfig.component)
                                    };
                                }
                            } else {
                                return view;
                            }
                        })
                    }));
                }
            });
        });
    }

    render() {
        return (
            <div className={this.props.routerContainerClassName}>
                {
                    this.state.views
                        .filter(({ element }) => React.isValidElement(element))
                        .map(({ id, element }) => <div key={id} className={this.props.routeContainerClassName}>{element}</div>)
                }
            </div>
        );
    }
}

export default Router;
