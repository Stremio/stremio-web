const React = require('react');
const classnames = require('classnames');
const Icon = require('stremio-icons/dom');
const { Modal } = require('stremio-router');
const { Button, MainNavBar, MetaItem, MetaPreview, Multiselect, PaginationInput, useBinaryState } = require('stremio/common');
const useDiscover = require('./useDiscover');
const useSelectableInputs = require('./useSelectableInputs');
const styles = require('./styles');

const getMetaItemAtIndex = (catalog_resource, index) => {
    return index !== null &&
        isFinite(index) &&
        catalog_resource !== null &&
        catalog_resource.content.type === 'Ready' &&
        catalog_resource.content.content[index] ?
        catalog_resource.content.content[index]
        :
        null;
};

const Discover = ({ urlParams, queryParams }) => {
    const discover = useDiscover(urlParams, queryParams);
    const [selectInputs, paginationInput] = useSelectableInputs(discover);
    const [inputsModalOpen, openInputsModal, closeInputsModal] = useBinaryState(false);
    const [selectedMetaItem, setSelectedMetaItem] = React.useState(() => {
        return getMetaItemAtIndex(discover.catalog_resource, 0);
    });
    const metaItemsOnMouseDownCapture = React.useCallback((event) => {
        event.nativeEvent.buttonBlurPrevented = true;
    }, []);
    const metaItemsOnFocusCapture = React.useCallback((event) => {
        const metaItem = getMetaItemAtIndex(discover.catalog_resource, event.target.dataset.index);
        setSelectedMetaItem(metaItem);
    }, [discover.catalog_resource]);
    React.useLayoutEffect(() => {
        const metaItem = getMetaItemAtIndex(discover.catalog_resource, 0);
        setSelectedMetaItem(metaItem);
    }, [discover.catalog_resource]);
    React.useLayoutEffect(() => {
        closeInputsModal();
    }, [urlParams, queryParams]);
    return (
        <div className={styles['discover-container']}>
            <MainNavBar className={styles['nav-bar']} />
            <div className={styles['discover-content']}>
                <div className={styles['selectable-inputs-container']}>
                    {selectInputs.map((selectInput, index) => (
                        <Multiselect
                            {...selectInput}
                            key={index}
                            className={styles['select-input-container']}
                        />
                    ))}
                    <Button className={styles['filter-container']} title={'More filters'} onClick={openInputsModal}>
                        <Icon className={styles['filter-icon']} icon={'ic_filter'} />
                    </Button>
                    <div className={styles['spacing']} />
                    {
                        paginationInput !== null ?
                            <PaginationInput
                                {...paginationInput}
                                className={styles['pagination-input-container']}
                            />
                            :
                            null
                    }
                </div>
                <div className={styles['catalog-content-container']}>
                    {
                        discover.selectable.types.length === 0 && discover.catalog_resource === null ?
                            <div className={styles['message-container']}>
                                No catalogs
                            </div>
                            :
                            discover.catalog_resource === null ?
                                <div className={styles['message-container']}>
                                    No select
                                </div>
                                :
                                discover.catalog_resource.content.type === 'Err' ?
                                    <div className={styles['message-container']}>
                                        Catalog Error
                                    </div>
                                    :
                                    discover.catalog_resource.content.type === 'Loading' ?
                                        <div className={styles['message-container']}>
                                            Loading
                                        </div>
                                        :
                                        <div className={styles['meta-items-container']} onMouseDownCapture={metaItemsOnMouseDownCapture} onFocusCapture={metaItemsOnFocusCapture}>
                                            {discover.catalog_resource.content.content.map((metaItem, index) => (
                                                <MetaItem
                                                    {...metaItem}
                                                    key={index}
                                                    className={classnames(styles['meta-item'], { 'selected': selectedMetaItem === metaItem })}
                                                    data-index={index}
                                                />
                                            ))}
                                        </div>
                    }
                </div>
                {
                    selectedMetaItem !== null ?
                        <MetaPreview
                            {...selectedMetaItem}
                            className={styles['meta-preview-container']}
                            compact={true}
                            background={selectedMetaItem.poster}
                        />
                        :
                        <div className={styles['meta-preview-container']} />
                }
            </div>
            {/* {
                inputsModalOpen ?
                    <Modal />
                    :
                    null
            } */}
        </div>
    );
};

module.exports = Discover;
