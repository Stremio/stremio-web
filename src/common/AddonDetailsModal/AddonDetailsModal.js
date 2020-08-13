// Copyright (C) 2017-2020 Smart code 203358507

const React = require('react');
const PropTypes = require('prop-types');
const ModalDialog = require('stremio/common/ModalDialog');
const { useServices } = require('stremio/services');
const AddonDetails = require('./AddonDetails');
const useAddonDetails = require('./useAddonDetails');
const styles = require('./styles');

const AddonDetailsModal = ({ transportUrl, onCloseRequest }) => {
    const { core } = useServices();
    const addonDetails = useAddonDetails(transportUrl);
    const modalButtons = React.useMemo(() => {
        if (addonDetails.addon === null || addonDetails.addon.content.type !== 'Ready') {
            return null;
        }

        const cancelOnClick = (event) => {
            if (typeof onCloseRequest === 'function') {
                onCloseRequest({
                    type: 'cancel',
                    reactEvent: event,
                    nativeEvent: event.nativeEvent
                });
            }
        };
        const installOnClick = (event) => {
            core.transport.dispatch({
                action: 'Ctx',
                args: {
                    action: 'InstallAddon',
                    args: addonDetails.addon.content.content
                }
            });
            if (typeof onCloseRequest === 'function') {
                onCloseRequest({
                    type: 'install',
                    reactEvent: event,
                    nativeEvent: event.nativeEvent
                });
            }
        };
        const uninstallOnClick = (event) => {
            core.transport.dispatch({
                action: 'Ctx',
                args: {
                    action: 'UninstallAddon',
                    args: addonDetails.addon.content.content.transportUrl
                }
            });
            if (typeof onCloseRequest === 'function') {
                onCloseRequest({
                    type: 'uninstall',
                    reactEvent: event,
                    nativeEvent: event.nativeEvent
                });
            }
        };
        return [
            {
                className: styles['cancel-button'],
                label: 'Cancel',
                props: {
                    onClick: cancelOnClick
                }
            },
            addonDetails.addon.content.content.installed ?
                {
                    className: styles['uninstall-button'],
                    label: 'Uninstall',
                    props: {
                        onClick: uninstallOnClick
                    }
                }
                :
                {

                    className: styles['install-button'],
                    label: 'Install',
                    props: {
                        onClick: installOnClick
                    }
                }
        ];
    }, [addonDetails, onCloseRequest]);
    return (
        <ModalDialog className={styles['addon-details-modal-container']} title={'Stremio addon'} buttons={modalButtons} onCloseRequest={onCloseRequest}>
            {
                addonDetails.selected === null ?
                    <div className={styles['addon-details-message-container']}>
                        Loading addon manifest
                    </div>
                    :
                    addonDetails.addon === null || addonDetails.addon.content.type === 'Loading' ?
                        <div className={styles['addon-details-message-container']}>
                            Loading addon manifest from {addonDetails.selected.transport_url}
                        </div>
                        :
                        addonDetails.addon.content.type === 'Err' ?
                            <div className={styles['addon-details-message-container']}>
                                Failed to get addon manifest from {addonDetails.selected.transport_url}.
                                {addonDetails.addon.content.content}
                            </div>
                            :
                            <AddonDetails
                                className={styles['addon-details-container']}
                                id={addonDetails.addon.content.content.manifest.id}
                                name={addonDetails.addon.content.content.manifest.name}
                                version={addonDetails.addon.content.content.manifest.version}
                                logo={addonDetails.addon.content.content.manifest.logo}
                                description={addonDetails.addon.content.content.manifest.description}
                                types={addonDetails.addon.content.content.manifest.types}
                                transportUrl={addonDetails.addon.content.content.transportUrl}
                                official={addonDetails.addon.content.content.flags.official}
                            />
            }
        </ModalDialog>
    );
};

AddonDetailsModal.propTypes = {
    transportUrl: PropTypes.string,
    onCloseRequest: PropTypes.func
};

module.exports = AddonDetailsModal;
