const React = require('react');
const ToastsContainerContext = require('./ToastsContainerContext');

const useToastsContainer = () => {
    return React.useContext(ToastsContainerContext);
};

module.exports = useToastsContainer;
