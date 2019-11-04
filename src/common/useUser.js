const React = require('react');
const { useServices } = require('stremio/services');

const useUser = () => {
    const { core } = useServices();
    const [user, setUser] = React.useState(state.ctx.auth ? state.ctx.auth.user : null);
    React.useEffect(() => {
        const onNewModel = () => {
            setUser(state.ctx.auth ? state.ctx.auth.user : null);
        };
        core.on('NewModel', onNewModel);
        return () => {
            core.off('NewModel', onNewModel);
        };
    }, []);
    return user;
};

module.exports = useUser;
