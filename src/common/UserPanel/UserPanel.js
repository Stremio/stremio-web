import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Icon from 'stremio-icons/dom';
import styles from './styles';

class UserPanel extends Component {
    renderPhoto() {
        if(this.props.photo.length === 0) {
            return null;
        }

        return (
            <div className={styles['profile-picture']} style={{ backgroundImage: 'url('+ this.props.photo +')'}}></div>
        );
    }

    renderEmail() {
        if(this.props.email.length === 0) {
            return null;
        }
        
         return (
            <div className={styles['email']}>{this.props.email}</div>
        );
    }

    renderLogout() {
        return (
            <span className={styles['log-out']}>Log out</span>
        );
    }

    renderFullscreen() {
        return (
            <div className={styles['fullscreen-option']}>
                <Icon className={styles['fullscreen-icon']} icon={'ic_fullscreen'}/>Fullscreen mode
            </div>
        );
    }

    renderOptions() {
        return (
            <ul className={styles['options']}>
                <li className={styles['settings-option']}>
                    <Icon className={styles['settings-icon']} icon={'ic_settings'}/>Settings
                </li>
                <li className={styles['addons-option']}>
                    <Icon className={styles['addons-icon']} icon={'ic_addons'}/>Add-ons
                </li>
                <li className={styles['magnet-option']}>
                    <Icon className={styles['magnet-icon']} icon={'ic_magnet'}/>Play Magnet Link
                </li>
                <li className={styles['facebook-option']}>
                    <Icon className={styles['facebook-icon']} icon={'ic_facebook'}/>Import from Facebook
                </li>
                <li className={styles['help-option']}>
                    <Icon className={styles['help-icon']} icon={'ic_help'}/>Help & Feedback
                </li>
            </ul>
        );
    }

    renderInfo() {
        return (
            <ul className={styles['info']}>
                <li className={styles['terms-label']}>Terms of Service</li>
                <li className={styles['about-label']}>About Stremio</li>
            </ul>
        );
    }

    render() {
        return (
            <div className={styles['user-panel']}>
                <div className={styles['user-info']}>
                    {this.renderPhoto()}
                    <div className={styles['profile-info']}>
                        {this.renderEmail()}
                        {this.renderLogout()}
                    </div>
                </div>
                {this.renderFullscreen()}
                {this.renderOptions()}
                {this.renderInfo()}
            </div>
        );
    }
}

UserPanel.propTypes = {
    photo: PropTypes.string.isRequired,
    email: PropTypes.string.isRequired
};
UserPanel.defaultProps = {
    photo: '',
    email: ''
};

export default UserPanel;