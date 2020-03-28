const React = require('react');
const classnames = require('classnames');
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
                            className={classnames(styles['board-row'], styles['continue-watching-row'])}
                            title={'Continue Watching'}
                            items={continueWatchingPreview.lib_items}
                            itemComponent={LibItem}
                            href={'#/continuewatching'}
                        />
                        :
                        null
                }
                {board.catalog_resources.map((catalog_resource, index) => {
                    const href = `#/discover/${encodeURIComponent(catalog_resource.request.base)}/${encodeURIComponent(catalog_resource.request.path.type_name)}/${encodeURIComponent(catalog_resource.request.path.id)}`;
                    const title = `${catalog_resource.origin} - ${catalog_resource.request.path.id} ${catalog_resource.request.path.type_name}`;
                    switch (catalog_resource.content.type) {
                        case 'Ready': {
                            const posterShape = catalog_resource.content.content.length > 0 ?
                                catalog_resource.content.content[0].posterShape
                                :
                                null;
                            return (
                                <MetaRow
                                    key={index}
                                    className={classnames(styles['board-row'], styles['board-row-poster'], { [styles[`board-row-${posterShape}`]]: typeof posterShape === 'string' })}
                                    title={title}
                                    items={catalog_resource.content.content}
                                    itemComponent={MetaItem}
                                    href={href}
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
                                    href={href}
                                />
                            );
                        }
                        case 'Loading': {
                            return (
                                <MetaRow.Placeholder
                                    key={index}
                                    className={classnames(styles['board-row'], styles['board-row-poster'])}
                                    title={title}
                                    href={href}
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
