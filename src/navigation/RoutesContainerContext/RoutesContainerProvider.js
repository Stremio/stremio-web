const React = require('react');
const PropTypes = require('prop-types');
const RoutesContainerContext = require('./RoutesContainerContext');

const RoutesContainerProvider = React.memo(({ containerClassName, children }) => {
    const [container, setContainer] = React.useState(null);
    return (
        <RoutesContainerContext.Provider value={container}>
            <div ref={setContainer} className={containerClassName}>
                {container instanceof HTMLElement ? children : null}
            </div>
        </RoutesContainerContext.Provider>
    );
});

RoutesContainerProvider.displayName = 'RoutesContainerProvider';

RoutesContainerProvider.propTypes = {
    containerClassName: PropTypes.string,
    children: PropTypes.oneOfType([
        PropTypes.arrayOf(PropTypes.node),
        PropTypes.node
    ])
};

module.exports = RoutesContainerProvider;
