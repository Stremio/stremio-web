import React from 'react';
import PropTypes from 'prop-types';
import Icon, { dataUrl as iconDataUrl } from 'stremio-icons/dom';
import colors from 'stremio-colors';
import styles from './styles';

const renderEmail = (email) => {
    if (email.length === 0) {
        return null;
    }

    return (
        <div className={styles['email']}>{email}</div>
    );
}

const UserPanel = (props) => {
    const placeholderIconUrl = iconDataUrl({ icon: 'ic_user', fill: colors.accent, width: 34, height: 34 });
    const avatarStyle = {
        backgroundImage: `url('${props.avatar}'), url('${placeholderIconUrl}')`
    };

    return (
        <div className={styles['user-panel']}>
            <div style={avatarStyle} className={styles['profile-picture']}></div>
            {renderEmail(props.email)}
            <span onClick={props.logout} className={styles['log-out']}>Log out</span>
            <div onClick={props.resizeWindow} className={styles['fullscreen-option']}>
                <Icon className={styles['fullscreen-icon']} icon={'ic_fullscreen'} />Fullscreen mode
            </div>
            <div className={styles['options']}>
                <a href={'#settings'} target="_blank" className={styles['settings-option']}>
                    <Icon className={styles['settings-icon']} icon={'ic_settings'} />Settings
                </a>
                <a href={'#addons'} target="_blank" className={styles['addons-option']}>
                    <Icon className={styles['addons-icon']} icon={'ic_addons'} />Add-ons
                </a>
                <div onClick={props.playMagnetLink} className={styles['magnet-option']}>
                    <Icon className={styles['magnet-icon']} icon={'ic_magnet'} />Play Magnet Link
                </div>
                <a href={'https://stremio.zendesk.com'} target="_blank" className={styles['help-option']}>
                    <Icon className={styles['help-icon']} icon={'ic_help'} />Help & Feedback
                </a>
            </div>
            <div className={styles['footer']}>
                <a href={'https://www.stremio.com/tos'} target="_blank" className={styles['terms-label']}>Terms of Service</a>
                <a href={'https://www.stremio.com'} target="_blank" className={styles['about-label']}>About Stremio</a>
            </div>
        </div>
    );
}

UserPanel.propTypes = {
    avatar: PropTypes.string.isRequired,
    email: PropTypes.string.isRequired,
    logout: PropTypes.func,
    resizeWindow: PropTypes.func,
    playMagnetLink: PropTypes.func,
};
UserPanel.defaultProps = {
    avatar: '',
    email: ''
};

export default UserPanel;