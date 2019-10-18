const React = require('react');
const Icon = require('stremio-icons/dom');
const { Modal } = require('stremio-router');
const { Button, Multiselect, NavBar, TextInput } = require('stremio/common');
const Addon = require('./Addon');
const AddonPrompt = require('./AddonPrompt');
const useAddons = require('./useAddons');
const useSelectedAddon = require('./useSelectedAddon');
const styles = require('./styles');

const Addons = ({ urlParams, queryParams }) => {
    const [query, setQuery] = React.useState('');
    const queryOnChange = React.useCallback((event) => {
        setQuery(event.currentTarget.value);
    }, []);
    const [addons, dropdowns] = useAddons(urlParams.category, urlParams.type);
    const [selectedAddon, clearSelectedAddon] = useSelectedAddon(queryParams.get('addon'));
    const addonPromptModalBackgroundOnClick = React.useCallback((event) => {
        if (!event.nativeEvent.clearSelectedAddonPrevented) {
            clearSelectedAddon();
        }
    }, []);
    const addonPromptOnClick = React.useCallback((event) => {
        event.nativeEvent.clearSelectedAddonPrevented = true;
    }, []);
    return (
        <div className={styles['addons-container']}>
            <NavBar className={styles['nav-bar']} backButton={true} title={'Addons'} />
            <div className={styles['addons-content']}>
                <div className={styles['top-bar-container']}>
                    <Button className={styles['add-button-container']} title={'Add addon'}>
                        <Icon className={styles['icon']} icon={'ic_plus'} />
                        <div className={styles['add-button-label']}>Add addon</div>
                    </Button>
                    {dropdowns.map((dropdown, index) => (
                        <Multiselect {...dropdown} key={index} className={styles['dropdown']} />
                    ))}
                    <label className={styles['search-bar-container']}>
                        <Icon className={styles['icon']} icon={'ic_search'} />
                        <TextInput
                            className={styles['search-input']}
                            type={'text'}
                            placeholder={'Search addons...'}
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
                            .map((addon) => (
                                <Addon {...addon.manifest} key={addon.manifest.id} className={styles['addon']} />
                            ))
                    }
                </div>
                {
                    selectedAddon !== null ?
                        <Modal className={styles['addon-prompt-modal-container']} onClick={addonPromptModalBackgroundOnClick}>
                            <div className={styles['addon-prompt-container']} onClick={addonPromptOnClick}>
                                <AddonPrompt {...selectedAddon} className={styles['addon-prompt']} cancel={clearSelectedAddon} />
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
