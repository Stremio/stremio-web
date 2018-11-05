import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Icon from 'stremio-icons/dom';
import styles from './styles';

class SettingsExpanded extends Component {
    constructor(props) {
        super(props);

        this.renderPlayerPreferences = this.renderPlayerPreferences.bind(this);
        this.renderLanguage = this.renderLanguage.bind(this);
    }

    renderPlayerPreferences = () => {
        const preferences = ["Auto-play next episode", "Data saver"];

        return (
            <div className={styles['player-preferences']}>
                <label className={styles['preference-container']}>
                    <input type='checkbox' className={styles['default-checkbox']} />
                    <span className={styles['preference']}>Hardware-accelerated decoding</span>
                    <p className={styles['checkbox']}>
                        <Icon className={styles['checkmark']} icon={'ic_check'} />
                    </p>
                </label>
                {preferences.map((item, key) => {
                    return (
                        <label key={key} className={styles['preference-container1']}>
                            <input type="checkbox" />
                            <span className={styles['slider']}></span>
                            <div className={styles['preference']}>{item}</div>
                        </label>
                    );
                })}
            </div>
        );
    }

    renderLanguage = () => {
        return (
            <div className={styles['language']}>
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

    render() {
        const { selectedMenu } = this.props;
        
        if (selectedMenu == "player_preferences") {
            return (
                <div> {this.renderPlayerPreferences()} </div>
            );
        } else if (selectedMenu == "language") {
            return (
                <div>{this.renderLanguage()} </div>
            );
        }
    }
}

SettingsExpanded.propTypes = {
    selectedMenu: PropTypes.string,
    renderPlayerPreferences: PropTypes.func,
    renderLanguage: PropTypes.func
};

export default SettingsExpanded;