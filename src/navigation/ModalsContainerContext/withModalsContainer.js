const React = require('react');
const useModalsContainer = require('./useModalsContainer');

const withModalsContainer = (Component) => {
    return (props) => {
        const modalsContainer = useModalsContainer();
        return (
            <Component {...props} modalsContainer={modalsContainer} />
        );
    };
};

module.exports = withModalsContainer;
