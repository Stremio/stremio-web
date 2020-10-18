// Copyright (C) 2017-2020 Smart code 203358507

const React = require('react');
const PropTypes = require('prop-types');
const classnames = require('classnames');
const Icon = require('@stremio/stremio-icons/dom');
const { AddonDetailsModal, Button, MainNavBars, MetaItem, Image, MetaPreview, Multiselect, ModalDialog, PaginationInput, CONSTANTS, useBinaryState, useDeepEqualEffect } = require('stremio/common');
const useDiscover = require('./useDiscover');
const useSelectableInputs = require('./useSelectableInputs');
const styles = require('./styles');

const getMetaItemAtIndex = (catalog, index) => {
    return index !== null &&
        isFinite(index) &&
        catalog !== null &&
        catalog.content.type === 'Ready' &&
        catalog.content.content[index] ?
        catalog.content.content[index]
        :
        null;
};

const Discover = ({ urlParams, queryParams }) => {
    const discover = useDiscover(urlParams, queryParams);
    const [selectInputs, paginationInput] = useSelectableInputs(discover);
    const [inputsModalOpen, openInputsModal, closeInputsModal] = useBinaryState(false);
    const [addonModalOpen, openAddonModal, closeAddonModal] = useBinaryState(false);
    const [selectedMetaItem, setSelectedMetaItem] = React.useState(() => {
        return getMetaItemAtIndex(discover.catalog, 0);
    });
    const metaItemsOnFocusCapture = React.useCallback((event) => {
        if (event.target.dataset.index !== null && !isNaN(event.target.dataset.index)) {
            const metaItem = getMetaItemAtIndex(discover.catalog, event.target.dataset.index);
            setSelectedMetaItem(metaItem);
        }
    }, [discover.catalog]);
    const metaItemOnClick = React.useCallback((event) => {
        const metaItem = getMetaItemAtIndex(discover.catalog, event.currentTarget.dataset.index);
        if (metaItem !== selectedMetaItem) {
            event.preventDefault();
            event.currentTarget.focus();
        }
    }, [discover.catalog, selectedMetaItem]);
    React.useLayoutEffect(() => {
        const metaItem = getMetaItemAtIndex(discover.catalog, 0);
        setSelectedMetaItem(metaItem);
    }, [discover.catalog]);
    useDeepEqualEffect(() => {
        closeInputsModal();
        closeAddonModal();
    }, [discover.selected]);
    return (
        <MainNavBars className={styles['discover-container']} route={'discover'}>
            <div className={styles['discover-content']}>
                <div className={styles['catalog-container']}>
                    {
                        discover.default_request ?
                            <div className={styles['selectable-inputs-container']}>
                                {selectInputs.map(({ title, options, selected, renderLabelText, onSelect }, index) => (
                                    <Multiselect
                                        key={index}
                                        className={styles['select-input']}
                                        title={title}
                                        options={options}
                                        selected={selected}
                                        renderLabelText={renderLabelText}
                                        onSelect={onSelect}
                                    />
                                ))}
                                <Button className={styles['filter-container']} title={'All filters'} onClick={openInputsModal}>
                                    <Icon className={styles['filter-icon']} icon={'ic_filter'} />
                                </Button>
                                <div className={styles['spacing']} />
                                {
                                    paginationInput !== null ?
                                        <PaginationInput {...paginationInput} className={styles['pagination-input']} />
                                        :
                                        <PaginationInput label={'1'} className={classnames(styles['pagination-input'], styles['pagination-input-placeholder'])} />
                                }
                            </div>
                            :
                            null
                    }
                    {
                        discover.catalog !== null && typeof discover.catalog.addon_name !== 'string' ?
                            <div className={styles['missing-addon-warning-container']}>
                                <div className={styles['warning-label']}>Addon is not installed. Install now?</div>
                                <Button className={styles['install-button']} title={'Install addon'} onClick={openAddonModal}>
                                    <div className={styles['label']}>Install</div>
                                </Button>
                            </div>
                            :
                            null
                    }
                    {
                        discover.catalog === null ?
                            <div className={styles['message-container']}>
                                <Image className={styles['image']} src={'/images/empty.png'} alt={' '} />
                                <div className={styles['message-label']}>No catalog selected!</div>
                            </div>
                            :
                            discover.catalog.content.type === 'Err' ?
                                <div className={styles['message-container']}>
                                    <Image className={styles['image']} src={'/images/empty.png'} alt={' '} />
                                    <div className={styles['message-label']}>
                                        {`Error(${discover.catalog.content.content.type})`}
                                    </div>
                                    {
                                        discover.catalog.content.content.type === 'UnexpectedResponse' ?
                                            <div className={styles['message-label']}>
                                                {discover.catalog.content.content.content}
                                            </div>
                                            :
                                            discover.catalog.content.content.type === 'Env' ?
                                                <div className={styles['message-label']}>
                                                    {discover.catalog.content.content.content.message}
                                                </div>
                                                :
                                                null
                                    }
                                </div>
                                :
                                discover.catalog.content.type === 'Loading' ?
                                    <div className={styles['meta-items-container']}>
                                        {Array(CONSTANTS.CATALOG_PAGE_SIZE).fill(null).map((_, index) => (
                                            <div key={index} className={styles['meta-item-placeholder']}>
                                                <div className={styles['poster-container']} />
                                                <div className={styles['title-bar-container']}>
                                                    <div className={styles['title-label']} />
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                    :
                                    <div className={styles['meta-items-container']} onFocusCapture={metaItemsOnFocusCapture}>
                                        {discover.catalog.content.content.map((metaItem, index) => (
                                            <MetaItem
                                                key={index}
                                                className={classnames({ 'selected': selectedMetaItem === metaItem })}
                                                type={metaItem.type}
                                                name={metaItem.name}
                                                poster={metaItem.poster}
                                                posterShape={metaItem.posterShape}
                                                playIcon={selectedMetaItem === metaItem}
                                                deepLinks={metaItem.deepLinks}
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
                            trailerStreams={selectedMetaItem.trailerStreams}
                        />
                        :
                        discover.catalog !== null && discover.catalog.content.type === 'Loading' ?
                            <div className={styles['meta-preview-container']} />
                            :
                            null
                }
            </div>
            {
                inputsModalOpen && discover.default_request ?
                    <ModalDialog title={'Catalog filters'} className={styles['selectable-inputs-modal-container']} onCloseRequest={closeInputsModal}>
                        {selectInputs.map(({ title, isRequired, options, selected, renderLabelText, onSelect }, index) => (
                            <div key={index} className={styles['selectable-input-container']}>
                                <div className={styles['select-input-label']} title={title}>
                                    {title}
                                    {isRequired ? '*' : null}
                                </div>
                                <Multiselect
                                    className={styles['select-input']}
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
                addonModalOpen && discover.catalog !== null ?
                    <AddonDetailsModal transportUrl={discover.catalog.request.base} onCloseRequest={closeAddonModal} />
                    :
                    null
            }
        </MainNavBars>
    );
};

Discover.propTypes = {
    urlParams: PropTypes.shape({
        transportUrl: PropTypes.string,
        type: PropTypes.string,
        catalogId: PropTypes.string
    }),
    queryParams: PropTypes.instanceOf(URLSearchParams)
};

module.exports = Discover;
