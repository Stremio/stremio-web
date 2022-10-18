// Copyright (C) 2017-2022 Smart code 203358507

const React = require('react');
const { useServices } = require('stremio/services');
const { useToast } = require('stremio/common');

const ServicesToaster = () => {
    const { core, dragAndDrop } = useServices();
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
        const onDrop = (file) => {
            toast.show({
                type: 'alert',
                title: 'Processing file',
                message: file.name,
                timeout: 4000
            });
        };
        const onDragAndDropError = (error) => {
            toast.show({
                type: 'error',
                title: error.message,
                message: error.file?.name,
                timeout: 4000
            });
        };
        core.transport.on('CoreEvent', onCoreEvent);
        dragAndDrop.on('drop', onDrop);
        dragAndDrop.on('error', onDragAndDropError);
        return () => {
            core.transport.off('CoreEvent', onCoreEvent);
            dragAndDrop.off('drop', onDrop);
            dragAndDrop.off('error', onDragAndDropError);
        };
    }, []);
    return null;
};

module.exports = ServicesToaster;
