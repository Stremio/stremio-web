import React from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import { Input } from 'stremio-common';
import Icon from 'stremio-icons/dom';
import styles from './styles';

const MAX_DESCRIPTION_SYMBOLS = 200;

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
        <div className={styles['version']}>v. {version}</div>
    );
}

const renderType = (types) => {
    if (types.length === 0) {
        return null;
    }

    return (
        <div className={styles['types']}>
            {types.length <= 1 ? types.join('') : types.slice(0, -1).join(', ') + ' & ' + types[types.length - 1]}
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

const InstallAddonDialog = (props) => {
    return (
        <div className={styles['install-addon-dialog']}>
            <Input className={styles['x-container']} type={'button'}>
                <Icon className={styles['icon']} icon={'ic_x'} onClick={props.onClose} />
            </Input>
            <div className={styles['info-container']}>
                <div className={styles['install-label']}>Install Add-on</div>
                <div className={styles['basic-info']}>
                    <div className={styles['logo-container']}>
                        <Icon className={styles['logo']} icon={props.logo.length === 0 ? 'ic_addons' : props.logo} />
                    </div>
                    <div className={styles['header-container']}>
                        <div className={styles['header']}>
                            {renderName(props.name)}
                            {renderVersion(props.version)}
                        </div>
                    </div>
                </div>
                {renderType(props.types)}
                {renderDescription(props.description)}
                <div className={styles['notice']}>
                    Using third-party add-ons will always be subject to your responsibility and the governing law of the jurisdiction you are located.
                </div>
                <div className={styles['buttons']}>
                    <Input className={classnames(styles['button'], styles['cancel-button'])} type={'button'} onClick={props.onClose}>
                        <div className={styles['label']}>Cancel</div>
                    </Input>
                    <Input className={classnames(styles['button'], styles['install-button'])} type={'button'} onClick={props.onInstallClicked} >
                        <div className={styles['label']}>Install</div>
                    </Input>
                </div>
            </div>
        </div>
    );
}

InstallAddonDialog.propTypes = {
    className: PropTypes.string,
    logo: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
    version: PropTypes.string.isRequired,
    types: PropTypes.arrayOf(PropTypes.string).isRequired,
    description: PropTypes.string.isRequired,
    onClose: PropTypes.func.isRequired,
    onInstallClicked: PropTypes.func.isRequired
};
InstallAddonDialog.defaultProps = {
    logo: '',
    name: '',
    version: '',
    types: [],
    description: ''
};

export default InstallAddonDialog;
