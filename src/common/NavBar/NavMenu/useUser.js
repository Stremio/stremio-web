const React = require('react');

const useUser = () => {
    const [user] = React.useState({
        email: '',
        avatar: '',
        anonymous: true,
        logout: () => { }
    });
    return user;
};

module.exports = useUser;
