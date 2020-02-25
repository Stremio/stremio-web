const React = require('react');
const { MainNavBars, MetaRow } = require('stremio/common');
const useBoard = require('./useBoard');
const useContinueWatching = require('./useContinueWatching');
const useItemOptions = require('./useItemOptions');
const styles = require('./styles');

const Board = () => {
    const board = useBoard();
    const continueWatching = useContinueWatching();
    const [options, optionOnSelect] = useItemOptions();
    return (
        <MainNavBars className={styles['board-container']} route={'board'}>
            <div className={styles['board-content']}>
                {
                    continueWatching.lib_items.length > 0 ?
                        <MetaRow
                            className={styles['board-row']}
                            title={'Continue Watching'}
                            items={continueWatching.lib_items.map(({ id, videoId, ...libItem }) => ({
                                ...libItem,
                                dataset: { id, videoId, type: libItem.type },
                                options,
                                optionOnSelect
                            }))}
                            limit={10}
                        />
                        :
                        null
                }
                {board.catalog_resources.map((catalog_resource, index) => {
                    const title = `${catalog_resource.addon_name} - ${catalog_resource.request.path.id} ${catalog_resource.request.path.type_name}`;
                    switch (catalog_resource.content.type) {
                        case 'Ready': {
                            return (
                                <MetaRow
                                    key={index}
                                    className={styles['board-row']}
                                    title={title}
                                    items={catalog_resource.content.content}
                                    href={catalog_resource.href}
                                    limit={10}
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
                                    limit={10}
                                />
                            );
                        }
                        case 'Loading': {
                            return (
                                <MetaRow.Placeholder
                                    key={index}
                                    className={styles['board-row-placeholder']}
                                    title={title}
                                    limit={10}
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
