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
        if (addonDetails.descriptor === null || addonDetails.descriptor.content.type !== 'Ready') {
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
            core.dispatch({
                action: 'AddonOp',
                args: {
                    addonOp: 'Install',
                    args: addonDetails.descriptor.content.content
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
            core.dispatch({
                action: 'AddonOp',
                args: {
                    addonOp: 'Uninstall',
                    args: {
                        transport_url: addonDetails.descriptor.content.content.transportUrl
                    }
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
            addonDetails.descriptor.content.content.installed ?
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
                addonDetails.descriptor === null || addonDetails.descriptor.content.type === 'Loading' ?
                    <div className={styles['addon-details-message-container']}>
                        Loading addon manifest from {transportUrl}
                    </div>
                    :
                    addonDetails.descriptor.content.type === 'Err' ?
                        <div className={styles['addon-details-message-container']}>
                            Failed to get addon manifest from {transportUrl}
                        </div>
                        :
                        <AddonDetails
                            className={styles['addon-details-container']}
                            id={addonDetails.descriptor.content.content.manifest.id}
                            name={addonDetails.descriptor.content.content.manifest.name}
                            version={addonDetails.descriptor.content.content.manifest.version}
                            logo={addonDetails.descriptor.content.content.manifest.logo}
                            description={addonDetails.descriptor.content.content.manifest.description}
                            types={addonDetails.descriptor.content.content.manifest.types}
                            transportUrl={addonDetails.descriptor.content.content.transportUrl}
                            official={addonDetails.descriptor.content.content.flags.official}
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
