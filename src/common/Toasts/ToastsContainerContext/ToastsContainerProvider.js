const React = require('react');
const PropTypes = require('prop-types');
const ToastsContainerContext = require('./ToastsContainerContext');

const ToastsContainerProvider = ({ className, children }) => {
    const [container, setContainer] = React.useState(null);
    return (
        <ToastsContainerContext.Provider value={container}>
            {container instanceof HTMLElement ? children : null}
            <div ref={setContainer} className={className} />
        </ToastsContainerContext.Provider>
    );
};

ToastsContainerProvider.propTypes = {
    className: PropTypes.string,
    children: PropTypes.node
};

module.exports = ToastsContainerProvider;
