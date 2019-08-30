const React = require('react');
const PropTypes = require('prop-types');
const { FocusableProvider } = require('../FocusableContext');
const { ModalsContainerProvider } = require('../ModalsContainerContext');

const Route = ({ children }) => {
    const onRoutesContainerChildrenChange = React.useCallback(({ routesContainer, contentContainer }) => {
        return routesContainer.lastElementChild.contains(contentContainer);
    }, []);
    const onModalsContainerChildrenChange = React.useCallback(({ modalsContainer }) => {
        return modalsContainer.childElementCount === 0;
    }, []);
    return (
        <div className={'route-container'}>
            <ModalsContainerProvider>
                <FocusableProvider onRoutesContainerChildrenChange={onRoutesContainerChildrenChange} onModalsContainerChildrenChange={onModalsContainerChildrenChange}>
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
