const React = require('react');
const { useServices } = require('stremio/services');
const { MainNavBars, MetaRow, useDeepEqualMemo } = require('stremio/common');
const useBoard = require('./useBoard');
const useContinueWatching = require('./useContinueWatching');
const styles = require('./styles');

const CONTINUE_WATCHING_OPTIONS = [
    { label: 'Play', value: 'play' },
    { label: 'Details', value: 'details' },
    { label: 'Dismiss', value: 'dismiss' }
];

const Board = () => {
    const { core } = useServices();
    const board = useBoard();
    const continueWatching = useContinueWatching();
    const continueWatchingItems = useDeepEqualMemo(() => {
        const onSelect = (event) => {
            switch (event.value) {
                case 'play': {
                    break;
                }
                case 'details': {
                    break;
                }
                case 'dismiss': {
                    core.dispatch({
                        action: 'Ctx',
                        args: {
                            action: 'RewindLibraryItem',
                            args: event.dataset.id
                        }
                    });
                    break;
                }
            }
        };
        return continueWatching.lib_items.map(({ id, ...libItem }) => ({
            ...libItem,
            dataset: { id },
            options: CONTINUE_WATCHING_OPTIONS,
            optionOnSelect: onSelect
        }));
    }, [continueWatching.lib_items]);
    return (
        <MainNavBars className={styles['board-container']} route={'board'}>
            <div className={styles['board-content']}>
                {
                    continueWatchingItems.length > 0 ?
                        <MetaRow
                            className={styles['board-row']}
                            title={'Continue Watching'}
                            items={continueWatchingItems}
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
