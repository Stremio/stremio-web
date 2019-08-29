const React = require('react');
const PropTypes = require('prop-types');
const { FocusableProvider } = require('../FocusableContext');
const { ModalsContainerProvider } = require('../ModalsContainerContext');

const Route = ({ children }) => {
    const onRoutesContainerDomTreeChange = React.useCallback(({ routesContainer, contentContainer }) => {
        return routesContainer.lastElementChild === contentContainer.parentElement;
    }, []);
    const onModalsContainerDomTreeChange = React.useCallback(({ modalsContainer }) => {
        return modalsContainer.childElementCount === 0;
    }, []);
    return (
        <div className={'route-container'}>
            <ModalsContainerProvider>
                <FocusableProvider onRoutesContainerDomTreeChange={onRoutesContainerDomTreeChange} onModalsContainerDomTreeChange={onModalsContainerDomTreeChange}>
                    <div className={'route-content'}>{children}</div>
                </FocusableProvider>
            </ModalsContainerProvider>
        </div>
    );
};

Route.propTypes = {
    children: PropTypes.oneOfType([
        PropTypes.arrayOf(PropTypes.node),
        PropTypes.node
    ])
};

module.exports = Route;
