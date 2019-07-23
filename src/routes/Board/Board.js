const React = require('react');
const classnames = require('classnames');
const { MainNavBar } = require('stremio/common');
const BoardRow = require('./BoardRow');
const useCatalogs = require('./useCatalogs');
const styles = require('./styles');

const Board = () => {
    const catalogs = useCatalogs();
    return (
        <div className={styles['board-container']}>
            <MainNavBar className={styles['nav-bar']} />
            <div className={styles['board-content']} tabIndex={-1}>
                {catalogs.map((catalog) => (
                    <BoardRow
                        key={catalog.id}
                        className={classnames(styles['board-row'], styles['addon-catalog-row'])}
                        metaItemClassName={styles['meta-item']}
                        menuClassName={styles['menu-container']}
                        title={catalog.title}
                        items={catalog.items}
                    />
                ))}
            </div>
        </div>
    );
};

module.exports = Board;
