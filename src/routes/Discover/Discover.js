const React = require('react');
const { MainNavBar, MetaItem, MetaPreview } = require('stremio-common');
const PickerMenu = require('./PickerMenu');
const useCatalog = require('./useCatalog');
const styles = require('./styles');

// TODO impl refocus to left of the scroll view
const Discover = ({ urlParams, queryParams }) => {
    const [pickers, metaItems] = useCatalog(urlParams, queryParams);
    const [selectedItem, setSelectedItem] = React.useState(metaItems[0]);
    const changeMetaItem = React.useCallback((event) => {
        const metaItem = metaItems.find(({ id }) => id === event.currentTarget.dataset.metaItemId);
        setSelectedItem(metaItem);
    }, [metaItems]);
    return (
        <div className={styles['discover-container']}>
            <MainNavBar className={styles['nav-bar']} />
            <div className={styles['discover-content']}>
                <div className={styles['pickers-container']}>
                    {pickers.map((picker) => (
                        <PickerMenu {...picker} key={picker.name} />
                    ))}
                </div>
                <div className={styles['meta-items-container']} tabIndex={-1}>
                    {metaItems.map((metaItem) => (
                        <div key={metaItem.id} className={styles['meta-item-container']}>
                            <MetaItem
                                {...metaItem}
                                className={styles['meta-item']}
                                onClick={changeMetaItem}
                            />
                        </div>
                    ))}
                </div>
                {
                    selectedItem ?
                        <MetaPreview
                            className={styles['meta-preview-container']}
                            compact={true}
                            {...selectedItem}
                        />
                        :
                        null
                }
            </div>
        </div>
    );
};

module.exports = Discover;
