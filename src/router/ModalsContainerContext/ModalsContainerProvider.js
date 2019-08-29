const React = require('react');
const PropTypes = require('prop-types');
const useChildrenChangeEffect = require('../useChildrenChangeEffect');
const ModalsContainerContext = require('./ModalsContainerContext');

const ModalsContainerProvider = ({ children }) => {
    const [container, setContainer] = React.useState(null);
    useChildrenChangeEffect(container, children);
    return (
        <ModalsContainerContext.Provider value={container}>
            {container instanceof HTMLElement ? children : null}
            <div ref={setContainer} className={'modals-container'} />
        </ModalsContainerContext.Provider>
    );
};

ModalsContainerProvider.propTypes = {
    children: PropTypes.oneOfType([
        PropTypes.arrayOf(PropTypes.node),
        PropTypes.node
    ])
};

module.exports = ModalsContainerProvider;
