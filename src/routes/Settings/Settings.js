import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Icon from 'stremio-icons/dom';
import styles from './styles';

class Settings extends Component {
    constructor(props) {
        super(props);

        this.state = {
            selectedMenu: 'player_preferences',
            selectedMenuId: 0
        }
    }

    changeSettings = (selectedMenu, id) => {
        this.setState({ selectedMenu, selectedMenuId: id });
    }

    renderPlayerPreferences = () => {
        const preferences = ["Hardware-accelerated decoding", "Auto-play next episode", "Data saver"];

        return (
            <div className={styles['player-preferences-menu']}>
                {preferences.map((item, key) => {
                    return (
                        <label key={key} className={styles['preference-container']}>
                            <input type='checkbox' className={styles['default-checkbox']} />
                            <span className={styles['preference']}>{item}</span>
                            <p className={styles['checkbox']}>
                                <Icon className={styles['checkmark']} icon={'ic_check'} />
                            </p>
                        </label>
                    );
                })}
            </div>
        );
    }

    renderLanguage = () => {
        return (
            <div className={styles['language-menu']}>
                <div className={styles['interface-language']}>
                    <span className={styles['headline']}>INTERFACE LANGUAGE</span>
                    <div className={styles['name']}>English
                        <Icon className={styles['arrow-down']} icon={'ic_arrow_down'} />
                    </div>
                </div>
                <div className={styles['default-subtitles-language']}>
                    <span className={styles['headline']}>DEFAULT SUBTITLES LANGUAGE</span>
                    <div className={styles['name']}>Portugese - BR
                        <Icon className={styles['arrow-down']} icon={'ic_arrow_down'} />
                    </div>
                </div>
            </div>
        );
    }

    renderSelectedMenu = () => {
        const { selectedMenuId } = this.state;

        if (selectedMenuId == 0) {
            this.selectedMenu = 'player-preferences';
            return (
                <div> {this.renderPlayerPreferences()} </div>
            );
        } else if (selectedMenuId == 1) {
            this.selectedMenu = 'language';
            return (
                <div>{this.renderLanguage()} </div>
            );
        }
    }

    render() {
        const { selectedMenu } = this.state;
        const options = ["Player Preferences", "Language", "Account Settings", "Notifications", "Data Caching"];

        return (
            <div className={styles['settings']}>
                <div className={styles['options']}>
                    {options.map((key, index) =>
                        <div key={key} className={styles[index === this.state.selectedMenuId ? 'selected-menu' : 'option']} onClick={() => this.changeSettings(selectedMenu, index)}>{options[index]}</div>
                    )}
                </div>
                {this.renderSelectedMenu()}
            </div>
        )
    }
}

export default Settings;