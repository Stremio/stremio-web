const React = require('react');
const PropTypes = require('prop-types');
const classnames = require('classnames');
const Button = require('stremio/common/Button');
const styles = require('./styles');

const MetaLinks = ({ className, category, links }) => {
    return (
        <div className={classnames(className, styles['meta-links-container'])}>
            {
                typeof category === 'string' && category.length > 0 ?
                    <div className={styles['category-container']}>{category}:</div>
                    :
                    null
            }
            {
                Array.isArray(links) && links.length > 0 ?
                    <div className={styles['links-container']}>
                        {links.map(({ name, href }, index) => (
                            <Button key={index} className={styles['link-container']} title={name} tabIndex={-1} href={href}>
                                {name}
                                {index < links.length - 1 ? ',' : null}
                            </Button>
                        ))}
                    </div>
                    :
                    null
            }
        </div>
    );
};

MetaLinks.propTypes = {
    className: PropTypes.string,
    category: PropTypes.string,
    links: PropTypes.arrayOf(PropTypes.shape({
        name: PropTypes.string,
        href: PropTypes.string
    }))
};

module.exports = MetaLinks;
