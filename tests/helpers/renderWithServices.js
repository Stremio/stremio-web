// Copyright (C) 2017-2026 Smart code 203358507

const React = require('react');
const { render } = require('@testing-library/react');
const ServicesContext = require('../../src/services/ServicesContext/ServicesContext');
const { RouteFocusedProvider } = require('../../src/router/RouteFocusedContext');
const mockServices = require('./mockServices');

/**
 * Render helper that wires a component under the production context tree:
 * ServicesProvider (stubbed) + RouteFocusedProvider (focused=true by default).
 *
 *   const { services, ...rtl } = renderWithServices(<MyComponent />);
 *   services.core.transport.dispatch.mock.calls // inspect dispatches
 *
 * @param {React.ReactElement} ui
 * @param {{ services?: object, routeFocused?: boolean, renderOptions?: object }} opts
 */
function renderWithServices(ui, { services, routeFocused = true, renderOptions } = {}) {
    const resolvedServices = services ?? mockServices();

    const Wrapper = ({ children }) =>
        React.createElement(
            ServicesContext.Provider,
            { value: resolvedServices },
            React.createElement(RouteFocusedProvider, { value: routeFocused }, children)
        );

    return {
        services: resolvedServices,
        ...render(ui, { wrapper: Wrapper, ...renderOptions }),
    };
}

module.exports = renderWithServices;
