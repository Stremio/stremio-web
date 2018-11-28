import React from 'react';
import PropTypes from 'prop-types';
import Icon from 'stremio-icons/dom';
import styles from './styles';

const renderAvatar = (avatar, email) => {
    if (email.length === 0) {
        return (
            <div style={{ backgroundImage: `url('/images/anonymous.png')` }} className={styles['avatar']} />
        );
    }

    return (
        <div style={{ backgroundImage: `url('${avatar}'), url('/images/default_avatar.png') ` }} className={styles['avatar']} />
    );
}

const renderEmail = (email) => {
    return (
        <div className={styles['email']}>{email.length === 0 ? 'Anonymous' : email}</div>
    );
}

const UserPanel = (props) => {
    return (
        <div className={styles['user-panel']}>
            <div className={styles['user-info']}>
                {renderAvatar(props.avatar, props.email)}
                {renderEmail(props.email)}
                <div onClick={props.email.length === 0 ? props.login : props.logout} className={styles['logging']}>{props.email.length === 0 ? 'Log in' : 'Log out'}</div>
            </div>
            <div className={styles['separator']}></div>
            <div onClick={props.resizeWindow} className={styles['option']}>
                <Icon className={styles['icon']} icon={'ic_fullscreen'} />Fullscreen mode
            </div>
            <div className={styles['separator']}></div>
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
            <div className={styles['separator']}></div>
            <a href={'https://www.stremio.com/tos'} target={'_blank'} className={styles['option']}>Terms of Service</a>
            <a href={'https://www.stremio.com'} target={'_blank'} className={styles['option']}>About Stremio</a>
        </div>
    );
}

UserPanel.propTypes = {
    avatar: PropTypes.string.isRequired,
    email: PropTypes.string.isRequired,
    login: PropTypes.func,
    logout: PropTypes.func,
    resizeWindow: PropTypes.func,
    playMagnetLink: PropTypes.func,
};
UserPanel.defaultProps = {
    avatar: '',
    email: ''
};

export default UserPanel;
