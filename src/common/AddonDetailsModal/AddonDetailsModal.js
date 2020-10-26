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
        if (addonDetails.remoteAddon === null || addonDetails.remoteAddon.content.type !== 'Ready') {
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
                    args: addonDetails.remoteAddon.content.content
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
                    args: addonDetails.remoteAddon.content.content.transportUrl
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
            addonDetails.localAddon !== null ?
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
                    addonDetails.remoteAddon === null || addonDetails.remoteAddon.content.type === 'Loading' ?
                        <div className={styles['addon-details-message-container']}>
                            Loading addon manifest from {addonDetails.selected.transportUrl}
                        </div>
                        :
                        addonDetails.remoteAddon.content.type === 'Err' ?
                            <div className={styles['addon-details-message-container']}>
                                Failed to get addon manifest from {addonDetails.selected.transportUrl}
                                <div>{addonDetails.remoteAddon.content.content.message}</div>
                            </div>
                            :
                            <AddonDetails
                                className={styles['addon-details-container']}
                                id={addonDetails.remoteAddon.content.content.manifest.id}
                                name={addonDetails.remoteAddon.content.content.manifest.name}
                                version={addonDetails.remoteAddon.content.content.manifest.version}
                                logo={addonDetails.remoteAddon.content.content.manifest.logo}
                                description={addonDetails.remoteAddon.content.content.manifest.description}
                                types={addonDetails.remoteAddon.content.content.manifest.types}
                                transportUrl={addonDetails.remoteAddon.content.content.transportUrl}
                                official={addonDetails.remoteAddon.content.content.flags.official}
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
