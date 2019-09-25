const React = require('react');
const PropTypes = require('prop-types');
const classnames = require('classnames');
const Icon = require('stremio-icons/dom');
const { Button } = require('stremio/common');
const styles = require('./styles');

const Addon = ({ className, id, name, logo, description, types, version, transportUrl, installed, toggle }) => {
    const onKeyUp = React.useCallback((event) => {
        if (event.key === 'Enter' && typeof toggle === 'function') {
            toggle(event);
        }
    }, [toggle]);
    return (
        <Button className={classnames(styles['addon-container'], className)} data-id={id} onKeyUp={onKeyUp}>
            <div className={styles['logo-container']}>
                {
                    typeof logo === 'string' && logo.length > 0 ?
                        <img className={styles['logo']} src={logo} alt={' '} />
                        :
                        <Icon className={styles['icon']} icon={'ic_addons'} />
                }
            </div>
            <div className={styles['info-container']}>
                <div className={styles['name-container']} title={typeof name === 'string' && name.length > 0 ? name : id}>
                    {typeof name === 'string' && name.length > 0 ? name : id}
                </div>
                {
                    typeof version === 'string' && version.length > 0 ?
                        <div className={styles['version-container']} title={`v.${version}`}>v.{version}</div>
                        :
                        null
                }
                {
                    Array.isArray(types) ?
                        <div className={styles['types-container']}>
                            {
                                types.length <= 1 ?
                                    types.join('')
                                    :
                                    types.slice(0, -1).join(', ') + ' & ' + types[types.length - 1]
                            }
                        </div>
                        :
                        null
                }
                {
                    typeof description === 'string' && description.length > 0 ?
                        <div className={styles['description-container']} title={description}>{description}</div>
                        :
                        null
                }
            </div>
            <div className={styles['buttons-container']}>
                <Button className={installed ? styles['uninstall-button-container'] : styles['install-button-container']} title={installed ? 'Uninstall' : 'Install'} tabIndex={-1} data-id={id} onClick={toggle}>
                    <div className={styles['label']}>{installed ? 'Uninstall' : 'Install'}</div>
                </Button>
                <Button className={styles['share-button-container']} title={'Share addon'} tabIndex={-1}>
                    <Icon className={styles['icon']} icon={'ic_share'} />
                    <div className={styles['label']}>Share addon</div>
                </Button>
            </div>
        </Button>
    );
};

Addon.propTypes = {
    className: PropTypes.string,
    id: PropTypes.string,
    name: PropTypes.string,
    logo: PropTypes.string,
    description: PropTypes.string,
    types: PropTypes.arrayOf(PropTypes.string),
    version: PropTypes.string,
    transportUrl: PropTypes.string,
    installed: PropTypes.bool,
    toggle: PropTypes.func
};

module.exports = Addon;
