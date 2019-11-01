const React = require('react');
const { useServices } = require('stremio/services');

const useUser = () => {
    const { core } = useServices();
    const getUserFromState = React.useCallback((state) => {
        return state.ctx && state.ctx.auth && state.ctx.auth.user;
    }, []);
    const [user, setUser] = React.useState(() => {
        return getUserFromState(core.getState());
    });
    React.useEffect(() => {
        const onNewModel = () => {
            setUser(getUserFromState(core.getState()));
        };
        core.on('NewModel', onNewModel);
        return () => {
            core.off('NewModel', onNewModel);
        };
    }, []);
    return user;
};

module.exports = useUser;
