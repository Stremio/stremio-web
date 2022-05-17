// Copyright (C) 2017-2022 Smart code 203358507

const React = require('react');
const classnames = require('classnames');
const { useVirtual } = require('react-virtual');
const { MainNavBars, MetaRow, LibItem, MetaItem, StreamingServerWarning, useProfile, useStreamingServer } = require('stremio/common');
const useBoard = require('./useBoard');
const useContinueWatchingPreview = require('./useContinueWatchingPreview');
const styles = require('./styles');

const Board = () => {
    const profile = useProfile();
    const streamingServer = useStreamingServer();
    const [board, loadBoardCatalogs] = useBoard();
    const continueWatchingPreview = useContinueWatchingPreview();
    const boardCatalogsOffset = continueWatchingPreview.libraryItems.length > 0 ? 1 : 0;
    const scrollContainerRef = React.useRef();
    const virtualizer = useVirtual({
        parentRef: scrollContainerRef,
        size: board.catalogs.length + boardCatalogsOffset,
        overscan: 1
    });
    React.useEffect(() => {
        if (virtualizer.virtualItems.length === 0) {
            return;
        }

        const start = Math.max(0, virtualizer.virtualItems[0].index - boardCatalogsOffset);
        const end = virtualizer.virtualItems[virtualizer.virtualItems.length - 1].index - boardCatalogsOffset;
        if (end < start) {
            return;
        }

        loadBoardCatalogs(start, end);
    }, [virtualizer.virtualItems, boardCatalogsOffset]);
    return (
        <div className={styles['board-container']}>
            <MainNavBars className={styles['board-content-container']} route={'board'}>
                <div ref={scrollContainerRef} className={styles['board-content']}>
                    <div style={{ height: virtualizer.totalSize }} className={styles['board-rows-window']}>
                        {virtualizer.virtualItems.map(({ index, measureRef, start }) => (
                            <div key={index} ref={measureRef} style={{ transform: `translateY(${start}px)` }} className={styles['board-row-container']}>
                                {
                                    index === 0 && continueWatchingPreview.libraryItems.length > 0 ?
                                        <MetaRow
                                            className={classnames(styles['board-row'], styles['continue-watching-row'])}
                                            title={'Continue Watching'}
                                            items={continueWatchingPreview.libraryItems}
                                            itemComponent={LibItem}
                                            deepLinks={continueWatchingPreview.deepLinks}
                                        />
                                        :
                                        board.catalogs[index - boardCatalogsOffset].content.type === 'Ready' ?
                                            <MetaRow
                                                className={classnames(styles['board-row'], styles[`board-row-${board.catalogs[index - boardCatalogsOffset].content.content[0].posterShape}`])}
                                                title={board.catalogs[index - boardCatalogsOffset].title}
                                                items={board.catalogs[index - boardCatalogsOffset].content.content}
                                                itemComponent={MetaItem}
                                                deepLinks={board.catalogs[index - boardCatalogsOffset].deepLinks}
                                            />
                                            :
                                            board.catalogs[index - boardCatalogsOffset].content.type === 'Err' ?
                                                <MetaRow
                                                    className={styles['board-row']}
                                                    title={board.catalogs[index - boardCatalogsOffset].title}
                                                    message={board.catalogs[index - boardCatalogsOffset].content.content}
                                                    deepLinks={board.catalogs[index - boardCatalogsOffset].deepLinks}
                                                />
                                                :
                                                <MetaRow.Placeholder
                                                    className={classnames(styles['board-row'], styles['board-row-poster'])}
                                                    title={board.catalogs[index - boardCatalogsOffset].title}
                                                    deepLinks={board.catalogs[index - boardCatalogsOffset].deepLinks}
                                                />
                                }
                            </div>
                        ))}
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
