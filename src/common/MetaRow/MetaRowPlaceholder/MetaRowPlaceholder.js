const React = require('react');
const PropTypes = require('prop-types');
const classnames = require('classnames');
const styles = require('./styles');

const MetaRowPlaceholder = ({ className, title, maximumItemsCount }) => {
    maximumItemsCount = maximumItemsCount !== null && isFinite(maximumItemsCount) ? maximumItemsCount : 20;
    return (
        <div className={classnames(className, styles['meta-row-placeholder-container'])}>
            <div className={styles['title-container']} title={title}>{title}</div>
            <div className={styles['meta-items-container']}>
                {Array(maximumItemsCount).fill(null).map((_, index) => (
                    <div key={index} className={styles['meta-item']}>
                        <div className={styles['poster-container']} />
                        <div className={styles['title-bar-container']} />
                    </div>
                ))}
            </div>
            <div className={styles['see-all-container']} />
        </div>
    );
};

MetaRowPlaceholder.propTypes = {
    className: PropTypes.string,
    title: PropTypes.string,
    maximumItemsCount: PropTypes.number
};

module.exports = MetaRowPlaceholder;
