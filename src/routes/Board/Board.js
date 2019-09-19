const React = require('react');
const { MainNavBar, MetaRow, MetaRowPlaceholder } = require('stremio/common');
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
                {catalogs.map(({ req, content }, index) => {
                    switch (content.type) {
                        case 'Ready':
                            return (
                                <MetaRow
                                    key={`${index}${req.base}${content.type}`}
                                    className={styles['board-row']}
                                    title={`${req.path.id} - ${req.path.type_name}`}
                                    items={content.content}
                                />
                            );
                        case 'Message':
                            return (
                                <MetaRow
                                    key={`${index}${req.base}${content.type}`}
                                    className={styles['board-row']}
                                    title={`${req.path.id} - ${req.path.type_name}`}
                                    message={content.content}
                                />
                            );
                        case 'Loading':
                            return (
                                <MetaRowPlaceholder
                                    key={`${index}${req.base}${content.type}`}
                                    className={styles['board-row-placeholder']}
                                />
                            );
                    }
                })}
            </div>
        </div>
    );
};

module.exports = Board;
