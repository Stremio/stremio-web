const React = require('react');
const { useServices } = require('stremio/services');
const useModelState = require('stremio/common/useModelState');

const initUserState = () => null;

const mapUserState = (ctx) => {
    return ctx.content.auth ? ctx.content.auth.user : null;
};

const useUser = () => {
    const { core } = useServices();
    const logout = React.useCallback(() => {
        core.dispatch({
            action: 'UserOp',
            args: {
                userOp: 'Logout'
            }
        });
    }, []);
    const user = useModelState({
        model: 'ctx',
        map: mapUserState,
        init: initUserState
    });
    return [user, logout];
};

module.exports = useUser;
