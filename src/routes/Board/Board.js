const React = require('react');
const { MainNavBar, MetaRow } = require('stremio/common');
const useCatalogs = require('./useCatalogs');
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
    const catalogs = useCatalogs();
    return (
        <div className={styles['board-container']}>
            <MainNavBar className={styles['nav-bar']} />
            <div className={styles['board-content']}>
                {catalogs.map(({ request, content }, index) => {
                    switch (content.type) {
                        case 'Ready':
                            return (
                                <MetaRow
                                    key={`${index}${request.base}${content.type}`}
                                    className={styles['board-row']}
                                    title={`${request.path.id} - ${request.path.type_name}`}
                                    items={content.content}
                                />
                            );
                        case 'Message':
                            return (
                                <MetaRow
                                    key={`${index}${request.base}${content.type}`}
                                    className={styles['board-row']}
                                    title={`${request.path.id} - ${request.path.type_name}`}
                                    message={content.content}
                                />
                            );
                        case 'Loading':
                            return (
                                <MetaRow.Placeholder
                                    key={`${index}${request.base}${content.type}`}
                                    className={styles['board-row-placeholder']}
                                    title={`${request.path.id} - ${request.path.type_name}`}
                                />
                            );
                    }
                })}
            </div>
        </div>
    );
};

module.exports = Board;
