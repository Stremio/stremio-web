const React = require('react');
const classnames = require('classnames');
const Icon = require('stremio-icons/dom');
const { Input } = require('stremio-navigation')
const { MetaItem, MainNavBar } = require('stremio/common');
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

const BoardRow = ({ className, items }) => {
    return (
        <div className={classnames(styles['board-row'], className)}>
            <div className={styles['meta-items-container']}>
                {items.map((item) => (
                    <MetaItem
                        {...item}
                        key={item.id}
                        title={item.name}
                        className={classnames(styles['meta-item'], styles[`poster-shape-${item.posterShape === 'landscape' ? 'square' : item.posterShape}`])}
                        menuClassName={styles['menu-container']}
                        posterShape={item.posterShape === 'landscape' ? 'square' : item.posterShape}
                        menuOptions={CONTINUE_WATCHING_MENU}
                    />
                ))}
            </div>
            <Input className={classnames(styles['show-more-container'], 'focusable-with-border')} type={'button'} title={'SHOW MORE'}>
                <div className={styles['label']}>SHOW MORE</div>
                <Icon className={styles['icon']} icon={'ic_arrow_thin_right'} />
            </Input>
        </div>
    );
};

const Board = () => {
    const [resumeCatalog, ...addonCatalogs] = useCatalogs();
    return (
        <div className={styles['board-container']}>
            <MainNavBar className={styles['nav-bar']} />
            <div className={styles['board-content']} tabIndex={-1}>
                {
                    resumeCatalog && Array.isArray(resumeCatalog.items) && resumeCatalog.items.length > 0 ?
                        <BoardRow className={styles['continue-watching-row']} items={resumeCatalog.items} />
                        :
                        null
                }
                {
                    addonCatalogs.map((catalog) => (
                        <BoardRow key={catalog.id} className={styles['addon-catalog-row']} items={catalog.items} />
                    ))
                }
            </div>
        </div>
    );
};

module.exports = Board;
