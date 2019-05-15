const React = require('react');
const PropTypes = require('prop-types');
const ModalsContainerContext = require('./ModalsContainerContext');

const ModalsContainerProvider = React.memo(({ containerClassName, children }) => {
    const [container, setContainer] = React.useState(null);
    return (
        <ModalsContainerContext.Provider value={container}>
            {container instanceof HTMLElement ? children : null}
            <div ref={setContainer} className={containerClassName} />
        </ModalsContainerContext.Provider>
    );
});

ModalsContainerProvider.displayName = 'ModalsContainerProvider';

ModalsContainerProvider.propTypes = {
    containerClassName: PropTypes.string,
    children: PropTypes.oneOfType([
        PropTypes.arrayOf(PropTypes.node),
        PropTypes.node
    ])
};

module.exports = ModalsContainerProvider;
