const React = require('react');
const PropTypes = require('prop-types');
const classnames = require('classnames');
const styles = require('./styles');

const BoardRowPlaceholder = ({ className }) => {
    return (
        <div className={classnames(className, styles['board-row-placeholder-container'])}>
            <div className={styles['title-container']}>
                <div className={styles['title-label-container']} />
            </div>
            <div className={styles['meta-items-container']}>
                <div className={styles['meta-item']}>
                    <div className={styles['poster-container']} />
                </div>
                <div className={styles['meta-item']}>
                    <div className={styles['poster-container']} />
                </div>
                <div className={styles['meta-item']}>
                    <div className={styles['poster-container']} />
                </div>
                <div className={styles['meta-item']}>
                    <div className={styles['poster-container']} />
                </div>
                <div className={styles['meta-item']}>
                    <div className={styles['poster-container']} />
                </div>
                <div className={styles['meta-item']}>
                    <div className={styles['poster-container']} />
                </div>
                <div className={styles['meta-item']}>
                    <div className={styles['poster-container']} />
                </div>
                <div className={styles['meta-item']}>
                    <div className={styles['poster-container']} />
                </div>
                <div className={styles['meta-item']}>
                    <div className={styles['poster-container']} />
                </div>
                <div className={styles['meta-item']}>
                    <div className={styles['poster-container']} />
                </div>
            </div>
        </div>
    );
};

BoardRowPlaceholder.propTypes = {
    className: PropTypes.string
};

module.exports = BoardRowPlaceholder;
