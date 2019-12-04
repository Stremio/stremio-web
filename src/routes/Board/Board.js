const React = require('react');
const { MainNavBar, MetaRow } = require('stremio/common');
const useBoard = require('./useBoard');
const useContinueWatching = require('./useContinueWatching');
const styles = require('./styles');

const CONTINUE_WATCHING_MENU = [
    {
        label: 'Play',
        value: 'play'
    },
    {
        label: 'Dismiss',
        value: 'dismiss'
    }
];

const Board = () => {
    const board = useBoard();
    const continueWatching = useContinueWatching();
    return (
        <div className={styles['board-container']}>
            <MainNavBar className={styles['nav-bar']} />
            <div className={styles['board-content']}>
                {
                    continueWatching.lib_items.length > 0 ?
                        <MetaRow
                            className={styles['board-row']}
                            title={'Continue Watching'}
                            items={continueWatching.lib_items}
                            limit={10}
                        />
                        :
                        null
                }
                {board.catalog_resources.map((catalog_resource, index) => {
                    const title = `${catalog_resource.addon_name} - ${catalog_resource.request.path.id} ${catalog_resource.request.path.type_name}`;
                    switch (catalog_resource.content.type) {
                        case 'Ready':
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
                        case 'Err':
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
                        case 'Loading':
                            return (
                                <MetaRow.Placeholder
                                    key={index}
                                    className={styles['board-row-placeholder']}
                                    title={title}
                                    limit={10}
                                />
                            );
                    }
                })}
            </div>
        </div>
    );
};

module.exports = Board;
