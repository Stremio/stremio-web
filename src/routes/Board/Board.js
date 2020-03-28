const React = require('react');
const { MainNavBars, MetaRow, LibItem, MetaItem } = require('stremio/common');
const useBoard = require('./useBoard');
const useContinueWatchingPreview = require('./useContinueWatchingPreview');
const styles = require('./styles');

const Board = () => {
    const board = useBoard();
    const continueWatchingPreview = useContinueWatchingPreview();
    return (
        <MainNavBars className={styles['board-container']} route={'board'}>
            <div className={styles['board-content']}>
                {
                    continueWatchingPreview.lib_items.length > 0 ?
                        <MetaRow
                            className={styles['board-row']}
                            title={'Continue Watching'}
                            items={continueWatchingPreview.lib_items}
                            itemComponent={LibItem}
                            href={continueWatchingPreview.href}
                        />
                        :
                        null
                }
                {board.catalog_resources.map((catalog_resource, index) => {
                    const title = `${catalog_resource.origin} - ${catalog_resource.request.path.id} ${catalog_resource.request.path.type_name}`;
                    switch (catalog_resource.content.type) {
                        case 'Ready': {
                            return (
                                <MetaRow
                                    key={index}
                                    className={styles['board-row']}
                                    title={title}
                                    items={catalog_resource.content.content}
                                    itemComponent={MetaItem}
                                    href={catalog_resource.href}
                                />
                            );
                        }
                        case 'Err': {
                            const message = `Error(${catalog_resource.content.content.type})${typeof catalog_resource.content.content.content === 'string' ? ` - ${catalog_resource.content.content.content}` : ''}`;
                            return (
                                <MetaRow
                                    key={index}
                                    className={styles['board-row']}
                                    title={title}
                                    message={message}
                                    href={catalog_resource.href}
                                />
                            );
                        }
                        case 'Loading': {
                            return (
                                <MetaRow.Placeholder
                                    key={index}
                                    className={styles['board-row']}
                                    title={title}
                                    href={catalog_resource.href}
                                />
                            );
                        }
                    }
                })}
            </div>
        </MainNavBars>
    );
};

module.exports = Board;
