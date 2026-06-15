// Copyright (C) 2017-2023 Smart code 203358507

const React = require('react');
const PropTypes = require('prop-types');
const { ModalsContainerProvider } = require('../ModalsContainerContext');
const { RouteFocusedProvider } = require('stremio/common/useRouteFocused');

const Route = ({ component, focused }) => {
    return (
        <div className={'route-container'}>
            <RouteFocusedProvider value={focused}>
                <ModalsContainerProvider>
                    <div className={'route-content'}>
                        {component}
                    </div>
                </ModalsContainerProvider>
            </RouteFocusedProvider>
        </div>
    );
};

Route.propTypes = {
    component: PropTypes.node,
    focused: PropTypes.bool,
};

module.exports = Route;
