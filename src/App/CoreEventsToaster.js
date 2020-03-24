const React = require('react');
const { useServices } = require('stremio/services');
const { useToast } = require('stremio/common');

const CoreEventsToaster = () => {
    const { core } = useServices();
    const toast = useToast();
    React.useEffect(() => {
        const onEvent = ({ event, args }) => {
            // UserAuthenticated are handled only in the /intro route
            if (event === 'Error' && args.source.event !== 'UserAuthenticated') {
                toast.show({
                    type: 'error',
                    title: args.source.event,
                    message: args.error.message,
                    timeout: 4000
                });
            }
        };
        core.on('Event', onEvent);
        return () => {
            core.off('Event', onEvent);
        };
    }, []);
    return null;
};

module.exports = CoreEventsToaster;
