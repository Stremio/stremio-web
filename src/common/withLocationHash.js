const React = require('react');
const useLocationHash = require('./useLocationHash');

const withLocationHash = (Component) => {
    return (props) => {
        const locationHash = useLocationHash();
        return (
            <Component {...props} locationHash={locationHash} />
        );
    };
};

module.exports = withLocationHash;
