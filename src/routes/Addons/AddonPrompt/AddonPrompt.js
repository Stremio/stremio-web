const React = require('react');
const PropTypes = require('prop-types');
const classnames = require('classnames');
const styles = require('./styles');

const AddonPrompt = ({ className, id, name, logo, description, types, catalogs, version, transportUrl, official }) => {
    return (
        <div className={classnames(className, styles['addon-prompt-container'])}>
            <div className={classnames(styles['title-container'], { [styles['title-with-logo-container']]: typeof logo === 'string' && logo.length > 0 })}>
                {
                    typeof logo === 'string' && logo.length > 0 ?
                        <div className={styles['logo-container']}>
                            <img className={styles['logo']} src={logo} alt={' '} />
                        </div>
                        :
                        null
                }
                {typeof name === 'string' && name.length > 0 ? name : id}
                {' '}
                {
                    typeof version === 'string' && version.length > 0 ?
                        <span className={styles['version-container']}>v.{version}</span>
                        :
                        null
                }
            </div>
            {
                typeof description === 'string' && description.length > 0 ?
                    <div className={styles['section-container']}>
                        <span className={styles['section-header']}>{description}</span>
                    </div>
                    :
                    null
            }
            {
                typeof transportUrl === 'string' && transportUrl.length > 0 ?
                    <div className={styles['section-container']}>
                        <span className={styles['section-header']}>URL: </span>
                        <span className={classnames(styles['section-label'], styles['transport-url-label'])}>{transportUrl}</span>
                    </div>
                    :
                    null
            }
            {
                Array.isArray(types) && types.length > 0 ?
                    <div className={styles['section-container']}>
                        <span className={styles['section-header']}>Supported types: </span>
                        <span className={styles['section-label']}>
                            {
                                types.length === 1 ?
                                    types[0]
                                    :
                                    types.slice(0, -1).join(', ') + ' & ' + types[types.length - 1]
                            }
                        </span>
                    </div>
                    :
                    null
            }
            {
                Array.isArray(catalogs) && catalogs.length > 0 ?
                    <div className={styles['section-container']}>
                        <span className={styles['section-header']}>Supported catalogs: </span>
                        <span className={styles['section-label']}>
                            {
                                catalogs.length === 1 ?
                                    catalogs[0].name
                                    :
                                    catalogs.slice(0, -1).map(({ name }) => name).join(', ') + ' & ' + catalogs[catalogs.length - 1].name
                            }
                        </span>
                    </div>
                    :
                    null
            }
            {
                !official ?
                    <div className={styles['section-container']}>
                        <div className={classnames(styles['section-label'], styles['disclaimer-label'])}>Using third-party add-ons will always be subject to your responsibility and the governing law of the jurisdiction you are located.</div>
                    </div>
                    :
                    null
            }
        </div>
    );
};

AddonPrompt.propTypes = {
    className: PropTypes.string,
    id: PropTypes.string,
    name: PropTypes.string,
    logo: PropTypes.string,
    description: PropTypes.string,
    types: PropTypes.arrayOf(PropTypes.string),
    catalogs: PropTypes.arrayOf(PropTypes.shape({
        name: PropTypes.string
    })),
    version: PropTypes.string,
    transportUrl: PropTypes.string,
    official: PropTypes.bool
};

module.exports = AddonPrompt;
