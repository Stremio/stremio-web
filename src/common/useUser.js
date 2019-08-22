const React = require('react');

const useUser = () => {
    const [user] = React.useState({
        email: '',
        avatar: '',
        logout: () => { }
    });
    return user;
};

module.exports = useUser;
