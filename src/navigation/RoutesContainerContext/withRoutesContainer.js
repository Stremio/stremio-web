const React = require('react');
const useRoutesContainer = require('./useRoutesContainer');

const withRoutesContainer = (Component) => {
    return (props) => {
        const routesContainer = useRoutesContainer();
        return (
            <Component {...props} routesContainer={routesContainer} />
        );
    };
};

module.exports = withRoutesContainer;
