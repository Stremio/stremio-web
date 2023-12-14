// Copyright (C) 2017-2023 Smart code 203358507

const React = require('react');
const classnames = require('classnames');
const debounce = require('lodash.debounce');
const { useTranslation } = require('react-i18next');
const { MainNavBars, MetaRow, ContinueWatchingItem, MetaItem, StreamingServerWarning, useStreamingServer, withCoreSuspender, getVisibleChildrenRange, ModalDialog, Button, useBinaryState } = require('stremio/common');
const useBoard = require('./useBoard');
const useContinueWatchingPreview = require('./useContinueWatchingPreview');
const styles = require('./styles');
const useFetchModalData = require('./useFetchModalData');

const THRESHOLD = 5;

const Board = () => {
    const { t } = useTranslation();
    const streamingServer = useStreamingServer();
    const continueWatchingPreview = useContinueWatchingPreview();
    const [board, loadBoardRows] = useBoard();
    const boardCatalogsOffset = continueWatchingPreview.items.length > 0 ? 1 : 0;
    const scrollContainerRef = React.useRef();
    const { notificationModalData, isModalDataLoading } = useFetchModalData();
    const [isNotificationModalOpen, , closeNotificationModal, ] = useBinaryState(true);
    const onVisibleRangeChange = React.useCallback(() => {
        const range = getVisibleChildrenRange(scrollContainerRef.current);
        if (range === null) {
            return;
        }

        const start = Math.max(0, range.start - boardCatalogsOffset - THRESHOLD);
        const end = range.end - boardCatalogsOffset + THRESHOLD;
        if (end < start) {
            return;
        }

        loadBoardRows({ start, end });
    }, [boardCatalogsOffset]);
    const onScroll = React.useCallback(debounce(onVisibleRangeChange, 250), [onVisibleRangeChange]);
    React.useLayoutEffect(() => {
        onVisibleRangeChange();
    }, [board.catalogs, onVisibleRangeChange]);
    return (
        <div className={styles['board-container']}>
            {
                isNotificationModalOpen && notificationModalData && !isModalDataLoading ?
                    <ModalDialog className={styles['notification-modal']} title={'Notification Modal'} onCloseRequest={closeNotificationModal}>
                        {
                            notificationModalData.imageUrl ?
                                <img className={styles['notification-image']} style={{ width: '95%', height: '95%' }} src={notificationModalData.imageUrl} />
                                :
                                null
                        }
                        <div className={styles['info-container']}>
                            <div className={styles['title-container']}>
                                {
                                    notificationModalData.title ?
                                        <div className={styles['title']}>{notificationModalData.title}</div>
                                        :
                                        null
                                }
                                {
                                    notificationModalData.message ?
                                        <div className={styles['notification-label']}>{notificationModalData.message}</div>
                                        :
                                        null
                                }
                            </div>
                            <Button className={styles['action-button']}>
                                <div className={styles['label']}>Learn more</div>
                            </Button>
                        </div>
                    </ModalDialog>
                    :
                    null
            }
            <MainNavBars className={styles['board-content-container']} route={'board'}>
                <div ref={scrollContainerRef} className={styles['board-content']} onScroll={onScroll}>
                    {
                        continueWatchingPreview.items.length > 0 ?
                            <MetaRow
                                className={classnames(styles['board-row'], styles['continue-watching-row'], 'animation-fade-in')}
                                title={t('BOARD_CONTINUE_WATCHING')}
                                items={continueWatchingPreview.items}
                                itemComponent={ContinueWatchingItem}
                                deepLinks={continueWatchingPreview.deepLinks}
                            />
                            :
                            null
                    }
                    {board.catalogs.map((catalog, index) => {
                        switch (catalog.content?.type) {
                            case 'Ready': {
                                return (
                                    <MetaRow
                                        key={index}
                                        className={classnames(styles['board-row'], styles[`board-row-${catalog.content.content[0].posterShape}`], 'animation-fade-in')}
                                        title={catalog.title}
                                        items={catalog.content.content}
                                        itemComponent={MetaItem}
                                        deepLinks={catalog.deepLinks}
                                    />
                                );
                            }
                            case 'Err': {
                                return (
                                    <MetaRow
                                        key={index}
                                        className={classnames(styles['board-row'], 'animation-fade-in')}
                                        title={catalog.title}
                                        message={catalog.content.content}
                                        deepLinks={catalog.deepLinks}
                                    />
                                );
                            }
                            default: {
                                return (
                                    <MetaRow.Placeholder
                                        key={index}
                                        className={classnames(styles['board-row'], styles['board-row-poster'], 'animation-fade-in')}
                                        title={catalog.title}
                                        deepLinks={catalog.deepLinks}
                                    />
                                );
                            }
                        }
                    })}
                </div>
            </MainNavBars>
            {
                streamingServer.settings !== null && streamingServer.settings.type === 'Err' ?
                    <StreamingServerWarning className={styles['board-warning-container']} />
                    :
                    null
            }
        </div>
    );
};

const BoardFallback = () => (
    <div className={styles['board-container']}>
        <MainNavBars className={styles['board-content-container']} route={'board'} />
    </div>
);

module.exports = withCoreSuspender(Board, BoardFallback);
