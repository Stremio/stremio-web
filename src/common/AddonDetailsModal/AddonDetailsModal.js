// Copyright (C) 2017-2023 Smart code 203358507

const React = require('react');
const PropTypes = require('prop-types');
const ModalDialog = require('stremio/common/ModalDialog');
const { withCoreSuspender } = require('stremio/common/CoreSuspender');
const { useServices } = require('stremio/services');
const AddonDetailsWithRemoteAndLocalAddon = withRemoteAndLocalAddon(require('./AddonDetails'));
const useAddonDetails = require('./useAddonDetails');
const styles = require('./styles');

function withRemoteAndLocalAddon(AddonDetails) {
    const withRemoteAndLocalAddon = ({ remoteAddon, localAddon, ...props }) => {
        const addon = remoteAddon !== null && remoteAddon.content.type === 'Ready' ?
            remoteAddon.content.content
            :
            localAddon !== null ?
                localAddon
                :
                null;
        if (addon === null) {
            return null;
        }

        return (
            <AddonDetails
                {...props}
                id={addon.manifest.id}
                name={addon.manifest.name}
                version={addon.manifest.version}
                background={addon.manifest.background}
                logo={addon.manifest.logo}
                description={addon.manifest.description}
                types={addon.manifest.types}
                transportUrl={addon.transportUrl}
                official={addon.flags.official}
            />
        );
    };
    withRemoteAndLocalAddon.displayName = 'withRemoteAndLocalAddon';
    return withRemoteAndLocalAddon;
}

const AddonDetailsModal = ({ transportUrl, onCloseRequest }) => {
    const { core } = useServices();
    const addonDetails = useAddonDetails(transportUrl);
    const modalButtons = React.useMemo(() => {
        const cancelButton = {
            className: styles['cancel-button'],
            label: 'Cancel',
            props: {
                onClick: (event) => {
                    if (typeof onCloseRequest === 'function') {
                        onCloseRequest({
                            type: 'cancel',
                            reactEvent: event,
                            nativeEvent: event.nativeEvent
                        });
                    }
                }
            }
        };
        const configureButton = addonDetails.remoteAddon !== null &&
            addonDetails.remoteAddon.content.type === 'Ready' &&
            addonDetails.remoteAddon.content.content.manifest.behaviorHints.configurable ?
            {
                className: styles['configure-button'],
                label: 'Configure',
                props: {
                    onClick: (event) => {
                        window.open(transportUrl.replace('manifest.json', 'configure'));
                        if (typeof onCloseRequest === 'function') {
                            onCloseRequest({
                                type: 'configure',
                                reactEvent: event,
                                nativeEvent: event.nativeEvent
                            });
                        }
                    }
                }
            }
            :
            null;
        const toggleButton = addonDetails.localAddon !== null ?
            {
                className: styles['uninstall-button'],
                label: 'Uninstall',
                props: {
                    onClick: (event) => {
                        core.transport.dispatch({
                            action: 'Ctx',
                            args: {
                                action: 'UninstallAddon',
                                args: addonDetails.localAddon
                            }
                        });
                        if (typeof onCloseRequest === 'function') {
                            onCloseRequest({
                                type: 'uninstall',
                                reactEvent: event,
                                nativeEvent: event.nativeEvent
                            });
                        }
                    }
                }
            }
            :
            addonDetails.remoteAddon !== null && addonDetails.remoteAddon.content.type === 'Ready' ?
                {

                    className: styles['install-button'],
                    label: 'Install',
                    props: {
                        onClick: (event) => {
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
                        }
                    }
                }
                :
                null;
        return toggleButton !== null ? configureButton ? [cancelButton, configureButton, toggleButton] : [cancelButton, toggleButton] : [cancelButton];
    }, [addonDetails, onCloseRequest]);
    const modalBackground = React.useMemo(() => {
        return addonDetails.remoteAddon?.content.type === 'Ready' ? addonDetails.remoteAddon.content.content.manifest.background : null;
    }, [addonDetails.remoteAddon]);
    return (
        <ModalDialog className={styles['addon-details-modal-container']} title={'Stremio addon'} buttons={modalButtons} background={modalBackground} onCloseRequest={onCloseRequest}>
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
                        addonDetails.remoteAddon.content.type === 'Err' && addonDetails.localAddon === null ?
                            <div className={styles['addon-details-message-container']}>
                                Failed to get addon manifest from {addonDetails.selected.transportUrl}
                                <div>{addonDetails.remoteAddon.content.content.message}</div>
                            </div>
                            :
                            <AddonDetailsWithRemoteAndLocalAddon
                                className={styles['addon-details-container']}
                                remoteAddon={addonDetails.remoteAddon}
                                localAddon={addonDetails.localAddon}
                            />
            }
        </ModalDialog>
    );
};

AddonDetailsModal.propTypes = {
    transportUrl: PropTypes.string,
    onCloseRequest: PropTypes.func
};

const AddonDetailsModalFallback = ({ onCloseRequest }) => (
    <ModalDialog
        className={styles['addon-details-modal-container']}
        title={'Stremio addon'}
        onCloseRequest={onCloseRequest}
    >
        <div className={styles['addon-details-message-container']}>
            Loading addon manifest
        </div>
    </ModalDialog>
);

AddonDetailsModalFallback.propTypes = AddonDetailsModal.propTypes;

module.exports = withCoreSuspender(AddonDetailsModal, AddonDetailsModalFallback);
