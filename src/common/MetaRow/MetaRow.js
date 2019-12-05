const React = require('react');
const PropTypes = require('prop-types');
const classnames = require('classnames');
const Icon = require('stremio-icons/dom');
const Button = require('stremio/common/Button');
const MetaItem = require('stremio/common/MetaItem');
const MetaRowPlaceholder = require('./MetaRowPlaceholder');
const styles = require('./styles');

const MetaRow = ({ className, title, message, items, limit, href }) => {
    items = Array.isArray(items) ? items.slice(0, limit) : [];
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
                    <div className={styles['content-container']}>
                        <div className={styles['meta-items-container']}>
                            {items.map(({ type, name, poster, posterShape, playIcon, progress, menuOptions, dataset, onSelect, menuOptionOnSelect }, index) => (
                                <MetaItem
                                    key={index}
                                    className={classnames(styles['meta-item'], styles['poster-shape-poster'], styles[`poster-shape-${posterShape}`])}
                                    type={type}
                                    name={name}
                                    poster={poster}
                                    posterShape={posterShape}
                                    playIcon={playIcon}
                                    progress={progress}
                                    menuOptions={menuOptions}
                                    dataset={dataset}
                                    onSelect={onSelect}
                                    menuOptionOnSelect={menuOptionOnSelect}
                                />
                            ))}
                            {Array(limit - items.length).fill(null).map((_, index) => (
                                <div key={index} className={classnames(styles['meta-item'], styles['poster-shape-poster'])} />
                            ))}
                        </div>
                        {
                            typeof href === 'string' && href.length > 0 ?
                                <Button className={styles['see-all-container']} title={'SEE ALL'} href={href}>
                                    <div className={styles['label']}>SEE ALL</div>
                                    <Icon className={styles['icon']} icon={'ic_arrow_thin_right'} />
                                </Button>
                                :
                                null
                        }
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
    limit: PropTypes.number.isRequired,
    href: PropTypes.string
};

module.exports = MetaRow;
