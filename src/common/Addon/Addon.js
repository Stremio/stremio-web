import React from 'react';
import PropTypes from 'prop-types';
import Icon from 'stremio-icons/dom';
import styles from './styles';

const renderName = (name) => {
    if (name.length === 0) {
        return null;
    }

    return (
        <span className={styles['name']}>{name}</span>
    );
}

const renderVersion = (version) => {
    if (version.length === 0) {
        return null;
    }

    return (
        <div className={styles['version-container']}>
            <div className={styles['version']}>{'v. ' + version}</div>
        </div>
    );
}

const renderType = (types) => {
    if (types.length === 0) {
        return null;
    }

    return (
        <div className={styles['type']}>
            {types.length <= 1 ? types.join('') : types.slice(0, -1).join(', ') + ' & ' + types[types.length - 1]}
        </div>
    );
}

const renderDescription = (description) => {
    if (description.length === 0) {
        return null;
    }

    return (
        <div style={description.length > 150 ? { overflow: 'auto', height: 36 } : null} className={styles['description']}>{description}</div>
    );
}

const renderUrls = (urls) => {
    if(urls.length === 0) {
        return null;
    }

    return (
        <div className={styles['urls-container']}>
            {urls.map((url) => {
                return (
                    <span key={url} className={styles['url']}>{url}</span>
                );
            })}
        </div>
    );
}

const Addon = (props) => {
    return (
        <div className={styles['addon']}>
            <div className={styles['info-container']}>
                <div className={styles['logo-container']}>
                    <Icon className={styles['logo']} icon={props.logo.length === 0 ? 'ic_addons' : props.logo} />
                </div>
                <div className={styles['header']}>
                    {renderName(props.name)}
                    {renderVersion(props.version)}
                </div>
                {renderType(props.types)}
                {renderDescription(props.description)}
            </div>
            {renderUrls(props.urls)}
            <div className={styles['buttons']}>
                <div onClick={props.shareAddon} className={styles['share-container']}>
                    <Icon className={styles['share-icon']} icon={'ic_share'} />
                    <span className={styles['share-label']}>SHARE ADD-ON</span>
                </div>
                <div onClick={props.onToggleClicked} className={styles[props.isInstalled ? 'install-label' : 'uninstall-label']}>{props.isInstalled ? 'Install' : 'Uninstall'}</div>
            </div>
        </div>
    );
}

Addon.propTypes = {
    logo: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
    version: PropTypes.string.isRequired,
    types: PropTypes.array.isRequired,
    description: PropTypes.string.isRequired,
    urls: PropTypes.arrayOf(PropTypes.string).isRequired,
    isInstalled: PropTypes.bool.isRequired,
    shareAddon: PropTypes.func,
    onToggleClicked: PropTypes.func
};
Addon.defaultProps = {
    logo: '',
    name: '',
    version: '',
    types: [],
    description: '',
    urls: [],
    isInstalled: false
};

export default Addon;