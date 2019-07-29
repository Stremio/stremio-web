const React = require('react');
const classnames = require('classnames');
const Icon = require('stremio-icons/dom');
const { Input } = require('stremio-navigation');
const { MetaItem } = require('stremio/common');
const styles = require('./styles');

const BoardRow = ({ className, title, items, itemMenuOptions }) => {
    return (
        <div className={classnames(className, styles['board-row-container'])}>
            <div className={styles['title-container']}>
                <div className={styles['title']}>{title}</div>
            </div>
            <div className={styles['meta-items-container']}>
                {items.map((item) => (
                    <MetaItem
                        {...item}
                        key={item.id}
                        className={classnames(styles['meta-item'], styles[`poster-shape-${item.posterShape}`])}
                        menuClassName={styles['menu-container']}
                        title={item.name}
                        menuOptions={itemMenuOptions}
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
