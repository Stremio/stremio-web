const React = require('react');
const Icon = require('stremio-icons/dom');
const { Button, Multiselect, NavBar, TextInput, SharePrompt, ModalDialog, useBinaryState } = require('stremio/common');
const Addon = require('./Addon');
const useAddons = require('./useAddons');
const useSelectableInputs = require('./useSelectableInputs');
const styles = require('./styles');

const Addons = ({ urlParams, queryParams }) => {
    const navigateToAddonDetails = React.useCallback((transportUrl) => {
        const queryParams = new URLSearchParams([['addon', transportUrl]]);
        if (typeof urlParams.addonTransportUrl === 'string' && typeof urlParams.catalogId === 'string' && typeof urlParams.type === 'string') {
            const addonTransportUrl = encodeURIComponent(urlParams.addonTransportUrl);
            const catalogId = encodeURIComponent(urlParams.catalogId);
            const type = encodeURIComponent(urlParams.type);
            window.location.replace(`#/addons/${addonTransportUrl}/${catalogId}/${type}?${queryParams}`);
        } else {
            window.location.replace(`#/addons?${queryParams}`);
        }
    }, [urlParams]);
    const addons = useAddons(urlParams);
    const selectInputs = useSelectableInputs(addons);
    const [addAddonModalOpen, openAddAddonModal, closeAddAddonModal] = useBinaryState(false);
    const addAddonUrlInputRef = React.useRef(null);
    const addAddonOnSubmit = React.useCallback(() => {
        if (addAddonUrlInputRef.current !== null) {
            navigateToAddonDetails(addAddonUrlInputRef.current.value);
        }
    }, [navigateToAddonDetails]);
    const addAddonModalButtons = React.useMemo(() => {
        return [
            {
                className: styles['cancel-button'],
                label: 'Cancel',
                props: {
                    onClick: closeAddAddonModal
                }
            },
            {
                label: 'Add',
                props: {
                    onClick: addAddonOnSubmit
                }
            }
        ];
    }, [addAddonOnSubmit]);
    const [search, setSearch] = React.useState('');
    const searchInputOnChange = React.useCallback((event) => {
        setSearch(event.currentTarget.value);
    }, []);
    const [sharedTransportUrl, setSharedTransportUrl] = React.useState(null);
    const shareModalOnClose = React.useCallback(() => {
        setSharedTransportUrl(null);
    }, []);
    const onAddonShare = React.useCallback((event) => {
        setSharedTransportUrl(event.dataset.transportUrl);
    }, []);
    const onAddonToggle = React.useCallback((event) => {
        navigateToAddonDetails(event.dataset.transportUrl);
    }, []);
    React.useLayoutEffect(() => {
        closeAddAddonModal(null);
        setSearch('');
        setSharedTransportUrl(null);
    }, [urlParams, queryParams]);
    return (
        <div className={styles['addons-container']}>
            <NavBar className={styles['nav-bar']} backButton={true} title={'Addons'} />
            <div className={styles['addons-content']}>
                <div className={styles['selectable-inputs-container']}>
                    <Button className={styles['add-button-container']} title={'Add addon'} onClick={openAddAddonModal}>
                        <Icon className={styles['icon']} icon={'ic_plus'} />
                        <div className={styles['add-button-label']}>Add addon</div>
                    </Button>
                    {selectInputs.map((selectInput, index) => (
                        <Multiselect
                            {...selectInput}
                            key={index}
                            className={styles['select-input-container']}
                        />
                    ))}
                    <label className={styles['search-bar-container']}>
                        <Icon className={styles['icon']} icon={'ic_search'} />
                        <TextInput
                            className={styles['search-input']}
                            type={'text'}
                            placeholder={'Search addons...'}
                            value={search}
                            onChange={searchInputOnChange}
                        />
                    </label>
                </div>
                {
                    addons.selectable.catalogs.length === 0 && addons.catalog_resource === null ?
                        <div className={styles['message-container']}>
                            No addons
                        </div>
                        :
                        addons.catalog_resource === null ?
                            <div className={styles['message-container']}>
                                No select
                            </div>
                            :
                            addons.catalog_resource.content.type === 'Err' ?
                                <div className={styles['message-container']}>
                                    Addons could not be loaded
                                </div>
                                :
                                addons.catalog_resource.content.type === 'Loading' ?
                                    <div className={styles['message-container']}>
                                        Loading
                                    </div>
                                    :
                                    <div className={styles['addons-list-container']}>
                                        {
                                            addons.catalog_resource.content.content
                                                .filter((addon) => {
                                                    return search.length === 0 ||
                                                        (
                                                            (typeof addon.manifest.name === 'string' && addon.manifest.name.toLowerCase().includes(search.toLowerCase())) ||
                                                            (typeof addon.manifest.description === 'string' && addon.manifest.description.toLowerCase().includes(search.toLowerCase()))
                                                        );
                                                })
                                                .map((addon, index) => (
                                                    <Addon
                                                        key={index}
                                                        className={styles['addon']}
                                                        id={addon.manifest.id}
                                                        name={addon.manifest.name}
                                                        logo={addon.manifest.logo}
                                                        description={addon.manifest.description}
                                                        types={addon.manifest.types}
                                                        version={addon.manifest.version}
                                                        onShare={onAddonShare}
                                                        onToggle={onAddonToggle}
                                                        dataset={{ transportUrl: addon.transportUrl }}
                                                    />
                                                ))
                                        }
                                    </div>
                }
            </div>
            {
                addAddonModalOpen ?
                    <ModalDialog
                        className={styles['add-addon-modal-container']}
                        title={'Add addon'}
                        buttons={addAddonModalButtons}
                        onCloseRequest={closeAddAddonModal}>
                        <TextInput
                            ref={addAddonUrlInputRef}
                            className={styles['addon-url-input']}
                            type={'text'}
                            placeholder={'Paste url...'}
                            onSubmit={addAddonOnSubmit}
                        />
                    </ModalDialog>
                    :
                    null
            }
            {
                typeof sharedTransportUrl === 'string' ?
                    <ModalDialog
                        className={styles['share-modal-container']}
                        title={'Share addon'}
                        onCloseRequest={shareModalOnClose}>
                        <SharePrompt className={styles['share-prompt-container']} url={sharedTransportUrl} />
                    </ModalDialog>
                    :
                    null
            }
        </div>
    );
};

module.exports = Addons;
