// Copyright (C) 2017-2023 Smart code 203358507

const React = require('react');
const { useTranslation } = require('react-i18next');
const { useServices } = require('stremio/services');
const { useToast } = require('stremio/common');

const ServicesToaster = () => {
    const { t } = useTranslation();
    const { core, dragAndDrop } = useServices();
    const toast = useToast();
    React.useEffect(() => {
        const onCoreEvent = ({ event, args }) => {
            switch (event) {
                case 'UserAddonsUpgraded': {
                    const upgradedCount = args?.upgraded?.length ?? 0;
                    toast.show({
                        type: 'success',
                        title: upgradedCount > 0
                            ? t('ADDONS_UPDATE_ALL_COUNT', {
                                count: upgradedCount,
                            })
                            : t('ADDONS_UPDATE_ALL_UPTODATE'),
                        timeout: 5000,
                        dataset: { type: 'CoreEvent' }
                    });
                    break;
                }
                case 'AddonUpgraded': {
                    toast.show({
                        type: 'success',
                        title: t('ADDON_UPDATE_SUCCESS'),
                        timeout: 4000,
                        dataset: { type: 'CoreEvent' }
                    });
                    break;
                }
                case 'Error': {
                    if (args.source.event === 'UserPulledFromAPI' && args.source.args.uid === null) {
                        break;
                    }

                    if (args.source.event === 'LibrarySyncWithAPIPlanned' && args.source.args.uid === null) {
                        break;
                    }

                    if (args.error.type === 'Other' && args.error.code === 3 && args.source.event === 'AddonInstalled' && args.source.args.transport_url.startsWith('https://www.strem.io/trakt/addon')) {
                        break;
                    }

                    if (args.error.type === 'Other' && args.error.code === 3 && args.source.event === 'AddonUpgraded') {
                        toast.show({
                            type: 'success',
                            title: t('ADDON_UPDATE_UPTODATE'),
                            timeout: 4000,
                            dataset: { type: 'CoreEvent' }
                        });
                        break;
                    }

                    toast.show({
                        type: 'error',
                        title: args.source.event,
                        message: args.error.message,
                        timeout: 4000,
                        dataset: {
                            type: 'CoreEvent'
                        }
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
                case 'PlayingOnDevice': {
                    toast.show({
                        type: 'success',
                        title: `Stream opened in ${args.device}`,
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
    }, [t]);
    return null;
};

module.exports = ServicesToaster;
