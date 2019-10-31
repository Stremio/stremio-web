const React = require('react');
const classnames = require('classnames');
const Icon = require('stremio-icons/dom');
const { Modal } = require('stremio-router');
const { Button, MainNavBar, MetaItem, MetaPreview, Multiselect, PaginateInput, useBinaryState } = require('stremio/common');
const useDiscover = require('./useDiscover');
const styles = require('./styles');

const Discover = ({ urlParams, queryParams }) => {
    const [selectInputs, paginateInput, metaItems, error] = useDiscover(urlParams, queryParams);
    const [selectedMetaItem, setSelectedMetaItem] = React.useState(null);
    const [filtersModalOpen, openFiltersModal, closeFiltersModal] = useBinaryState(false);
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
    React.useEffect(() => {
        closeFiltersModal();
    }, [urlParams, queryParams]);
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
                    <Button className={styles['filter-container']} onClick={openFiltersModal}>
                        <Icon className={styles['filter-icon']} icon={'ic_filter'} />
                    </Button>
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
                        error !== null ?
                            <div className={styles['message-container']}>
                                {error.type}{error.type === 'Other' ? ` - ${error.content}` : null}
                            </div>
                            :
                            Array.isArray(metaItems) ?
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
            {
                filtersModalOpen ?
                    <Modal>
                        {/* TODO */}
                    </Modal>
                    :
                    null
            }
        </div>
    );
};

module.exports = Discover;
