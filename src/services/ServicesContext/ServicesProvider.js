const React = require('react');
const PropTypes = require('prop-types');
const ServicesContext = require('./ServicesContext');

const ServicesProvider = ({ services = {}, children }) => {
    return (
        <ServicesContext.Provider value={services}>
            {children}
        </ServicesContext.Provider>
    );
};

ServicesProvider.propTypes = {
    services: PropTypes.object,
    children: PropTypes.oneOfType([
        PropTypes.arrayOf(PropTypes.node),
        PropTypes.node
    ])
};

module.exports = ServicesProvider;
