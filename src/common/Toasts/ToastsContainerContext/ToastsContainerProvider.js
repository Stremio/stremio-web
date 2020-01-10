const React = require('react');
const PropTypes = require('prop-types');
const ToastsContainerContext = require('./ToastsContainerContext');

const ToastsContainerProvider = ({ children }) => {
    const [container, setContainer] = React.useState(null);
    return (
        <ToastsContainerContext.Provider value={container}>
            {container instanceof HTMLElement ? children : null}
            <div ref={setContainer} className={'toasts-container'} />
        </ToastsContainerContext.Provider>
    );
};

ToastsContainerProvider.propTypes = {
    children: PropTypes.node
};

module.exports = ToastsContainerProvider;
