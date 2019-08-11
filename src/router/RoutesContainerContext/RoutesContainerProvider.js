const React = require('react');
const PropTypes = require('prop-types');
const RoutesContainerContext = require('./RoutesContainerContext');

const RoutesContainerProvider = ({ children }) => {
    const [container, setContainer] = React.useState(null);
    return (
        <RoutesContainerContext.Provider value={container}>
            <div ref={setContainer} className={'routes-container'}>
                {container instanceof HTMLElement ? children : null}
            </div>
        </RoutesContainerContext.Provider>
    );
};

RoutesContainerProvider.propTypes = {
    children: PropTypes.oneOfType([
        PropTypes.arrayOf(PropTypes.node),
        PropTypes.node
    ])
};

module.exports = RoutesContainerProvider;
