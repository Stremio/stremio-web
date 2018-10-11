import React from 'react';
import PropTypes from 'prop-types';
import Icon from 'stremio-icons/dom';
import styles from './styles';

const renderLogo = (logo) => {
    return (
        <div className={styles['logo-container']}>
            <Icon className={styles['logo']} icon={logo.length === 0 ? 'ic_addons' : logo} />
        </div>
    );
}

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
        <span className={styles['version']}>{'v. ' + version}</span>
    );
}

const renderType = (types) => {
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
        <div style={description.length > 150 ? { overflowY: 'scroll', height: 36 } : null} className={styles['description']}>{description}</div>
    );
}

const renderUrls = (urls) => {
    if (urls.length === 0) {
        return null;
    }

    return (
        <div className={styles['urls']}>
            {urls.map((url) => {
                return (
                    <span key={url} className={styles['url']}>{url}</span>
                );
            })}
        </div>
    );
}

const renderShareButton = (shareAddon) => {
    return (
        <div onClick={shareAddon} className={styles['share-container']}>
            <Icon className={styles['share-icon']} icon={'ic_share'} />
            <span className={styles['share-label']}>SHARE ADD-ON</span>
        </div>
    );
}

const renderState = (onToggleClicked, isInstalled) => {
    return (
        <div onClick={onToggleClicked} className={styles[isInstalled ? 'install-label' : 'uninstall-label']}>{isInstalled ? 'Install' : 'Uninstall'}</div>
    );
}

const Addon = (props) => {
    return (
        <div className={styles['addon']}>
            {renderLogo(props.logo)}
            {renderName(props.name)}
            {renderVersion(props.version)}
            {renderType(props.types)}
            {renderDescription(props.description)}
            {renderUrls(props.urls)}
            <div className={styles['buttons']}>
                {renderShareButton(props.shareAddon)}
                {renderState(props.onToggleClicked, props.isInstalled)}
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
    isInstalled: false
};

export default Addon;