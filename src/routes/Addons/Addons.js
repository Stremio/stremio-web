// Copyright (C) 2017-2023 Smart code 203358507

const React = require('react');
const PropTypes = require('prop-types');
const classnames = require('classnames');
const { useTranslation } = require('react-i18next');
const { default: Icon } = require('@stremio/stremio-icons/react');
const { useCore } = require('stremio/core');
const { usePlatform, useBinaryState, useProfile, withCoreSuspender } = require('stremio/common');
const { AddonDetailsModal, Button, Image, MainNavBars, ModalDialog, SearchBar, SharePrompt, TextInput, MultiselectMenu } = require('stremio/components');
const useToast = require('stremio/common/Toast/useToast');
const Addon = require('./Addon');
const useInstalledAddons = require('./useInstalledAddons');
const useRemoteAddons = require('./useRemoteAddons');
const useAddonDetailsTransportUrl = require('./useAddonDetailsTransportUrl');
const useSelectableInputs = require('./useSelectableInputs');
const styles = require('./styles');
const { AddonPlaceholder } = require('./AddonPlaceholder');

const STREMIO_API_URL = 'https://api.strem.io';

const Addons = ({ urlParams, queryParams }) => {
    const { t } = useTranslation();
    const platform = usePlatform();
    const core = useCore();
    const toast = useToast();
    const profile = useProfile();
    const installedAddons = useInstalledAddons(urlParams);
    const remoteAddons = useRemoteAddons(urlParams);
    const [addonDetailsTransportUrl, setAddonDetailsTransportUrl] = useAddonDetailsTransportUrl(urlParams, queryParams);
    const selectInputs = useSelectableInputs(installedAddons, remoteAddons);
    const [filtersModalOpen, openFiltersModal, closeFiltersModal] = useBinaryState(false);
    const [addAddonModalOpen, openAddAddonModal, closeAddAddonModal] = useBinaryState(false);
    const addAddonUrlInputRef = React.useRef(null);
    const addAddonOnSubmit = React.useCallback(() => {
        if (addAddonUrlInputRef.current !== null) {
            try {
                let url = new URL(addAddonUrlInputRef.current.value).toString();
                setAddonDetailsTransportUrl(url);
            } catch (e) {
                toast.show({
                    type: 'error',
                    title: `Failed to parse addon url: ${addAddonUrlInputRef.current.value}`,
                    timeout: 10000
                });
                console.error('Failed to parse addon url:', e);
            }
        }
    }, [setAddonDetailsTransportUrl]);
    const addAddonModalButtons = React.useMemo(() => {
        return [
            {
                className: styles['cancel-button'],
                label: t('BUTTON_CANCEL'),
                props: {
                    onClick: closeAddAddonModal
                }
            },
            {
                label: t('ADDON_ADD'),
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
    const clearSharedAddon = React.useCallback(() => {
        setSharedAddon(null);
    }, []);
    const onAddonShare = React.useCallback((event) => {
        setSharedAddon(event.dataset.addon);
    }, []);
    const onAddonInstall = React.useCallback((event) => {
        core.transport.dispatch({
            action: 'Ctx',
            args: {
                action: 'InstallAddon',
                args: event.dataset.addon,
            }
        });
    }, []);
    const onAddonUninstall = React.useCallback((event) => {
        core.transport.dispatch({
            action: 'Ctx',
            args: {
                action: 'UninstallAddon',
                args: event.dataset.addon,
            }
        });
    }, []);
    const onAddonConfigure = React.useCallback((event) => {
        platform.openExternal(event.dataset.addon.transportUrl.replace('manifest.json', 'configure'));
    }, []);
    const onAddonOpen = React.useCallback((event) => {
        setAddonDetailsTransportUrl(event.dataset.addon.transportUrl);
    }, [setAddonDetailsTransportUrl]);
    const closeAddonDetails = React.useCallback(() => {
        setAddonDetailsTransportUrl(null);
    }, [setAddonDetailsTransportUrl]);
    const [reorderedCatalog, setReorderedCatalog] = React.useState(null);
    const pendingOrderRef = React.useRef(null);
    const pushTimerRef = React.useRef(null);
    const latestOrderRef = React.useRef(null);
    React.useEffect(() => {
        if (pendingOrderRef.current === null) {
            setReorderedCatalog(null);
            return;
        }
        const current = installedAddons.catalog.map((a) => a.transportUrl);
        const pending = pendingOrderRef.current;
        if (current.length === pending.length && current.every((u, i) => u === pending[i])) {
            pendingOrderRef.current = null;
            setReorderedCatalog(null);
        }
    }, [installedAddons.catalog]);
    React.useEffect(() => () => {
        if (pushTimerRef.current) clearTimeout(pushTimerRef.current);
    }, []);
    const isInstalledView = installedAddons.selected !== null;
    const canReorder = isInstalledView
        && profile?.auth?.key
        && (!installedAddons.selected.request || installedAddons.selected.request.type === null)
        && search.length === 0;
    const displayedCatalog = (canReorder && reorderedCatalog) ? reorderedCatalog : installedAddons.catalog;
    const doPush = React.useCallback(async (addons) => {
        const authKey = profile?.auth?.key;
        if (!authKey) {
            pendingOrderRef.current = null;
            setReorderedCatalog(null);
            return;
        }
        const payload = addons.map((a) => ({
            manifest: a.manifest,
            transportUrl: a.transportUrl,
            flags: a.flags || { official: false, protected: false },
        }));
        try {
            const res = await fetch(`${STREMIO_API_URL}/api/addonCollectionSet`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ type: 'AddonCollectionSet', authKey, addons: payload }),
            }).then((r) => r.json());
            if (res?.error) {
                toast.show({ type: 'error', title: `Failed to save addon order: ${res.error.message || res.error}`, timeout: 8000 });
                pendingOrderRef.current = null;
                setReorderedCatalog(null);
                return;
            }
        } catch (err) {
            toast.show({ type: 'error', title: `Failed to save addon order: ${err?.message || err}`, timeout: 8000 });
            pendingOrderRef.current = null;
            setReorderedCatalog(null);
            return;
        }
        core.transport.dispatch({ action: 'Ctx', args: { action: 'PullAddonsFromAPI' } });
    }, [profile, core, toast]);
    const schedulePush = React.useCallback((addons) => {
        latestOrderRef.current = addons;
        pendingOrderRef.current = addons.map((a) => a.transportUrl);
        if (pushTimerRef.current) clearTimeout(pushTimerRef.current);
        pushTimerRef.current = setTimeout(() => {
            pushTimerRef.current = null;
            doPush(latestOrderRef.current);
        }, 300);
    }, [doPush]);
    const swapAt = React.useCallback((url, direction) => {
        const base = (reorderedCatalog || installedAddons.catalog).slice();
        const idx = base.findIndex((a) => a.transportUrl === url);
        if (idx < 0) return;
        const swapIdx = direction === 'up' ? idx - 1 : idx + 1;
        if (swapIdx < 0 || swapIdx >= base.length) return;
        if (base[idx].flags?.protected || base[swapIdx].flags?.protected) return;
        [base[idx], base[swapIdx]] = [base[swapIdx], base[idx]];
        setReorderedCatalog(base);
        schedulePush(base);
    }, [reorderedCatalog, installedAddons.catalog, schedulePush]);
    const onAddonMoveUp = React.useCallback(({ dataset }) => {
        swapAt(dataset.addon.transportUrl, 'up');
    }, [swapAt]);
    const onAddonMoveDown = React.useCallback(({ dataset }) => {
        swapAt(dataset.addon.transportUrl, 'down');
    }, [swapAt]);
    const searchFilterPredicate = React.useCallback((addon) => {
        return search.length === 0 ||
            (
                (typeof addon.manifest.name === 'string' && addon.manifest.name.toLowerCase().includes(search.toLowerCase())) ||
                (typeof addon.manifest.description === 'string' && addon.manifest.description.toLowerCase().includes(search.toLowerCase()))
            );
    }, [search]);
    const renderLogoFallback = React.useCallback(() => (
        <Icon className={styles['icon']} name={'addons'} />
    ), []);
    React.useLayoutEffect(() => {
        closeAddAddonModal();
        setSearch('');
        clearSharedAddon();
        pendingOrderRef.current = null;
        setReorderedCatalog(null);
    }, [urlParams, queryParams]);
    return (
        <MainNavBars className={styles['addons-container']} route={'addons'}>
            <div className={styles['addons-content']}>
                <div className={styles['selectable-inputs-container']}>
                    {selectInputs.map((selectInput, index) => (
                        <MultiselectMenu
                            {...selectInput}
                            key={index}
                            className={styles['select-input-container']}
                        />
                    ))}
                    <div className={styles['spacing']} />
                    <Button className={styles['add-button-container']} title={t('ADD_ADDON')} onClick={openAddAddonModal}>
                        <Icon className={styles['icon']} name={'add'} />
                        <div className={styles['add-button-label']}>{t('ADD_ADDON')}</div>
                    </Button>
                    <SearchBar
                        className={styles['search-bar']}
                        title={t('ADDON_SEARCH')}
                        value={search}
                        onChange={searchInputOnChange}
                    />
                    <Button className={styles['filter-button']} title={t('ALL_FILTERS')} onClick={openFiltersModal}>
                        <Icon className={styles['filter-icon']} name={'filters'} />
                    </Button>
                </div>
                {
                    installedAddons.selected !== null ?
                        installedAddons.selectable.types.length === 0 ?
                            <div className={styles['message-container']}>
                                {t('NO_ADDONS')}
                            </div>
                            :
                            installedAddons.catalog.length === 0 ?
                                <div className={styles['message-container']}>
                                    {t('NO_ADDONS_FOR_TYPE')}
                                </div>
                                :
                                <div className={styles['addons-list-container']}>
                                    {
                                        displayedCatalog
                                            .filter(searchFilterPredicate)
                                            .map((addon, index, arr) => {
                                                const isProtected = !!addon.flags?.protected;
                                                const prev = arr[index - 1];
                                                const next = arr[index + 1];
                                                const canMoveUp = canReorder && !isProtected && prev && !prev.flags?.protected;
                                                const canMoveDown = canReorder && !isProtected && !!next && !next.flags?.protected;
                                                return (
                                                    <Addon
                                                        key={addon.transportUrl || index}
                                                        className={classnames(styles['addon'], 'animation-fade-in')}
                                                        id={addon.manifest.id}
                                                        name={addon.manifest.name}
                                                        version={addon.manifest.version}
                                                        logo={addon.manifest.logo}
                                                        description={addon.manifest.description}
                                                        types={addon.manifest.types}
                                                        behaviorHints={addon.manifest.behaviorHints}
                                                        installed={addon.installed}
                                                        onInstall={onAddonInstall}
                                                        onUninstall={onAddonUninstall}
                                                        onConfigure={onAddonConfigure}
                                                        onOpen={onAddonOpen}
                                                        onShare={onAddonShare}
                                                        dataset={{ addon }}
                                                        reorderable={canReorder}
                                                        canMoveUp={canMoveUp}
                                                        canMoveDown={canMoveDown}
                                                        onMoveUp={onAddonMoveUp}
                                                        onMoveDown={onAddonMoveDown}
                                                    />
                                                );
                                            })
                                    }
                                </div>
                        :
                        remoteAddons.selected !== null ?
                            remoteAddons.catalog.content.type === 'Err' ?
                                <div className={styles['message-container']}>
                                    {remoteAddons.catalog.content.content}
                                </div>
                                :
                                remoteAddons.catalog.content.type === 'Loading' ?
                                    <div className={styles['addons-list-container']}>
                                        {Array.from({ length: 6 }).map((_, index) => (
                                            <AddonPlaceholder key={index} className={styles['addon']} />
                                        ))}
                                    </div>
                                    :
                                    <div className={styles['addons-list-container']}>
                                        {
                                            remoteAddons.catalog.content.content
                                                .filter(searchFilterPredicate)
                                                .map((addon, index) => (
                                                    <Addon
                                                        key={index}
                                                        className={classnames(styles['addon'], 'animation-fade-in')}
                                                        id={addon.manifest.id}
                                                        name={addon.manifest.name}
                                                        version={addon.manifest.version}
                                                        logo={addon.manifest.logo}
                                                        description={addon.manifest.description}
                                                        types={addon.manifest.types}
                                                        behaviorHints={addon.manifest.behaviorHints}
                                                        installed={addon.installed}
                                                        onInstall={onAddonInstall}
                                                        onUninstall={onAddonUninstall}
                                                        onConfigure={onAddonConfigure}
                                                        onOpen={onAddonOpen}
                                                        onShare={onAddonShare}
                                                        dataset={{ addon }}
                                                    />
                                                ))
                                        }
                                    </div>
                            :
                            <div className={styles['addons-list-container']}>
                                {Array.from({ length: 6 }).map((_, index) => (
                                    <AddonPlaceholder key={index} className={styles['addon']} />
                                ))}
                            </div>
                }
            </div>
            {
                filtersModalOpen ?
                    <ModalDialog title={t('ADDONS_FILTERS')} className={styles['filters-modal']} onCloseRequest={closeFiltersModal}>
                        {selectInputs.map((selectInput, index) => (
                            <MultiselectMenu
                                {...selectInput}
                                key={index}
                                className={styles['select-input-container']}
                            />
                        ))}
                    </ModalDialog>
                    :
                    null
            }
            {
                addAddonModalOpen ?
                    <ModalDialog
                        className={styles['add-addon-modal-container']}
                        title={t('ADD_ADDON')}
                        buttons={addAddonModalButtons}
                        onCloseRequest={closeAddAddonModal}>
                        <div className={styles['notice']}>{t('ADD_ADDON_DESCRIPTION')}</div>
                        <TextInput
                            ref={addAddonUrlInputRef}
                            className={styles['addon-url-input']}
                            type={'text'}
                            placeholder={t('PASTE_ADDON_URL')}
                            autoFocus={true}
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
                        title={t('SHARE_ADDON')}
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
                                        <span className={styles['version']}>{t('ADDON_VERSION_SHORT', { version: sharedAddon.manifest.version })}</span>
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
                typeof addonDetailsTransportUrl === 'string' ?
                    <AddonDetailsModal
                        transportUrl={addonDetailsTransportUrl}
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
        path: PropTypes.string,
        transportUrl: PropTypes.string,
        catalogId: PropTypes.string,
        type: PropTypes.string
    }),
    queryParams: PropTypes.instanceOf(URLSearchParams)
};

const AddonsFallback = () => (
    <MainNavBars className={styles['addons-container']} route={'addons'} />
);

module.exports = withCoreSuspender(Addons, AddonsFallback);