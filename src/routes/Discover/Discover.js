// Copyright (C) 2017-2023 Smart code 203358507

const React = require('react');
const PropTypes = require('prop-types');
const classnames = require('classnames');
const { default: Icon } = require('@stremio/stremio-icons/react');
const { useServices } = require('stremio/services');
const { AddonDetailsModal, DelayedRenderer, Button, MainNavBars, MetaItem, Image, MetaPreview, Multiselect, ModalDialog, CONSTANTS, useBinaryState, useOnScrollToBottom, withCoreSuspender } = require('stremio/common');
const useDiscover = require('./useDiscover');
const useSelectableInputs = require('./useSelectableInputs');
const styles = require('./styles');

const SCROLL_TO_BOTTOM_TRESHOLD = 400;

const Discover = ({ urlParams, queryParams }) => {
    const { core } = useServices();
    const [discover, loadNextPage] = useDiscover(urlParams, queryParams);
    const [selectInputs, hasNextPage] = useSelectableInputs(discover);
    const [inputsModalOpen, openInputsModal, closeInputsModal] = useBinaryState(false);
    const [addonModalOpen, openAddonModal, closeAddonModal] = useBinaryState(false);
    const [selectedMetaItemIndex, setSelectedMetaItemIndex] = React.useState(0);
    const metasContainerRef = React.useRef();
    React.useEffect(() => {
        if (discover.catalog?.content.type === 'Loading') {
            metasContainerRef.current.scrollTop = 0;
        }
    }, [discover.catalog]);
    const selectedMetaItem = React.useMemo(() => {
        return discover.catalog !== null &&
            discover.catalog.content.type === 'Ready' &&
            discover.catalog.content.content[selectedMetaItemIndex] ?
            discover.catalog.content.content[selectedMetaItemIndex]
            :
            null;
    }, [discover.catalog, selectedMetaItemIndex]);
    const addToLibrary = React.useCallback(() => {
        if (selectedMetaItem === null) {
            return;
        }

        core.transport.dispatch({
            action: 'Ctx',
            args: {
                action: 'AddToLibrary',
                args: selectedMetaItem
            }
        });
    }, [selectedMetaItem]);
    const removeFromLibrary = React.useCallback(() => {
        if (selectedMetaItem === null) {
            return;
        }

        core.transport.dispatch({
            action: 'Ctx',
            args: {
                action: 'RemoveFromLibrary',
                args: selectedMetaItem.id
            }
        });
    }, [selectedMetaItem]);
    const metaItemsOnFocusCapture = React.useCallback((event) => {
        if (event.target.dataset.index !== null && !isNaN(event.target.dataset.index)) {
            setSelectedMetaItemIndex(parseInt(event.target.dataset.index, 10));
        }
    }, []);
    const metaItemOnClick = React.useCallback((event) => {
        if (event.currentTarget.dataset.index !== selectedMetaItemIndex.toString()) {
            event.preventDefault();
            event.currentTarget.focus();
        }
    }, [selectedMetaItemIndex]);
    const onScrollToBottom = React.useCallback(() => {
        if (hasNextPage) {
            loadNextPage();
        }
    }, [hasNextPage, loadNextPage]);
    const onScroll = useOnScrollToBottom(onScrollToBottom, SCROLL_TO_BOTTOM_TRESHOLD);
    React.useEffect(() => {
        closeInputsModal();
        closeAddonModal();
        setSelectedMetaItemIndex(0);
    }, [discover.selected]);
    return (
        <MainNavBars className={styles['discover-container']} route={'discover'}>
            <div className={styles['discover-content']}>
                <div className={styles['catalog-container']}>
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
                            <Icon className={styles['filter-icon']} name={'filters'} />
                        </Button>
                    </div>
                    {
                        discover.catalog !== null && !discover.catalog.installed ?
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
                            <DelayedRenderer delay={500}>
                                <div className={styles['message-container']}>
                                    <Image className={styles['image']} src={require('/images/empty.png')} alt={' '} />
                                    <div className={styles['message-label']}>No catalog selected!</div>
                                </div>
                            </DelayedRenderer>
                            :
                            discover.catalog.content.type === 'Err' ?
                                <div className={styles['message-container']}>
                                    <Image className={styles['image']} src={require('/images/empty.png')} alt={' '} />
                                    <div className={styles['message-label']}>{discover.catalog.content.content}</div>
                                </div>
                                :
                                discover.catalog.content.type === 'Loading' ?
                                    <div ref={metasContainerRef} className={classnames(styles['meta-items-container'], 'animation-fade-in')}>
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
                                    <div ref={metasContainerRef} className={classnames(styles['meta-items-container'], 'animation-fade-in')} onScroll={onScroll} onFocusCapture={metaItemsOnFocusCapture}>
                                        {discover.catalog.content.content.map((metaItem, index) => (
                                            <MetaItem
                                                key={index}
                                                className={classnames({ 'selected': selectedMetaItemIndex === index })}
                                                type={metaItem.type}
                                                name={metaItem.name}
                                                poster={metaItem.poster}
                                                posterShape={metaItem.posterShape}
                                                playname={selectedMetaItemIndex === index}
                                                deepLinks={metaItem.deepLinks}
                                                watched={metaItem.watched}
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
                            links={selectedMetaItem.links}
                            deepLinks={selectedMetaItem.deepLinks}
                            trailerStreams={selectedMetaItem.trailerStreams}
                            inLibrary={selectedMetaItem.inLibrary}
                            toggleInLibrary={selectedMetaItem.inLibrary ? removeFromLibrary : addToLibrary}
                        />
                        :
                        discover.catalog !== null && discover.catalog.content.type === 'Loading' ?
                            <div className={styles['meta-preview-container']} />
                            :
                            null
                }
            </div>
            {
                inputsModalOpen ?
                    <ModalDialog title={'Catalog filters'} className={styles['selectable-inputs-modal']} onCloseRequest={closeInputsModal}>
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
                    </ModalDialog>
                    :
                    null
            }
            {
                addonModalOpen && discover.selected !== null ?
                    <AddonDetailsModal transportUrl={discover.selected.request.base} onCloseRequest={closeAddonModal} />
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

const DiscoverFallback = () => (
    <MainNavBars className={styles['discover-container']} route={'discover'} />
);

module.exports = withCoreSuspender(Discover, DiscoverFallback);
