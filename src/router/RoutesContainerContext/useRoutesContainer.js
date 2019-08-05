const React = require('react');
const RoutesContainerContext = require('./RoutesContainerContext');

const useRoutesContainer = () => {
    return React.useContext(RoutesContainerContext);
};

module.exports = useRoutesContainer;
