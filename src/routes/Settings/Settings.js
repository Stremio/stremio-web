import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Icon from 'stremio-icons/dom';
import classnames from 'classnames';
import styles from './styles';

const SETTINGS_MENUS = {
    PLAYER_MENU: 1,
    LANGUAGE_MENU: 2,
    ACCOUNT_MENU: 3,
    NOTIFICATIONS_MENU: 4,
    DATA_MENU: 5
};

class Settings extends Component {
    constructor(props) {
        super(props);

        this.state = {
            selectedMenu: SETTINGS_MENUS.PLAYER_MENU
        };
    }

    changeSelectedMenu = (selectedMenu) => {
        this.setState({ selectedMenu });
    }

    shouldComponentUpdate(nextState) {
        return nextState.selectedMenu != this.state.selectedMenu;
    }

    renderPlayerSettings = () => {
        const preferences = ['Hardware-accelerated decoding', 'Auto-play next episode', 'Data saver'];

        return (
            <div className={styles['player-preferences-menu']}>
                {preferences.map((item, key) =>
                    <label key={key} className={styles['preferences-section']}>
                        <input type='checkbox' className={styles['default-checkbox']} />
                        <span className={styles['preference']}>{item}</span>
                        <p className={styles['checkbox']}>
                            <Icon className={styles['checkmark']} icon={'ic_check'} />
                        </p>
                    </label>
                )}
            </div>
        );
    }

    renderLanguageSettings = () => {
        return (
            <div className={styles['language-menu']}>
                <div className={styles['language-section']}>
                    <span className={styles['headline']}>INTERFACE LANGUAGE</span>
                    <div className={styles['selected-language']}>English
                        <Icon className={styles['arrow-down']} icon={'ic_arrow_down'} />
                    </div>
                </div>
                <div className={styles['language-section']}>
                    <span className={styles['headline']}>DEFAULT SUBTITLES LANGUAGE</span>
                    <div className={styles['selected-language']}>Portugese - BR
                        <Icon className={styles['arrow-down']} icon={'ic_arrow_down'} />
                    </div>
                </div>
            </div>
        );
    }

    renderSelectedMenu = () => {
        switch (this.state.selectedMenu) {
            case SETTINGS_MENUS.PLAYER_MENU:
                return this.renderPlayerSettings();
            case SETTINGS_MENUS.LANGUAGE_MENU:
                return this.renderLanguageSettings();
            default:
                return null;
        }
    }

    render() {
        return (
            <div className={styles['settings']}>
                <div className={styles['side-menu']}>
                    {Object.keys(SETTINGS_MENUS).map((menu) =>
                        <div key={menu} className={classnames(styles['menu-option'], this.state.selectedMenu === SETTINGS_MENUS[menu] ? styles['menu-option-selected'] : null)} onClick={() => this.changeSelectedMenu(SETTINGS_MENUS[menu])}>{menu}</div>
                    )}
                </div>
                {this.renderSelectedMenu()}
            </div>
        )
    }
}

export default Settings;