const React = require('react');
const classnames = require('classnames');
const Icon = require('stremio-icons/dom');
const { Modal, useRouteFocused } = require('stremio-router');
const { Button, Multiselect, NavBar, TextInput, SharePrompt } = require('stremio/common');
const Addon = require('./Addon');
const AddonPrompt = require('./AddonPrompt');
const useAddons = require('./useAddons');
const useSelectedAddon = require('./useSelectedAddon');
const styles = require('./styles');

const Addons = ({ urlParams, queryParams }) => {
    const inputRef = React.useRef(null);
    const focusable = useRouteFocused();
    const [query, setQuery] = React.useState('');
    const queryOnChange = React.useCallback((event) => {
        setQuery(event.currentTarget.value);
    }, []);
    const [addons, dropdowns, setSelectedAddon, installSelectedAddon, uninstallSelectedAddon, installedAddons] = useAddons(urlParams, queryParams);
    const [addedAddon, setAddedAddon] = React.useState(false);
    const [selectedAddon, clearSelectedAddon] = useSelectedAddon(queryParams.get('addon'));
    const [sharedAddon, setSharedAddon] = React.useState(null);
    const onAddAddonButtonClicked = React.useCallback(() => {
        setAddedAddon(true);
    }, []);
    const onAddButtonClicked = React.useCallback(() => {
        if (inputRef.current.value.length > 0) {
            setSelectedAddon(inputRef.current.value);
            setAddedAddon(false);
        } else {
            alert('TODO: Error message');
        }
    }, [setSelectedAddon]);
    React.useEffect(() => {
        const onKeyUp = (event) => {
            if (event.key === 'Escape' && typeof close === 'function') {
                setAddedAddon(false);
            }
        };
        if (focusable) {
            window.addEventListener('keyup', onKeyUp);
        }
        return () => {
            window.removeEventListener('keyup', onKeyUp);
        };
    }, [close, focusable]);
    const promptModalBackgroundOnClick = React.useCallback((event) => {
        if (!event.nativeEvent.clearSelectedAddonPrevented) {
            clearSelectedAddon();
            setAddedAddon(false);
            setSharedAddon(null);
        }
    }, []);
    const promptOnClick = React.useCallback((event) => {
        event.nativeEvent.clearSelectedAddonPrevented = true;
    }, []);
    const setInstalledAddon = React.useCallback((currentAddon) => {
        return installedAddons.some((installedAddon) => installedAddon.manifest.id === currentAddon.manifest.id &&
            installedAddon.transportUrl === currentAddon.transportUrl);
    }, [installedAddons]);
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
                        addons.filter((addon) => query.length === 0 ||
                            ((typeof addon.manifest.name === 'string' && addon.manifest.name.toLowerCase().includes(query.toLowerCase())) ||
                                (typeof addon.manifest.description === 'string' && addon.manifest.description.toLowerCase().includes(query.toLowerCase()))
                            ))
                            .map((addon, index) => (
                                <Addon
                                    {...addon.manifest}
                                    key={index}
                                    installed={setInstalledAddon(addon)}
                                    isProtected={addon.flags && addon.flags.protected}
                                    className={styles['addon']}
                                    toggle={() => setSelectedAddon(addon.transportUrl)}
                                    onShareButtonClicked={() => setSharedAddon(addon)}
                                />
                            ))
                    }
                </div>
                {
                    addedAddon ?
                        <Modal className={styles['prompt-modal-container']} onClick={promptModalBackgroundOnClick}>
                            <div className={classnames(styles['prompt-container'], styles['add-addon-prompt-container'])}>
                                <div className={classnames(styles['prompt'], styles['add-addon-prompt'])} onClick={promptOnClick}>
                                    <Button className={styles['close-button-container']} title={'Close'} tabIndex={-1} onClick={() => setAddedAddon(false)}>
                                        <Icon className={styles['icon']} icon={'ic_x'} />
                                    </Button>
                                    <div className={styles['add-addon-prompt-content']}>
                                        <div className={styles['add-addon-prompt-label']}>Add add-on</div>
                                        <TextInput ref={inputRef} className={styles['url-content']} type={'text'} tabIndex={'-1'} placeholder={'Paste url...'} />
                                        <div className={styles['buttons-container']}>
                                            <Button className={classnames(styles['button-container'], styles['cancel-button'])} title={'Cancel'} onClick={() => setAddedAddon(false)}>
                                                <div className={styles['label']}>Cancel</div>
                                            </Button>
                                            <Button className={classnames(styles['button-container'], styles['add-button'])} title={'Add'} onClick={onAddButtonClicked}>
                                                <div className={styles['label']}>Add</div>
                                            </Button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </Modal>
                        :
                        null
                }
                {
                    selectedAddon !== null ?
                        <Modal className={styles['prompt-modal-container']} onClick={promptModalBackgroundOnClick}>
                            <div className={classnames(styles['prompt-container'], styles['addon-prompt-container'])}>
                                <AddonPrompt
                                    {...selectedAddon.manifest}
                                    transportUrl={selectedAddon.transportUrl}
                                    installed={setInstalledAddon(selectedAddon)}
                                    official={selectedAddon.flags.official}
                                    className={styles['prompt']}
                                    cancel={clearSelectedAddon}
                                    onClick={promptOnClick}
                                    toggle={() => setInstalledAddon(selectedAddon) ? uninstallSelectedAddon(selectedAddon) : installSelectedAddon(selectedAddon)}
                                />
                            </div>
                        </Modal>
                        :
                        null
                }
                {
                    sharedAddon !== null ?
                        <Modal className={styles['prompt-modal-container']} onClick={promptModalBackgroundOnClick}>
                            <div className={classnames(styles['prompt-container'], styles['share-prompt-container'])}>
                                <SharePrompt
                                    label={'Share add-on'}
                                    url={sharedAddon.transportUrl}
                                    className={styles['prompt']}
                                    close={() => setSharedAddon(null)}
                                    onClick={promptOnClick}
                                />
                            </div>
                        </Modal>
                        :
                        null
                }
            </div>
        </div>
    );
};

module.exports = Addons;
