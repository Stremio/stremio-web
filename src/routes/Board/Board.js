// Copyright (C) 2017-2022 Smart code 203358507

const React = require('react');
const classnames = require('classnames');
const throttle = require('lodash.throttle');
const { MainNavBars, MetaRow, LibItem, MetaItem, StreamingServerWarning, useProfile, useStreamingServer, getVisibleChildrenRange } = require('stremio/common');
const useBoard = require('./useBoard');
const useContinueWatchingPreview = require('./useContinueWatchingPreview');
const styles = require('./styles');

const THRESHOLD = 300;

const Board = () => {
    const profile = useProfile();
    const streamingServer = useStreamingServer();
    const continueWatchingPreview = useContinueWatchingPreview();
    const [board, loadBoardRows] = useBoard();
    const [loadedCatalogs, setLoadedCatalogs] = React.useState(false);
    const boardCatalogsOffset = continueWatchingPreview.libraryItems.length > 0 ? 1 : 0;
    const scrollContainerRef = React.useRef();
    const onVisibleRangeChange = React.useCallback(() => {
        if (loadedCatalogs) {
            return;
        }
        const range = getVisibleChildrenRange(scrollContainerRef.current, THRESHOLD);
        if (range === null) {
            return;
        }

        range.end += 8;
        let start = Math.max(0, range.start - boardCatalogsOffset);
        const end = range.end - boardCatalogsOffset;
        if (end < start) {
            return;
        }

        for (let i = start; i <= end - 2; i += 2)
            loadBoardRows({ start: i, end: i + 2 });
    }, [loadedCatalogs, boardCatalogsOffset]);
    const onScroll = React.useCallback(throttle(onVisibleRangeChange, 250), [onVisibleRangeChange]);
    React.useLayoutEffect(() => {
        setLoadedCatalogs(board?.catalogs.filter(catalog => ['Ready','Err'].includes(catalog?.content?.type)).length === board?.catalogs?.length);
        onVisibleRangeChange();
    }, [board.catalogs, onVisibleRangeChange]);
    return (
        <div className={styles['board-container']}>
            <MainNavBars className={styles['board-content-container']} route={'board'}>
                <div ref={scrollContainerRef} className={styles['board-content']} onScroll={onScroll}>
                    {
                        continueWatchingPreview.libraryItems.length > 0 ?
                            <MetaRow
                                className={classnames(styles['board-row'], styles['continue-watching-row'])}
                                title={'Continue Watching'}
                                items={continueWatchingPreview.libraryItems}
                                itemComponent={LibItem}
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
                                        className={classnames(styles['board-row'], styles[`board-row-${catalog.content.content[0].posterShape}`])}
                                        title={catalog.title}
                                        items={catalog.content.content}
                                        itemComponent={MetaItem}
                                        deepLinks={catalog.deepLinks}
                                    />
                                );
                            }
                        }
                    })}
                    <div style={{ height: '70%', textAlign: 'center', display: loadedCatalogs ? 'none' : 'block' }}>
                        <span className={styles['blinker']}>Loding catalogs</span>
                    </div>
                </div>
            </MainNavBars>
            {
                streamingServer.settings !== null && streamingServer.settings.type === 'Err' &&
                    (isNaN(profile.settings.streamingServerWarningDismissed.getTime()) || profile.settings.streamingServerWarningDismissed.getTime() < Date.now()) ?
                    <StreamingServerWarning className={styles['board-warning-container']} />
                    :
                    null
            }
        </div>
    );
};

module.exports = Board;
