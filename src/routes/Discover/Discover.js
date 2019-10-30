const React = require('react');
const classnames = require('classnames');
const Icon = require('stremio-icons/dom');
const { Button, MainNavBar, MetaItem, MetaPreview, Multiselect, PaginateInput } = require('stremio/common');
const useDiscover = require('./useDiscover');
const styles = require('./styles');

// TODO render only 4 pickers and a more button that opens a modal with all pickers
const Discover = ({ urlParams, queryParams }) => {
    const [selectInputs, paginateInput, metaItems, error] = useDiscover(urlParams, queryParams);
    const [selectedMetaItem, setSelectedMetaItem] = React.useState(null);
    const metaItemsOnMouseDownCapture = React.useCallback((event) => {
        event.nativeEvent.buttonBlurPrevented = true;
    }, []);
    const metaItemsOnFocusCapture = React.useCallback((event) => {
        const metaItem = metaItems.find(({ id }) => {
            return id === event.target.dataset.id;
        });
        if (metaItem) {
            setSelectedMetaItem(metaItem);
        }
    }, [metaItems]);
    React.useEffect(() => {
        const metaItem = Array.isArray(metaItems) && metaItems.length > 0 ? metaItems[0] : null;
        setSelectedMetaItem(metaItem);
    }, [metaItems]);
    return (
        <div className={styles['discover-container']}>
            <MainNavBar className={styles['nav-bar']} />
            <div className={styles['discover-content']}>
                <div className={styles['controls-container']}>
                    {selectInputs.map((selectInput, index) => (
                        <Multiselect
                            {...selectInput}
                            key={index}
                            className={styles['select-input-container']}
                        />
                    ))}
                    {/* <Button className={styles['filter-container']}>
                        <Icon className={styles['filter-icon']} icon={'ic_filter'} />
                    </Button> */}
                    <div className={styles['spacing']} />
                    {
                        paginateInput !== null ?
                            <PaginateInput
                                {...paginateInput}
                                className={styles['paginate-input-container']}
                            />
                            :
                            null
                    }
                </div>
                <div className={styles['catalog-content-container']}>
                    {
                        error ?
                            <div className={styles['message-container']}>
                                {error}
                            </div>
                            :
                            Array.isArray(metaItems) ?
                                metaItems.length > 0 ?
                                    <div className={styles['meta-items-container']} onMouseDownCapture={metaItemsOnMouseDownCapture} onFocusCapture={metaItemsOnFocusCapture}>
                                        {metaItems.map(({ id, type, name, poster, posterShape }, index) => (
                                            <MetaItem
                                                key={index}
                                                className={classnames(styles['meta-item'], { 'selected': selectedMetaItem !== null && selectedMetaItem.id === id })}
                                                type={type}
                                                name={name}
                                                poster={poster}
                                                posterShape={posterShape}
                                                data-id={id}
                                            />
                                        ))}
                                    </div>
                                    :
                                    <div className={styles['message-container']}>
                                        Empty catalog
                                    </div>
                                :
                                <div className={styles['message-container']}>
                                    Loading
                                </div>
                    }
                </div>
                {
                    selectedMetaItem !== null ?
                        <MetaPreview
                            {...selectedMetaItem}
                            className={styles['meta-preview-container']}
                            compact={true}
                        />
                        :
                        <div className={styles['meta-preview-container']} />
                }
            </div>
        </div>
    );
};

module.exports = Discover;
