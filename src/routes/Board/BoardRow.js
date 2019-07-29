const React = require('react');
const PropTypes = require('prop-types');
const classnames = require('classnames');
const Icon = require('stremio-icons/dom');
const { Input } = require('stremio-navigation');
const { MetaItem } = require('stremio/common');
const styles = require('./styles');

const BoardRow = ({ title, items = [], itemMenuOptions = [] }) => {
    return (
        <div className={styles['board-row']}>
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

BoardRow.propTypes = {
    title: PropTypes.string,
    items: PropTypes.arrayOf(PropTypes.shape({
        id: PropTypes.string.isRequired,
        posterShape: PropTypes.string.isRequired
    })),
    itemMenuOptions: PropTypes.array
};

module.exports = BoardRow;
