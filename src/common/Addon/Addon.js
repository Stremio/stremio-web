import React from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import Icon from 'stremio-icons/dom';
import styles from './styles';

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
        <div className={styles['description']}>{description}</div>
    );
}

const renderUrls = (urls) => {
    if (urls.length === 0) {
        return null;
    }

    return (
        <div className={styles['urls-container']}>
            {urls.map((url) => {
                return (
                    <div key={url} className={styles['url']}>{url}</div>
                );
            })}
        </div>
    );
}

const Addon = (props) => {
    return (
        <div className={styles['addon-container']}>
            <div className={styles['addon']}>
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
                {renderUrls(props.urls)}
                <div className={styles['buttons']}>
                    <div onClick={props.shareAddon} className={classnames(styles['button'], styles['share-button'])}>
                        <Icon className={styles['icon']} icon={'ic_share'} />
                        <span className={styles['label']}>SHARE ADD-ON</span>
                    </div>
                    <div onClick={props.onToggleClicked} className={classnames(styles['button'], props.isInstalled ? styles['install-button'] : styles['uninstall-button'])}>
                        <span className={styles['label']}>{props.isInstalled ? 'Install' : 'Uninstall'}</span>
                    </div>
                </div>
            </div>
        </div>
    );
}

Addon.propTypes = {
    logo: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
    version: PropTypes.string.isRequired,
    types: PropTypes.arrayOf(PropTypes.string).isRequired,
    description: PropTypes.string.isRequired,
    urls: PropTypes.arrayOf(PropTypes.string).isRequired,
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
    urls: [],
    isInstalled: false
};

export default Addon;