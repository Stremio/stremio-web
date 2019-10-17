const React = require('react');
const classnames = require('classnames');
const { MainNavBar, MetaItem, MetaPreview, Multiselect } = require('stremio/common');
const useCatalog = require('./useCatalog');
const styles = require('./styles');

// TODO render only 4 pickers and a more button that opens a modal with all pickers
const Discover = ({ urlParams, queryParams }) => {
    const [dropdowns, metaItems] = useCatalog(urlParams, queryParams);
    const [selectedItem, setSelectedItem] = React.useState(null);
    const metaItemsOnMouseDown = React.useCallback((event) => {
        event.nativeEvent.buttonBlurPrevented = true;
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
                <div className={styles['dropdowns-container']}>
                    {dropdowns.map((dropdown, index) => (
                        <Multiselect {...dropdown} key={index} className={styles['dropdown']} />
                    ))}
                </div>
                <div className={styles['meta-items-container']} onFocusCapture={metaItemsOnFocus} onMouseDownCapture={metaItemsOnMouseDown}>
                    {metaItems.map((metaItem) => (
                        <MetaItem
                            {...metaItem}
                            key={metaItem.id}
                            className={classnames(styles['meta-item'], { 'selected': selectedItem !== null && metaItem.id === selectedItem.id })}
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
