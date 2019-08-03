const React = require('react');
const classnames = require('classnames');
const { MainNavBar, MetaItem, MetaPreview } = require('stremio/common');
const PickerMenu = require('./PickerMenu');
const useCatalog = require('./useCatalog');
const styles = require('./styles');

const Discover = ({ urlParams, queryParams }) => {
    const [pickers, metaItems] = useCatalog(urlParams, queryParams);
    const [selectedItem, setSelectedItem] = React.useState(metaItems[0]);
    const changeMetaItem = React.useCallback((event) => {
        const { id: metaItemId } = event.currentTarget.dataset;
        const metaItem = metaItems.find(({ id }) => id === metaItemId);
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
                        <MetaItem
                            {...metaItem}
                            key={metaItem.id}
                            className={classnames({ 'active': metaItem.id === selectedItem.id })}
                            onClick={changeMetaItem}
                        />
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
