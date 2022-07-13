// Copyright (C) 2017-2022 Smart code 203358507

const React = require('react');
const classnames = require('classnames');
const debounce = require('lodash.debounce');
const { MainNavBars, MetaRow, LibItem, MetaItem, StreamingServerWarning, useProfile, useStreamingServer, getVisibleChildrenRange } = require('stremio/common');
const useBoard = require('./useBoard');
const useContinueWatchingPreview = require('./useContinueWatchingPreview');
const styles = require('./styles');

const THRESHOLD = 5;

const Board = () => {
    const profile = useProfile();
    const streamingServer = useStreamingServer();
    const continueWatchingPreview = useContinueWatchingPreview();
    const [board, loadBoardRows] = useBoard();
    const boardCatalogsOffset = continueWatchingPreview.libraryItems.length > 0 ? 1 : 0;
    const scrollContainerRef = React.useRef();
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
                            case 'Err': {
                                return (
                                    <MetaRow
                                        key={index}
                                        className={styles['board-row']}
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
                                        className={classnames(styles['board-row'], styles['board-row-poster'])}
                                        title={catalog.title}
                                        deepLinks={catalog.deepLinks}
                                    />
                                );
                            }
                        }
                    })}
                </div>
            </MainNavBars>
        </div>
    );
};

module.exports = Board;
