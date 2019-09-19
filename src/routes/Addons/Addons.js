const React = require('react');
const Icon = require('stremio-icons/dom');
const { Button, Dropdown, NavBar, TextInput } = require('stremio/common');
const Addon = require('./Addon');
const useAddons = require('./useAddons');
const styles = require('./styles');

const Addons = ({ urlParams }) => {
    const [query, setQuery] = React.useState('');
    const queryOnChange = React.useCallback((event) => {
        setQuery(event.currentTarget.value);
    }, []);
    const [addons, dropdowns] = useAddons(urlParams.category, urlParams.type);
    return (
        <div className={styles['addons-container']}>
            <NavBar className={styles['nav-bar']} backButton={true} title={'Addons'} />
            <div className={styles['addons-content']}>
                <div className={styles['top-bar-container']}>
                    <Button className={styles['add-button-container']} title={'Add addon'}>
                        <Icon className={styles['icon']} icon={'ic_plus'} />
                        <div className={styles['add-button-label']}>Add addon</div>
                    </Button>
                    {dropdowns.map((dropdown) => (
                        <Dropdown {...dropdown} key={dropdown.name} className={styles['dropdown']} />
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
                <div className={styles['addons-list-container']} >
                    {addons.map((addon) => (
                        <Addon {...addon} key={addon.id} className={styles['addon']} />
                    ))}
                </div>
            </div>
        </div>
    );
};

module.exports = Addons;
