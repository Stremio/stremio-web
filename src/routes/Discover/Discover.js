const React = require('react');
const PropTypes = require('prop-types');
const classnames = require('classnames');
const Icon = require('stremio-icons/dom');
const { AddonDetailsModal, Button, MainNavBars, MetaItem, MetaPreview, Multiselect, ModalDialog, PaginationInput, useBinaryState } = require('stremio/common');
const { useServices } = require('stremio/services');
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
    const { core } = useServices();
    const state = core.getState();
    const discover = useDiscover(urlParams, queryParams);
    const [selectInputs, paginationInput] = useSelectableInputs(discover);
    const [inputsModalOpen, openInputsModal, closeInputsModal] = useBinaryState(false);
    const [addonModalOpen, openAddonModal, closeAddonModal] = useBinaryState(false);
    const [selectedMetaItem, setSelectedMetaItem] = React.useState(() => {
        return getMetaItemAtIndex(discover.catalog_resource, 0);
    });
    const metaItemsOnFocusCapture = React.useCallback((event) => {
        const metaItem = getMetaItemAtIndex(discover.catalog_resource, event.target.dataset.index);
        setSelectedMetaItem(metaItem);
    }, [discover.catalog_resource]);
    const metaItemOnClick = React.useCallback((event) => {
        const metaItem = getMetaItemAtIndex(discover.catalog_resource, event.currentTarget.dataset.index);
        if (metaItem !== selectedMetaItem) {
            event.preventDefault();
            event.currentTarget.focus();
        }
    }, [discover.catalog_resource, selectedMetaItem]);
    React.useLayoutEffect(() => {
        const metaItem = getMetaItemAtIndex(discover.catalog_resource, 0);
        setSelectedMetaItem(metaItem);
    }, [discover.catalog_resource]);
    React.useLayoutEffect(() => {
        closeInputsModal();
    }, [urlParams, queryParams]);
    return (
        <MainNavBars className={styles['discover-container']} route={'discover'}>
            <div className={styles['discover-content']}>
                <div className={styles['selectable-inputs-container']}>
                    {selectInputs.map(({ title, options, selected, renderLabelText, onSelect }, index) => (
                        <Multiselect
                            key={index}
                            className={styles['select-input-container']}
                            title={title}
                            options={options}
                            selected={selected}
                            renderLabelText={renderLabelText}
                            onSelect={onSelect}
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
                {
                    discover.catalog_resource !== null && !state.ctx.profile.addons.some((addon) => addon.transportUrl === discover.catalog_resource.request.base) ?
                        <div className={styles['missing-addon-warning-container']}>
                            <div className={styles['warning-info']}>This addon is not installed. Install now?</div>
                            <Button className={styles['install-button']} title={'Install addon'} onClick={openAddonModal}>
                                <div className={styles['label']}>Install</div>
                            </Button>
                        </div>
                        :
                        null
                }
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
                                        <div className={styles['meta-items-container']} onFocusCapture={metaItemsOnFocusCapture}>
                                            {discover.catalog_resource.content.content.map((metaItem, index) => (
                                                <MetaItem
                                                    key={index}
                                                    className={classnames(styles['meta-item'], { 'selected': selectedMetaItem === metaItem })}
                                                    type={metaItem.type}
                                                    name={metaItem.name}
                                                    poster={metaItem.poster}
                                                    posterShape={metaItem.posterShape}
                                                    playIcon={selectedMetaItem === metaItem}
                                                    href={metaItem.href}
                                                    data-index={index}
                                                    onClick={metaItemOnClick}
                                                />
                                            ))}
                                        </div>
                    }
                </div>
                {
                    selectedMetaItem !== null ?
                        <MetaPreview
                            className={styles['meta-preview-container']}
                            compact={true}
                            name={selectedMetaItem.name}
                            logo={selectedMetaItem.logo}
                            background={selectedMetaItem.poster}
                            runtime={selectedMetaItem.runtime}
                            releaseInfo={selectedMetaItem.releaseInfo}
                            released={selectedMetaItem.released}
                            description={selectedMetaItem.description}
                            trailer={selectedMetaItem.trailer}
                        />
                        :
                        <div className={styles['meta-preview-container']} />
                }
            </div>
            {
                inputsModalOpen ?
                    <ModalDialog title={'Catalog filters'} className={styles['selectable-inputs-modal-container']} onCloseRequest={closeInputsModal}>
                        {selectInputs.map(({ title, isRequired, options, selected, renderLabelText, onSelect }, index) => (
                            <div key={index} className={styles['selectable-inputs-container']}>
                                <div className={styles['select-input-label-container']} title={title}>
                                    {title}
                                    {isRequired ? '*' : null}
                                </div>
                                <Multiselect
                                    className={styles['select-input-container']}
                                    mode={'modal'}
                                    title={title}
                                    options={options}
                                    selected={selected}
                                    renderLabelText={renderLabelText}
                                    onSelect={onSelect}
                                />
                            </div>
                        ))}
                    </ModalDialog>
                    :
                    null
            }
            {
                addonModalOpen ?
                    <AddonDetailsModal
                        transportUrl={discover.catalog_resource.request.base}
                        onCloseRequest={closeAddonModal}
                    />
                    :
                    null
            }
        </MainNavBars>
    );
};

Discover.propTypes = {
    urlParams: PropTypes.exact({
        transportUrl: PropTypes.string,
        type: PropTypes.string,
        catalogId: PropTypes.string
    }),
    queryParams: PropTypes.instanceOf(URLSearchParams)
};

module.exports = Discover;
