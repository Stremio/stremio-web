// Copyright (C) 2017-2023 Smart code 203358507

const React = require('react');
const { useTranslation } = require('react-i18next');
const PropTypes = require('prop-types');
const ModalDialog = require('stremio/components/ModalDialog');
const { withCoreSuspender } = require('stremio/common/CoreSuspender');
const { usePlatform } = require('stremio/common/Platform');
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
    const { t } = useTranslation();
    const { core } = useServices();
    const platform = usePlatform();
    const addonDetails = useAddonDetails(transportUrl);
    const modalButtons = React.useMemo(() => {
        const cancelButton = {
            className: styles['cancel-button'],
            label: t('BUTTON_CANCEL'),
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
                label: t('ADDON_CONFIGURE'),
                props: {
                    onClick: (event) => {
                        platform.openExternal(transportUrl.replace('manifest.json', 'configure'));
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
                label: t('ADDON_UNINSTALL'),
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
            addonDetails.remoteAddon !== null &&
            addonDetails.remoteAddon.content.type === 'Ready' &&
            !addonDetails.remoteAddon.content.content.manifest.behaviorHints.configurationRequired ?
                {

                    className: styles['install-button'],
                    label: t('ADDON_INSTALL'),
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
        return configureButton && toggleButton ? [cancelButton, configureButton, toggleButton] : configureButton ? [cancelButton, configureButton] : toggleButton ? [cancelButton, toggleButton] : [cancelButton];
    }, [addonDetails, onCloseRequest]);
    const modalBackground = React.useMemo(() => {
        return addonDetails.remoteAddon?.content.type === 'Ready' ? addonDetails.remoteAddon.content.content.manifest.background : null;
    }, [addonDetails.remoteAddon]);
    return (
        <ModalDialog className={styles['addon-details-modal-container']} title={t('STREMIO_COMMUNITY_ADDON')} buttons={modalButtons} background={modalBackground} onCloseRequest={onCloseRequest}>
            {
                addonDetails.selected === null ?
                    <div className={styles['addon-details-message-container']}>
                        {t('ADDON_LOADING_MANIFEST')}
                    </div>
                    :
                    addonDetails.remoteAddon === null || addonDetails.remoteAddon.content.type === 'Loading' ?
                        <div className={styles['addon-details-message-container']}>
                            {t('ADDON_LOADING_MANIFEST_FROM', { origin: addonDetails.selected.transportUrl})}
                        </div>
                        :
                        addonDetails.remoteAddon.content.type === 'Err' && addonDetails.localAddon === null ?
                            <div className={styles['addon-details-message-container']}>
                                {t('ADDON_LOADING_MANIFEST_FAILED', {origin: addonDetails.selected.transportUrl})}
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

const AddonDetailsModalFallback = ({ onCloseRequest }) => {
    const { t } = useTranslation();
    return <ModalDialog
        className={styles['addon-details-modal-container']}
        title={t('STREMIO_COMMUNITY_ADDON')}
        onCloseRequest={onCloseRequest}
    >
        <div className={styles['addon-details-message-container']}>
            {t('ADDON_LOADING_MANIFEST')}
        </div>
    </ModalDialog>;
};

AddonDetailsModalFallback.propTypes = AddonDetailsModal.propTypes;

module.exports = withCoreSuspender(AddonDetailsModal, AddonDetailsModalFallback);
