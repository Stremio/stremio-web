const React = require('react');
const PropTypes = require('prop-types');
const classnames = require('classnames');
const Icon = require('stremio-icons/dom');
const Button = require('stremio/common/Button');
const CONSTANTS = require('stremio/common/CONSTANTS');
const styles = require('./styles');

const MetaRowPlaceholder = ({ className, title, deepLinks }) => {
    return (
        <div className={classnames(className, styles['meta-row-placeholder-container'])}>
            <div className={styles['header-container']}>
                <div className={styles['title-container']} title={typeof title === 'string' && title.length > 0 ? title : null}>
                    {typeof title === 'string' && title.length > 0 ? title : null}
                </div>
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
            <div className={styles['meta-items-container']}>
                {Array(CONSTANTS.CATALOG_PREVIEW_SIZE).fill(null).map((_, index) => (
                    <div key={index} className={styles['meta-item']}>
                        <div className={styles['poster-container']} />
                        <div className={styles['title-bar-container']}>
                            <div className={styles['title-label']} />
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

MetaRowPlaceholder.propTypes = {
    className: PropTypes.string,
    title: PropTypes.string,
    deepLinks: PropTypes.shape({
        discover: PropTypes.string
    })
};

module.exports = MetaRowPlaceholder;
