import React, { Component } from 'react';
import classnames from 'classnames';
import Icon from 'stremio-icons/dom';
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
        return nextState.selectedMenu !== this.state.selectedMenu;
    }

    renderPlayerSettings = () => {
        const preferences = ['Hardware-accelerated decoding', 'Auto-play next episode', 'Data saver'];

        return (
            <div className={styles['settings-list']}>
                <div className={styles['settings-section']}>
                    {preferences.map((preference) =>
                        <label key={preference} className={styles['toggle-option']}>
                            <input type={'checkbox'} className={styles['default-checkbox']} />
                            <span className={styles['preference']}>{preference}</span>
                            <p className={styles['checkbox']}>
                                <Icon className={styles['checkmark']} icon={'ic_check'} />
                            </p>
                        </label>
                    )}
                </div>
            </div>
        );
    }

    renderLanguageSettings = () => {
        return (
            <div className={styles['settings-list']}>
                <select className={styles['settings-section']}>
                    <option value={'English'}>English</option>
                    <option value={'Portugese'}>Portugese</option>
                    <option value={'Deutch'}>Deutch</option>
                </select>
                <select className={styles['settings-section']}>
                    <option value={'English'}>English</option>
                    <option value={'Portugese'}>Portugese</option>
                    <option value={'Deutch'}>Deutch</option>
                </select>
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
            <div className={styles['settings-container']}>
                <div className={styles['side-menu']}>
                    {Object.keys(SETTINGS_MENUS).map((menu) =>
                        <div key={menu} className={classnames(styles['menu-option'], this.state.selectedMenu === SETTINGS_MENUS[menu] ? styles['selected'] : null)} onClick={() => this.changeSelectedMenu(SETTINGS_MENUS[menu])}>{menu}</div>
                    )}
                </div>
                {this.renderSelectedMenu()}
            </div>
        );
    }
}

export default Settings;