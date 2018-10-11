import React from 'react';
import PropTypes from 'prop-types';
import Icon, { dataUrl as iconDataUrl } from 'stremio-icons/dom';
import colors from 'stremio-colors';
import styles from './styles';

const renderPhoto = (photo) => {
    const placeholderIconUrl = iconDataUrl({ icon: 'ic_user', fill: colors.accent, width: 34, height: 34 });
    const photoStyle = {
        backgroundImage: `url('${photo}'), url('${placeholderIconUrl}')`
    };

    return (
        <div style={photoStyle} className={styles['profile-picture']}></div>
    );
}

const renderEmail = (email) => {
    if (email.length === 0) {
        return null;
    }

    return (
        <div className={styles['email']}>{email}</div>
    );
}

const renderFullscreen = (onFullscreenMode) => {
    return (
        <div onClick={onFullscreenMode} className={styles['fullscreen-option']}>
            <Icon className={styles['fullscreen-icon']} icon={'ic_fullscreen'} />Fullscreen mode
        </div>
    );
}

const renderOptions = (showSettings, showAddons, playMagnetLink, importFromFB, showHelpCenter) => {
    return (
        <ul className={styles['options']}>
            <li onClick={showSettings} className={styles['settings-option']}>
                <Icon className={styles['settings-icon']} icon={'ic_settings'} />Settings
            </li>
            <li onClick={showAddons} className={styles['addons-option']}>
                <Icon className={styles['addons-icon']} icon={'ic_addons'} />Add-ons
            </li>
            <li onClick={playMagnetLink} className={styles['magnet-option']}>
                <Icon className={styles['magnet-icon']} icon={'ic_magnet'} />Play Magnet Link
            </li>
            <li onClick={importFromFB} className={styles['facebook-option']}>
                <Icon className={styles['facebook-icon']} icon={'ic_facebook'} />Import from Facebook
            </li>
            <li onClick={showHelpCenter} className={styles['help-option']}>
                <Icon className={styles['help-icon']} icon={'ic_help'} />Help & Feedback
            </li>
        </ul>
    );
}

const renderFooter = (showTermsOfService, showInfo) => {
    return (
        <ul className={styles['footer']}>
            <li onClick={showTermsOfService} className={styles['terms-label']}>Terms of Service</li>
            <li onClick={showInfo} className={styles['about-label']}>About Stremio</li>
        </ul>
    );
}

const UserPanel = (props) => {
    return (
        <div className={styles['user-panel']}>
            <div className={styles['user-info']}>
                {renderPhoto(props.photo)}
                <div className={styles['profile-info']}>
                    {renderEmail(props.email)}
                    <span onClick={props.logout} className={styles['log-out']}>Log out</span>
                </div>
            </div>
            {renderFullscreen(props.onFullscreenMode)}
            {renderOptions(props.showSettings, props.showAddons, props.playMagnetLink, props.importFromFB, props.showHelpCenter)}
            {renderFooter(props.showTermsOfService, props.showInfo)}
        </div>
    );
}

UserPanel.propTypes = {
    photo: PropTypes.string.isRequired,
    email: PropTypes.string.isRequired,
    logout: PropTypes.func,
    onFullscreenMode: PropTypes.func,
    showSettings: PropTypes.func,
    showAddons: PropTypes.func,
    playMagnetLink: PropTypes.func,
    importFromFB: PropTypes.func,
    showHelpCenter: PropTypes.func,
    showTermsOfService: PropTypes.func,
    showInfo: PropTypes.func
};
UserPanel.defaultProps = {
    photo: '',
    email: ''
};

export default UserPanel;