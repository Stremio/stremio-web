const React = require('react');
const Icon = require('stremio-icons/dom');
const { Button, Multiselect, NavBar, TextInput, SharePrompt, ModalDialog } = require('stremio/common');
const Addon = require('./Addon');
const AddonPrompt = require('./AddonPrompt');
const useAddons = require('./useAddons');
const useSelectedAddon = require('./useSelectedAddon');
const styles = require('./styles');

const Addons = ({ urlParams, queryParams }) => {
    const inputRef = React.useRef(null);
    const [query, setQuery] = React.useState('');
    const queryOnChange = React.useCallback((event) => {
        setQuery(event.currentTarget.value);
    }, []);
    const [[addons, dropdowns, setSelectedAddon, installedAddons, error], installSelectedAddon, uninstallSelectedAddon] = useAddons(urlParams, queryParams);
    const [addAddonModalOpened, setAddAddonModalOpened] = React.useState(false);
    const [selectedAddon, clearSelectedAddon] = useSelectedAddon(queryParams.get('addon'));
    const [sharedAddon, setSharedAddon] = React.useState(null);
    const onAddAddonButtonClicked = React.useCallback(() => {
        setAddAddonModalOpened(true);
    }, []);
    const onAddButtonClicked = React.useCallback(() => {
        if (inputRef.current.value.length > 0) {
            setSelectedAddon(inputRef.current.value);
            setAddAddonModalOpened(false);
        }
    }, [setSelectedAddon]);
    const setInstalledAddon = React.useCallback((currentAddon) => {
        return installedAddons.some((installedAddon) => installedAddon.transportUrl === currentAddon.transportUrl);
    }, [installedAddons]);
    const toggleAddon = React.useCallback(() => {
        setInstalledAddon(selectedAddon) ? uninstallSelectedAddon(selectedAddon) : installSelectedAddon(selectedAddon);
        clearSelectedAddon();
    });
    return (
        <div className={styles['addons-container']}>
            <NavBar className={styles['nav-bar']} backButton={true} title={'Add-ons'} />
            <div className={styles['addons-content']}>
                <div className={styles['top-bar-container']}>
                    <Button className={styles['add-button-container']} title={'Add add-on'} onClick={onAddAddonButtonClicked}>
                        <Icon className={styles['icon']} icon={'ic_plus'} />
                        <div className={styles['add-button-label']}>Add add-on</div>
                    </Button>
                    {dropdowns.map((dropdown, index) => (
                        <Multiselect {...dropdown} key={index} className={styles['dropdown']} />
                    ))}
                    <label className={styles['search-bar-container']}>
                        <Icon className={styles['icon']} icon={'ic_search'} />
                        <TextInput
                            className={styles['search-input']}
                            type={'text'}
                            placeholder={'Search add-ons...'}
                            value={query}
                            onChange={queryOnChange}
                        />
                    </label>
                </div>
                <div className={styles['addons-list-container']}>
                    {
                        error !== null ?
                            <div className={styles['message-container']}>
                                {error.type}{error.type === 'Other' ? ` - ${error.content}` : null}
                            </div>
                            :
                            Array.isArray(addons) ?
                                addons.filter((addon) => query.length === 0 ||
                                    ((typeof addon.manifest.name === 'string' && addon.manifest.name.toLowerCase().includes(query.toLowerCase())) ||
                                        (typeof addon.manifest.description === 'string' && addon.manifest.description.toLowerCase().includes(query.toLowerCase()))
                                    ))
                                    .map((addon, index) => (
                                        <Addon
                                            {...addon.manifest}
                                            key={index}
                                            installed={setInstalledAddon(addon)}
                                            className={styles['addon']}
                                            toggle={() => setSelectedAddon(addon.transportUrl)}
                                            onShareButtonClicked={() => setSharedAddon(addon)}
                                        />
                                    ))
                                :
                                <div className={styles['message-container']}>
                                    Loading
                                </div>
                    }
                </div>
                {
                    addAddonModalOpened ?
                        <ModalDialog
                            className={styles['add-addon-prompt-container']}
                            title={'Add add-on'}
                            buttons={[
                                {
                                    label: 'Cancel',
                                    className: styles['cancel-button'],
                                    props: {
                                        title: 'Cancel',
                                        onClick: () => setAddAddonModalOpened(false)
                                    }
                                },
                                {
                                    label: 'Add',
                                    props: {
                                        title: 'Add',
                                        onClick: onAddButtonClicked
                                    }
                                }
                            ]}
                            onCloseRequest={() => setAddAddonModalOpened(false)}
                        >
                            <TextInput ref={inputRef} className={styles['url-content']} type={'text'} tabIndex={'-1'} placeholder={'Paste url...'} />
                        </ModalDialog>
                        :
                        null
                }
                {
                    selectedAddon !== null ?
                        <ModalDialog
                            className={styles['addon-prompt-container']}
                            buttons={[
                                {
                                    label: 'Cancel',
                                    className: styles['cancel-button'],
                                    props: {
                                        title: 'Cancel',
                                        onClick: clearSelectedAddon
                                    }
                                },
                                {
                                    label: setInstalledAddon(selectedAddon) ? 'Uninstall' : 'Install',
                                    props: {
                                        title: setInstalledAddon(selectedAddon) ? 'Uninstall' : 'Install',
                                        onClick: toggleAddon
                                    }
                                }
                            ]}
                            onCloseRequest={clearSelectedAddon}
                        >
                            <AddonPrompt
                                {...selectedAddon.manifest}
                                transportUrl={selectedAddon.transportUrl}
                                installed={setInstalledAddon(selectedAddon)}
                                official={selectedAddon.flags.official}
                                className={styles['prompt']}
                                cancel={clearSelectedAddon}
                            />
                        </ModalDialog>
                        :
                        null
                }
                {
                    sharedAddon !== null ?
                        <ModalDialog className={styles['share-prompt-container']} title={'Share add-on'} onCloseRequest={() => setSharedAddon(null)}>
                            <SharePrompt
                                url={sharedAddon.transportUrl}
                                className={styles['prompt']}
                                close={() => setSharedAddon(null)}
                            />
                        </ModalDialog>
                        :
                        null
                }
            </div>
        </div>
    );
};

module.exports = Addons;
