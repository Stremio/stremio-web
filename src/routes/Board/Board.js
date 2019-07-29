const React = require('react');
const { MainNavBar } = require('stremio/common');
const BoardRow = require('./BoardRow');
const useCatalogs = require('./useCatalogs');
const styles = require('./styles');

const CONTINUE_WATCHING_MENU = [
    {
        label: 'Play',
        type: 'play'
    },
    {
        label: 'Dismiss',
        type: 'dismiss'
    }
];

const Board = () => {
    const catalogs = useCatalogs();
    return (
        <div className={styles['board-container']}>
            <MainNavBar className={styles['nav-bar']} />
            <div className={styles['board-content']} tabIndex={-1}>
                {catalogs.map((catalog) => (
                    <BoardRow
                        key={catalog.id}
                        className={styles['addon-catalog-row']}
                        title={catalog.title}
                        items={catalog.items}
                    />
                ))}
            </div>
        </div>
    );
};

module.exports = Board;
