// Copyright (C) 2017-2023 Smart code 203358507

const React = require('react');
const PropTypes = require('prop-types');
const classnames = require('classnames');
const { useTranslation } = require('react-i18next');
const Button = require('stremio/common/Button');
const styles = require('./styles');

const MetaLinks = ({ className, label, links }) => {
    const { t } = useTranslation();
    return (
        <div className={classnames(className, styles['meta-links-container'])}>
            {
                typeof label === 'string' && label.length > 0 ?
                    <div className={styles['label-container']}>
                        {t(`LINKS_${label.toUpperCase()}`)}
                    </div>
                    :
                    null
            }
            {
                Array.isArray(links) && links.length > 0 ?
                    <div className={styles['links-container']}>
                        {links.map(({ label, href }, index) => (
                            <Button key={index} className={styles['link-container']} title={label} href={href}>
                                { t(label) }
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
    label: PropTypes.string,
    links: PropTypes.arrayOf(PropTypes.shape({
        label: PropTypes.string,
        href: PropTypes.string
    }))
};

module.exports = MetaLinks;
