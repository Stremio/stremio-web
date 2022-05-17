// Copyright (C) 2017-2022 Smart code 203358507

const React = require('react');
const { useServices } = require('stremio/services');
const { useToast } = require('stremio/common');

const CoreEventsToaster = () => {
    const { core } = useServices();
    const toast = useToast();
    React.useEffect(() => {
        const onCoreEvent = ({ event, args }) => {
            if (event === 'Error') {
                toast.show({
                    type: 'error',
                    title: args.source.event,
                    message: args.error.message,
                    timeout: 4000
                });
            }
        };
        core.transport.on('CoreEvent', onCoreEvent);
        return () => {
            core.transport.off('CoreEvent', onCoreEvent);
        };
    }, []);
    return null;
};

module.exports = CoreEventsToaster;
