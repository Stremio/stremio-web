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
    const placeholderIconUrl = iconDataUrl({ icon: 'ic_user', fill: colors.accent });
    const avatarStyle = {
        backgroundImage: `url('${props.avatar}'), url('${placeholderIconUrl}')`
    };

    return (
        <div className={styles['user-panel']}>
            <div className={styles['user-info']}>
                <div style={avatarStyle} className={styles['avatar']} />
                {renderEmail(props.email)}
                <div onClick={props.logout} className={styles['log-out']}>Log out</div>
            </div>
            <div onClick={props.resizeWindow} className={styles['option']}>
                <Icon className={styles['icon']} icon={'ic_fullscreen'} />Fullscreen mode
            </div>
            <div className={styles['options']}>
                <a href={'#settings'} className={styles['option']}>
                    <Icon className={styles['icon']} icon={'ic_settings'} />Settings
                </a>
                <a href={'#addons'} className={styles['option']}>
                    <Icon className={styles['icon']} icon={'ic_addons'} />Add-ons
                </a>
                <div onClick={props.playMagnetLink} className={styles['option']}>
                    <Icon className={styles['icon']} icon={'ic_magnet'} />Play Magnet Link
                </div>
                <a href={'https://stremio.zendesk.com'} target={'_blank'} className={styles['option']}>
                    <Icon className={styles['icon']} icon={'ic_help'} />Help & Feedback
                </a>
            </div>
            <div className={styles['footer']}>
                <a href={'https://www.stremio.com/tos'} target={'_blank'} className={styles['label']}>Terms of Service</a>
                <a href={'https://www.stremio.com'} target={'_blank'} className={styles['label']}>About Stremio</a>
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
