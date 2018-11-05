import React, { Component } from 'react';
import PropTypes from 'prop-types';
import styles from './styles';
import SettingsExpanded from './SettingsExpanded';

class Settings extends Component {
    constructor(props) {
        super(props);

        this.state = {
            selectedMenu: 'player_preferences'
        }

        this.changeSettings = this.changeSettings.bind(this);
    }

    changeSettings(selectedMenu) {
        this.setState({ selectedMenu });
    }

    render() {
        return (
            <div className={styles['settings']}>
                <div className={styles['options']}>
                    <span onClick={() => { this.changeSettings('player_preferences') }} className={styles['option']}>Player Preferences</span>
                    <span onClick={() => { this.changeSettings('language') }} className={styles['option']}>Language</span>
                    <span className={styles['option']}>Account Setttings</span>
                    <span className={styles['option']}>Notifications</span>
                    <span className={styles['option']}>Data Caching</span>
                </div>
                <SettingsExpanded selectedMenu={this.state.selectedMenu} />
            </div>
        );
    }
}

Settings.propTypes = {
    changeSettings: PropTypes.func
};

export default Settings;