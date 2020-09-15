// Copyright (C) 2017-2020 Smart code 203358507

const React = require('react');
const PropTypes = require('prop-types');
const { useRouteFocused } = require('stremio-router');
const Icon = require('@stremio/stremio-icons/dom');
const { AddonDetailsModal, Button, Image, Multiselect, MainNavBars, TextInput, SearchBar, SharePrompt, ModalDialog, useBinaryState } = require('stremio/common');
const Addon = require('./Addon');
const useInstalledAddons = require('./useInstalledAddons');
const useRemoteAddons = require('./useRemoteAddons');
const useSelectableInputs = require('./useSelectableInputs');
const styles = require('./styles');

const Addons = ({ urlParams, queryParams }) => {
    const routeFocused = useRouteFocused();
    const navigate = React.useCallback((args) => {
        if (!routeFocused) {
            return;
        }

        const nextPath = args.hasOwnProperty('request') ?
            `/${encodeURIComponent(args.request.path.type_name)}/${encodeURIComponent(args.request.base)}/${encodeURIComponent(args.request.path.id)}`
            :
            args.hasOwnProperty('type_name') ?
                typeof args.type_name === 'string' ?
                    `/${encodeURIComponent(args.type_name)}`
                    :
                    ''
                :
                typeof urlParams.type === 'string' && typeof urlParams.transportUrl === 'string' && typeof urlParams.catalogId === 'string' ?
                    `/${encodeURIComponent(urlParams.type)}/${encodeURIComponent(urlParams.transportUrl)}/${encodeURIComponent(urlParams.catalogId)}`
                    :
                    '';
        const nextQueryParams = new URLSearchParams(queryParams);
        if (args.hasOwnProperty('detailsTransportUrl')) {
            if (typeof args.detailsTransportUrl === 'string') {
                nextQueryParams.set('addon', args.detailsTransportUrl);
            } else {
                nextQueryParams.delete('addon');
            }
        }

        window.location = `#/addons${nextPath}?${nextQueryParams}`;
    }, [routeFocused, urlParams, queryParams]);
    const installedAddons = useInstalledAddons(urlParams);
    const remoteAddons = useRemoteAddons(urlParams);
    const detailsTransportUrl = queryParams.get('addon');
    const selectInputs = useSelectableInputs(installedAddons, remoteAddons, navigate);
    const [addAddonModalOpen, openAddAddonModal, closeAddAddonModal] = useBinaryState(false);
    const addAddonUrlInputRef = React.useRef(null);
    const addAddonOnSubmit = React.useCallback(() => {
        if (addAddonUrlInputRef.current !== null) {
            navigate({ detailsTransportUrl: addAddonUrlInputRef.current.value });
        }
    }, [navigate]);
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
    const [sharedAddon, setSharedAddon] = React.useState(null);
    const renderLogoFallback = React.useMemo(() => () => {
        return (
            <Icon className={styles['icon']} icon={'ic_addons'} />
        );
    }, []);
    const clearSharedAddon = React.useCallback(() => {
        setSharedAddon(null);
    }, []);
    const onAddonShare = React.useCallback((event) => {
        setSharedAddon(event.dataset.addon);
    }, []);
    const onAddonToggle = React.useCallback((event) => {
        navigate({ detailsTransportUrl: event.dataset.addon.transportUrl });
    }, [navigate]);
    const closeAddonDetails = React.useCallback(() => {
        navigate({ detailsTransportUrl: null });
    }, [navigate]);
    const searchFilterPredicate = React.useCallback((addon) => {
        return search.length === 0 ||
            (
                (typeof addon.manifest.name === 'string' && addon.manifest.name.toLowerCase().includes(search.toLowerCase())) ||
                (typeof addon.manifest.description === 'string' && addon.manifest.description.toLowerCase().includes(search.toLowerCase()))
            );
    }, [search]);
    React.useLayoutEffect(() => {
        closeAddAddonModal();
        setSearch('');
        clearSharedAddon();
    }, [urlParams, queryParams]);
    return (
        <MainNavBars className={styles['addons-container']} route={'addons'}>
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
                    <div className={styles['spacing']} />
                    <SearchBar
                        className={styles['search-bar']}
                        title={'Search addons'}
                        value={search}
                        onChange={searchInputOnChange}
                    />
                </div>
                {
                    installedAddons.selected !== null ?
                        installedAddons.type_names.length === 0 ?
                            <div className={styles['message-container']}>
                                No addons ware installed!
                            </div>
                            :
                            installedAddons.addons.length === 0 ?
                                <div className={styles['message-container']}>
                                    No addons ware installed for that type!
                                </div>
                                :
                                <div className={styles['addons-list-container']}>
                                    {
                                        installedAddons.addons
                                            .filter(searchFilterPredicate)
                                            .map((addon, index) => (
                                                <Addon
                                                    key={index}
                                                    className={styles['addon']}
                                                    id={addon.manifest.id}
                                                    name={addon.manifest.name}
                                                    version={addon.manifest.version}
                                                    logo={addon.manifest.logo}
                                                    description={addon.manifest.description}
                                                    types={addon.manifest.types}
                                                    installed={addon.installed}
                                                    onToggle={onAddonToggle}
                                                    onShare={onAddonShare}
                                                    dataset={{ addon }}
                                                />
                                            ))
                                    }
                                </div>
                        :
                        remoteAddons.selected !== null ?
                            remoteAddons.catalog_resource.content.type === 'Err' ?
                                <div className={styles['message-container']}>
                                    Addons could not be loaded!
                                </div>
                                :
                                remoteAddons.catalog_resource.content.type === 'Loading' ?
                                    <div className={styles['message-container']}>
                                        Loading!
                                    </div>
                                    :
                                    <div className={styles['addons-list-container']}>
                                        {
                                            remoteAddons.catalog_resource.content.content
                                                .filter(searchFilterPredicate)
                                                .map((addon, index) => (
                                                    <Addon
                                                        key={index}
                                                        className={styles['addon']}
                                                        id={addon.manifest.id}
                                                        name={addon.manifest.name}
                                                        version={addon.manifest.version}
                                                        logo={addon.manifest.logo}
                                                        description={addon.manifest.description}
                                                        types={addon.manifest.types}
                                                        installed={addon.installed}
                                                        onToggle={onAddonToggle}
                                                        onShare={onAddonShare}
                                                        dataset={{ addon }}
                                                    />
                                                ))
                                        }
                                    </div>
                            :
                            <div className={styles['message-container']}>
                                No select
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
                        <div className={styles['notice']}>You can add an addon via an external link, which will appear under Installed addons.</div>
                        <TextInput
                            ref={addAddonUrlInputRef}
                            className={styles['addon-url-input']}
                            type={'text'}
                            placeholder={'Paste addon URL'}
                            onSubmit={addAddonOnSubmit}
                        />
                    </ModalDialog>
                    :
                    null
            }
            {
                sharedAddon !== null ?
                    <ModalDialog
                        className={styles['share-modal-container']}
                        title={'Share Addon'}
                        onCloseRequest={clearSharedAddon}>
                        <div className={styles['title-container']}>
                            <Image
                                className={styles['logo']}
                                src={sharedAddon.manifest.logo}
                                alt={' '}
                                renderFallback={renderLogoFallback}
                            />
                            <div className={styles['name-container']}>
                                <span className={styles['name']}>{typeof sharedAddon.manifest.name === 'string' && sharedAddon.manifest.name.length > 0 ? sharedAddon.manifest.name : sharedAddon.manifest.id}</span>
                                {
                                    typeof sharedAddon.manifest.version === 'string' && sharedAddon.manifest.version.length > 0 ?
                                        <span className={styles['version']}>v. {sharedAddon.manifest.version}</span>
                                        :
                                        null
                                }
                            </div>
                        </div>
                        <SharePrompt
                            className={styles['share-prompt-container']}
                            url={sharedAddon.transportUrl}
                        />
                    </ModalDialog>
                    :
                    null
            }
            {
                typeof detailsTransportUrl === 'string' ?
                    <AddonDetailsModal
                        transportUrl={detailsTransportUrl}
                        onCloseRequest={closeAddonDetails}
                    />
                    :
                    null
            }
        </MainNavBars>
    );
};

Addons.propTypes = {
    urlParams: PropTypes.shape({
        transportUrl: PropTypes.string,
        catalogId: PropTypes.string,
        type: PropTypes.string
    }),
    queryParams: PropTypes.instanceOf(URLSearchParams)
};

module.exports = Addons;
