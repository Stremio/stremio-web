const React = require('react');
const PropTypes = require('prop-types');
const classnames = require('classnames');
const RoutesContainerContext = require('./RoutesContainerContext');

const RoutesContainerProvider = ({ className, children }) => {
    const [container, setContainer] = React.useState(null);
    return (
        <RoutesContainerContext.Provider value={container}>
            <div ref={setContainer} className={classnames(className, 'routes-container')}>
                {container instanceof HTMLElement ? children : null}
            </div>
        </RoutesContainerContext.Provider>
    );
};

RoutesContainerProvider.propTypes = {
    className: PropTypes.string,
    children: PropTypes.oneOfType([
        PropTypes.arrayOf(PropTypes.node),
        PropTypes.node
    ])
};

module.exports = RoutesContainerProvider;
