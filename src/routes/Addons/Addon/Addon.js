import React from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import Icon from 'stremio-icons/dom';
import styles from './styles';

const MAX_DESCRIPTION_SYMBOLS = 500;

const renderName = (name) => {
    if (name.length === 0) {
        return null;
    }

    return (
        <div className={styles['name']}>{name}</div>
    );
}

const renderVersion = (version) => {
    if (version.length === 0) {
        return null;
    }

    return (
        <div className={styles['version']}>{'v. ' + version}</div>
    );
}

const renderType = (types) => {
    if (types.length === 0) {
        return null;
    }

    return (
        <div className={styles['types-container']}>
            <div className={styles['type']}>
                {types.length <= 1 ? types.join('') : types.slice(0, -1).join(', ') + ' & ' + types[types.length - 1]}
            </div>
        </div>
    );
}

const renderDescription = (description) => {
    if (description.length === 0) {
        return null;
    }

    return (
        <div className={styles['description']}>{description.length > MAX_DESCRIPTION_SYMBOLS ? description.slice(0, MAX_DESCRIPTION_SYMBOLS) + '...' : description}</div>
    );
}

const Addon = (props) => {
    return (
        <div className={classnames(styles['addon'], props.className)}>
            <div className={styles['logo-container']}>
                <Icon className={styles['logo']} icon={props.logo.length === 0 ? 'ic_addons' : props.logo} />
            </div>
            <div className={styles['header-container']}>
                <div className={styles['header']}>
                    {renderName(props.name)}
                    {renderVersion(props.version)}
                </div>
            </div>
            {renderType(props.types)}
            {renderDescription(props.description)}
            <div className={styles['buttons']}>
                <div className={classnames(styles['button'], props.isInstalled ? styles['uninstall-button'] : styles['install-button'])} onClick={props.onToggleClicked}>
                    <span className={styles['label']}>{props.isInstalled ? 'Uninstall' : 'Install'}</span>
                </div>
                <div className={classnames(styles['button'], styles['share-button'])} onClick={props.shareAddon}>
                    <Icon className={styles['icon']} icon={'ic_share'} />
                    <span className={styles['label']}>SHARE ADD-ON</span>
                </div>
            </div>
        </div>
    );
}

Addon.propTypes = {
    className: PropTypes.string,
    logo: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
    version: PropTypes.string.isRequired,
    types: PropTypes.arrayOf(PropTypes.string).isRequired,
    description: PropTypes.string.isRequired,
    isOfficial: PropTypes.bool.isRequired,
    isInstalled: PropTypes.bool.isRequired,
    shareAddon: PropTypes.func.isRequired,
    onToggleClicked: PropTypes.func.isRequired
};
Addon.defaultProps = {
    logo: '',
    name: '',
    version: '',
    types: [],
    description: '',
    isOfficial: false,
    isInstalled: false
};

export default Addon;
