const storage = {
    getUser: function() {
        try {
            return JSON.parse(localStorage.getItem('user'));
        } catch (e) {
            return null;
        }
    },
    setUser: function(user) {
        try {
            if (user === null) {
                localStorage.removeItem('user');
            } else {
                localStorage.setItem('user', JSON.stringify(user));
            }
        } catch (e) {
        }
    }
};

export default storage;
