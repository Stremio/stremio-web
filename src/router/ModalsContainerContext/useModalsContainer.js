const React = require('react');
const ModalsContainerContext = require('./ModalsContainerContext');

const useModalsContainer = () => {
    return React.useContext(ModalsContainerContext);
};

module.exports = useModalsContainer;
