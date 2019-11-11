const React = require('react');
const { useServices } = require('stremio/services');

const useUser = () => {
    const { core } = useServices();
    const [user, setUser] = React.useState(() => {
        const state = core.getState();
        return state.ctx.content.auth ? state.ctx.content.auth.user : null;
    });
    React.useEffect(() => {
        const onNewState = () => {
            const state = core.getState();
            setUser(state.ctx.content.auth ? state.ctx.content.auth.user : null);
        };
        core.on('NewModel', onNewState);
        return () => {
            core.off('NewModel', onNewState);
        };
    }, []);
    return user;
};

module.exports = useUser;
