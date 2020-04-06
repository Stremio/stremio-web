const React = require('react');
const ReactIs = require('react-is');
const PropTypes = require('prop-types');
const classnames = require('classnames');
const Icon = require('stremio-icons/dom');
const Button = require('stremio/common/Button');
const CONSTANTS = require('stremio/common/CONSTANTS');
const MetaRowPlaceholder = require('./MetaRowPlaceholder');
const styles = require('./styles');

const MetaRow = ({ className, title, message, items, itemComponent, deepLinks }) => {
    return (
        <div className={classnames(className, styles['meta-row-container'])}>
            {
                (typeof title === 'string' && title.length > 0) || (deepLinks && typeof deepLinks.discover === 'string') ?
                    <div className={styles['header-container']}>
                        {
                            typeof title === 'string' && title.length > 0 ?
                                <div className={styles['title-container']} title={title}>{title}</div>
                                :
                                null
                        }
                        {
                            deepLinks && typeof deepLinks.discover === 'string' ?
                                <Button className={styles['see-all-container']} title={'SEE ALL'} href={deepLinks.discover}>
                                    <div className={styles['label']}>SEE ALL</div>
                                    <Icon className={styles['icon']} icon={'ic_arrow_thin_right'} />
                                </Button>
                                :
                                null
                        }
                    </div>
                    :
                    null
            }
            {
                typeof message === 'string' && message.length > 0 ?
                    <div className={styles['message-container']} title={message}>{message}</div>
                    :
                    <div className={styles['meta-items-container']}>
                        {
                            ReactIs.isValidElementType(itemComponent) ?
                                items.slice(0, CONSTANTS.CATALOG_PREVIEW_SIZE).map((item, index) => {
                                    return React.createElement(itemComponent, {
                                        ...item,
                                        key: index,
                                        className: classnames(styles['meta-item'], styles['poster-shape-poster'], styles[`poster-shape-${item.posterShape}`])
                                    });
                                })
                                :
                                null
                        }
                        {Array(Math.max(0, CONSTANTS.CATALOG_PREVIEW_SIZE - items.length)).fill(null).map((_, index) => (
                            <div key={index} className={classnames(styles['meta-item'], styles['poster-shape-poster'])} />
                        ))}
                    </div>
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
    itemComponent: PropTypes.elementType,
    deepLinks: PropTypes.shape({
        discover: PropTypes.string
    })
};

module.exports = MetaRow;
