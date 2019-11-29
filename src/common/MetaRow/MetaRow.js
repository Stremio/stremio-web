const React = require('react');
const PropTypes = require('prop-types');
const classnames = require('classnames');
const Icon = require('stremio-icons/dom');
const Button = require('stremio/common/Button');
const MetaItem = require('stremio/common/MetaItem');
const MetaRowPlaceholder = require('./MetaRowPlaceholder');
const styles = require('./styles');

const MetaRow = ({ className, title, message, items, maximumItemsCount, itemMenuOptions, onSeeAllButtonClicked }) => {
    maximumItemsCount = maximumItemsCount !== null && isFinite(maximumItemsCount) ? maximumItemsCount : 20;
    items = Array.isArray(items) ? items.slice(0, maximumItemsCount) : [];
    return (
        <div className={classnames(className, styles['meta-row-container'])}>
            {
                typeof title === 'string' && title.length > 0 ?
                    <div className={styles['title-container']} title={title}>{title}</div>
                    :
                    null
            }
            {
                typeof message === 'string' && message.length > 0 ?
                    <div className={styles['message-container']} title={message}>{message}</div>
                    :
                    <React.Fragment>
                        <div className={styles['meta-items-container']}>
                            {items.map((item, index) => (
                                <MetaItem
                                    {...item}
                                    key={index}
                                    data-id={item.id}
                                    data-type={item.type}
                                    className={classnames(styles['meta-item'], styles['poster-shape-poster'], styles[`poster-shape-${item.posterShape}`])}
                                    menuOptions={itemMenuOptions}
                                />
                            ))}
                            {Array(Math.max(maximumItemsCount - items.length, 0)).fill(null).map((_, index) => (
                                <div key={index} className={classnames(styles['meta-item'], styles['poster-shape-poster'])} />
                            ))}
                        </div>
                        <Button className={styles['see-all-container']} title={'SEE ALL'} onClick={onSeeAllButtonClicked}>
                            <div className={styles['label']}>SEE ALL</div>
                            <Icon className={styles['icon']} icon={'ic_arrow_thin_right'} />
                        </Button>
                    </React.Fragment>
            }
        </div>
    );
};

MetaRow.Placeholder = MetaRowPlaceholder;

MetaRow.propTypes = {
    className: PropTypes.string,
    title: PropTypes.string,
    message: PropTypes.string,
    items: PropTypes.arrayOf(PropTypes.shape({
        posterShape: PropTypes.string
    })),
    maximumItemsCount: PropTypes.number,
    itemMenuOptions: PropTypes.any,
    onSeeAllButtonClicked: PropTypes.func
};

module.exports = MetaRow;
