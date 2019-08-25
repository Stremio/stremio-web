const React = require('react');
const classnames = require('classnames');
const { MainNavBar, MetaItem, MetaPreview } = require('stremio/common');
const PickerMenu = require('./PickerMenu');
const useCatalog = require('./useCatalog');
const styles = require('./styles');

const Discover = ({ urlParams, queryParams }) => {
    const [pickers, metaItems] = useCatalog(urlParams, queryParams);
    const [selectedItem, setSelectedItem] = React.useState(null);
    const metaItemsOnMouseDown = React.useCallback((event) => {
        event.nativeEvent.blurPrevented = true;
    }, []);
    const metaItemsOnFocus = React.useCallback((event) => {
        const metaItem = metaItems.find(({ id }) => {
            return id === event.target.dataset.id;
        });
        if (metaItem) {
            setSelectedItem(metaItem);
        }
    }, []);
    React.useEffect(() => {
        const metaItem = metaItems.length > 0 ? metaItems[0] : null;
        setSelectedItem(metaItem);
    }, [metaItems]);
    return (
        <div className={styles['discover-container']}>
            <MainNavBar className={styles['nav-bar']} />
            <div className={styles['discover-content']}>
                <div className={styles['pickers-container']}>
                    {pickers.map((picker) => (
                        <PickerMenu {...picker} key={picker.name} className={'picker'} />
                    ))}
                </div>
                <div className={styles['meta-items-container']} tabIndex={-1} onFocusCapture={metaItemsOnFocus} onMouseDownCapture={metaItemsOnMouseDown}>
                    {metaItems.map((metaItem) => (
                        <MetaItem
                            {...metaItem}
                            key={metaItem.id}
                            className={classnames('meta-item', { 'selected': selectedItem !== null && metaItem.id === selectedItem.id })}
                        />
                    ))}
                </div>
                {
                    selectedItem !== null ?
                        <MetaPreview
                            {...selectedItem}
                            className={styles['meta-preview-container']}
                            compact={true}
                        />
                        :
                        null
                }
            </div>
        </div>
    );
};

module.exports = Discover;
