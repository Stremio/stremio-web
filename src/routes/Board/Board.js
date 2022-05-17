// Copyright (C) 2017-2022 Smart code 203358507

const React = require('react');
const classnames = require('classnames');
const { AutoSizer, List, CellMeasurer, CellMeasurerCache } = require('react-virtualized');
const { MainNavBars, MetaRow, LibItem, MetaItem, StreamingServerWarning, useProfile, useStreamingServer } = require('stremio/common');
const useBoard = require('./useBoard');
const useContinueWatchingPreview = require('./useContinueWatchingPreview');
const styles = require('./styles');

const withMeasure = (Component) => {
    return React.forwardRef(function withMeasure({ measure, ...props }, ref) {
        React.useLayoutEffect(() => {
            measure();
        }, [measure]);
        return (
            <Component {...props} ref={ref} />
        );
    });
};

const MetaRowWithMeasure = withMeasure(MetaRow);
const MetaRowPlaceholderWithMeasure = withMeasure(MetaRow.Placeholder);

const Board = () => {
    const board = useBoard();
    const profile = useProfile();
    const streamingServer = useStreamingServer();
    const continueWatchingPreview = useContinueWatchingPreview();
    const cache = React.useMemo(() => new CellMeasurerCache({
        fixedWidth: true
    }), []);
    return (
        <div className={styles['board-container']}>
            <MainNavBars className={styles['board-content-container']} route={'board'}>
                <div className={styles['board-content']}>
                    <AutoSizer>
                        {({ width, height }) => (
                            <List
                                deferredMeasurementCache={cache}
                                width={width}
                                height={height}
                                rowCount={board.catalogs.length}
                                rowHeight={cache.rowHeight}
                                onRowsRendered={(args) => console.log('onRowsRendered', args)}
                                rowRenderer={({ index, key, style, parent }) => {
                                    const catalog = board.catalogs[index];
                                    return (
                                        <CellMeasurer
                                            key={key}
                                            parent={parent}
                                            cache={cache}
                                            rowIndex={index}
                                            columnIndex={0}
                                        >
                                            {({ registerChild, measure }) => (
                                                catalog.content.type === 'Ready' ?
                                                    <MetaRowWithMeasure
                                                        ref={registerChild}
                                                        measure={measure}
                                                        style={style}
                                                        className={classnames(styles['board-row'], styles[`board-row-${catalog.content.content[0].posterShape}`])}
                                                        title={catalog.title}
                                                        items={catalog.content.content}
                                                        itemComponent={MetaItem}
                                                        deepLinks={catalog.deepLinks}
                                                    />
                                                    :
                                                    catalog.content.type === 'Err' ?
                                                        <MetaRowWithMeasure
                                                            ref={registerChild}
                                                            measure={measure}
                                                            style={style}
                                                            className={styles['board-row']}
                                                            title={catalog.title}
                                                            message={catalog.content.content}
                                                            deepLinks={catalog.deepLinks}
                                                        />
                                                        :
                                                        <MetaRowPlaceholderWithMeasure
                                                            ref={registerChild}
                                                            measure={measure}
                                                            style={style}
                                                            className={classnames(styles['board-row'], styles['board-row-poster'])}
                                                            title={catalog.title}
                                                            deepLinks={catalog.deepLinks}
                                                        />
                                            )}
                                        </CellMeasurer>
                                    );
                                }}
                            />
                        )}
                    </AutoSizer>
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
