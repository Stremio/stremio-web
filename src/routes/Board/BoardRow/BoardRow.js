const React = require('react');
const classnames = require('classnames');
const Icon = require('stremio-icons/dom');
const { Input } = require('stremio-navigation');
const { MetaItem } = require('stremio/common');
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

const BoardRow = ({ className, metaItemClassName, menuClassName, items }) => {
    return (
        <div className={classnames(styles['board-row-container'], className)}>
            <div className={styles['meta-items-container']}>
                {items.map((item) => (
                    <MetaItem
                        {...item}
                        key={item.id}
                        className={classnames(styles['meta-item'], styles[`poster-shape-${item.posterShape}`], metaItemClassName)}
                        menuClassName={classnames(styles['menu-container'], menuClassName)}
                        title={item.name}
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

module.exports = BoardRow;
