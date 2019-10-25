const React = require('react');
const PropTypes = require('prop-types');
const classnames = require('classnames');
const Icon = require('stremio-icons/dom');
const { useRouteFocused } = require('stremio-router');
const { Button } = require('stremio/common');
const styles = require('./styles');

const AddonPrompt = ({ className, id, name, logo, description, types, catalogs, version, transportUrl, installed, official, cancel, onClick }) => {
    const focusable = useRouteFocused();
    React.useEffect(() => {
        const onKeyUp = (event) => {
            if (event.key === 'Escape') {
                cancel();
            }
        };
        if (focusable) {
            window.addEventListener('keyup', onKeyUp);
        }
        return () => {
            window.removeEventListener('keyup', onKeyUp);
        };
    }, [cancel, focusable]);
    return (
        <div className={classnames(className, styles['addon-prompt-container'])} onClick={onClick}>
            <Button className={styles['close-button-container']} title={'Close'} tabIndex={-1} onClick={cancel}>
                <Icon className={styles['icon']} icon={'ic_x'} />
            </Button>
            <div className={styles['addon-prompt-content']}>
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
            <div className={styles['buttons-container']}>
                <Button className={classnames(styles['button-container'], styles['cancel-button'])} title={'Cancel'} onClick={cancel}>
                    <div className={styles['label']}>Cancel</div>
                </Button>
                <Button className={classnames(styles['button-container'], installed ? styles['uninstall-button'] : styles['install-button'])} title={installed ? 'Uninstall' : 'Install'}>
                    <div className={styles['label']}>{installed ? 'Uninstall' : 'Install'}</div>
                </Button>
            </div>
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
    installed: PropTypes.bool,
    official: PropTypes.bool,
    cancel: PropTypes.func
};

module.exports = AddonPrompt;
