const React = require('react');
const PropTypes = require('prop-types');
const classnames = require('classnames');
const Icon = require('stremio-icons/dom');
const Button = require('stremio/common/Button');
const MetaItem = require('./MetaItem');
const styles = require('./styles');

const MetaRow = ({ className, title, message, items, itemMenuOptions }) => {
    return (
        <div className={classnames(className, styles['meta-row-container'])}>
            {
                typeof title === 'string' && title.length > 0 ?
                    <div className={styles['title-container']}>{title}</div>
                    :
                    null
            }
            {
                typeof message === 'string' && message.length > 0 ?
                    <div className={styles['message-container']}>{message}</div>
                    :
                    null
            }
            {
                Array.isArray(items) && items.length > 0 ?
                    <React.Fragment>
                        <div className={styles['meta-items-container']}>
                            {items.map((item) => (
                                <MetaItem
                                    {...item}
                                    key={item.id}
                                    className={classnames(styles['meta-item'], styles['poster-shape-poster'], styles[`poster-shape-${item.posterShape}`])}
                                    title={item.name}
                                    menuOptions={itemMenuOptions}
                                />
                            ))}
                            <div className={classnames(styles['meta-item'], styles['poster-shape-poster'], styles[`poster-shape-${items[0].posterShape}`])} />
                            <div className={classnames(styles['meta-item'], styles['poster-shape-poster'], styles[`poster-shape-${items[0].posterShape}`])} />
                            <div className={classnames(styles['meta-item'], styles['poster-shape-poster'], styles[`poster-shape-${items[0].posterShape}`])} />
                            <div className={classnames(styles['meta-item'], styles['poster-shape-poster'], styles[`poster-shape-${items[0].posterShape}`])} />
                            <div className={classnames(styles['meta-item'], styles['poster-shape-poster'], styles[`poster-shape-${items[0].posterShape}`])} />
                            <div className={classnames(styles['meta-item'], styles['poster-shape-poster'], styles[`poster-shape-${items[0].posterShape}`])} />
                            <div className={classnames(styles['meta-item'], styles['poster-shape-poster'], styles[`poster-shape-${items[0].posterShape}`])} />
                            <div className={classnames(styles['meta-item'], styles['poster-shape-poster'], styles[`poster-shape-${items[0].posterShape}`])} />
                            <div className={classnames(styles['meta-item'], styles['poster-shape-poster'], styles[`poster-shape-${items[0].posterShape}`])} />
                            <div className={classnames(styles['meta-item'], styles['poster-shape-poster'], styles[`poster-shape-${items[0].posterShape}`])} />
                        </div>
                        <Button className={styles['see-all-container']} title={'SEE ALL'}>
                            <div className={styles['see-all-label']}>SEE ALL</div>
                            <Icon className={styles['icon']} icon={'ic_arrow_thin_right'} />
                        </Button>
                    </React.Fragment>
                    :
                    null
            }
        </div>
    );
};

MetaRow.propTypes = {
    className: PropTypes.string,
    title: PropTypes.string,
    message: PropTypes.string,
    items: PropTypes.arrayOf(PropTypes.shape({
        id: PropTypes.string.isRequired,
        name: PropTypes.string.isRequired,
        posterShape: PropTypes.string
    })),
    itemMenuOptions: PropTypes.array
};

module.exports = MetaRow;
