// Copyright (C) 2017-2022 Smart code 203358507

const React = require('react');
const { useServices } = require('stremio/services');
const { useToast } = require('stremio/common');

const ServicesToaster = () => {
    const { core, dragAndDrop } = useServices();
    const toast = useToast();
    React.useEffect(() => {
        const onCoreEvent = ({ event, args }) => {
            switch (event) {
                case 'Error': {
                    if (args.source.event === 'UserPulledFromAPI' && args.source.args.uid === null) {
                        break;
                    }

                    toast.show({
                        type: 'error',
                        title: args.source.event,
                        message: args.error.message,
                        timeout: 4000
                    });
                    break;
                }
                case 'TorrentParsed': {
                    toast.show({
                        type: 'success',
                        title: 'Torrent file parsed',
                        timeout: 4000
                    });
                    break;
                }
                case 'MagnetParsed': {
                    toast.show({
                        type: 'success',
                        title: 'Magnet link parsed',
                        timeout: 4000
                    });
                    break;
                }
            }
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
        dragAndDrop.on('error', onDragAndDropError);
        return () => {
            core.transport.off('CoreEvent', onCoreEvent);
            dragAndDrop.off('error', onDragAndDropError);
        };
    }, []);
    return null;
};

module.exports = ServicesToaster;
