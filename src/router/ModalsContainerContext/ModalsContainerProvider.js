const React = require('react');
const PropTypes = require('prop-types');
const ModalsContainerContext = require('./ModalsContainerContext');

const ModalsContainerProvider = ({ containerClassName, children }) => {
    const [container, setContainer] = React.useState(null);
    return (
        <ModalsContainerContext.Provider value={container}>
            {container instanceof HTMLElement ? children : null}
            <div ref={setContainer} className={containerClassName} />
        </ModalsContainerContext.Provider>
    );
};

ModalsContainerProvider.propTypes = {
    containerClassName: PropTypes.string,
    children: PropTypes.oneOfType([
        PropTypes.arrayOf(PropTypes.node),
        PropTypes.node
    ])
};

module.exports = ModalsContainerProvider;
