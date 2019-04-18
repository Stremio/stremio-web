const React = require('react');
const ModalsContainerContext = require('./ModalsContainerContext');

const withModalsContainer = (Component) => {
    return (props) => (
        <ModalsContainerContext.Consumer>
            {modalsContainer => <Component {...props} modalsContainer={modalsContainer} />}
        </ModalsContainerContext.Consumer>
    );
};

module.exports = withModalsContainer;
