const React = require('react');
const ServicesContext = require('./ServicesContext');

const useServices = () => {
    return React.useContext(ServicesContext);
};

module.exports = useServices;
