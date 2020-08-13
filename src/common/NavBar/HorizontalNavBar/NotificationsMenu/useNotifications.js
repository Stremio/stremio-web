// Copyright (C) 2017-2020 Smart code 203358507

const React = require('react');
const { useServices } = require('stremio/services');

const useNotifications = () => {
    const [notifications, setNotifications] = React.useState([]);
    const { core } = useServices();
    React.useEffect(() => {
        const onNewState = () => {
            const state = core.transport.getState();
            setNotifications(state.notifications.groups);
        };
        core.transport.on('NewModel', onNewState);
        core.transport.dispatch({
            action: 'Load',
            args: {
                load: 'Notifications'
            }
        });
        return () => {
            core.transport.off('NewModel', onNewState);
        };
    }, []);
    return notifications;
};

module.exports = useNotifications;
