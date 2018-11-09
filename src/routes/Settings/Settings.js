import React, { Component } from 'react';
import classnames from 'classnames';
import styles from './styles';
import { Checkbox } from 'stremio-common';

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
            selectedMenu: SETTINGS_MENUS.PLAYER_MENU,
            decodingEnabled: false,
            autoplayEnabled: false,
            dataSaverEnabled: false
        };
    }

    changeSelectedMenu = (selectedMenu) => {
        this.setState({ selectedMenu });
    }

    toggleDecoding = () => {
        this.setState(({ decodingEnabled }) => {
            return { decodingEnabled: !decodingEnabled }
        });
    }

    toggleAutoPlay = () => {
        this.setState(({ autoplayEnabled }) => {
            return { autoplayEnabled: !autoplayEnabled }
        });
    }
    
    toggleDataSaver = () => {
        this.setState(({ dataSaverEnabled }) => {
            return { dataSaverEnabled: !dataSaverEnabled }
        });
    }

    shouldComponentUpdate(nextState) {
        return nextState.selectedMenu !== this.state.selectedMenu;
    }

    renderPlayerSettings = () => {
        return (
            <div className={styles['settings-list']}>
                <div className={styles['settings-section']}>
                    <label className={styles['toggle-option']}>
                        <span className={styles['preference']}>Hardware-accelerated decoding</span>
                        <Checkbox className={styles['checkbox-size']} checked={this.state.decodingEnabled} enabled={true} onClick={this.toggleDecoding}></Checkbox>
                    </label>
                    <label className={styles['toggle-option']}>
                        <span className={styles['preference']}>Auto-play next episode</span>
                        <Checkbox className={styles['checkbox-size']} checked={!this.state.autoplayEnabled} enabled={true} onClick={this.toggleAutoPlay}></Checkbox>
                    </label>
                    <label className={styles['toggle-option']}>
                        <span className={styles['preference']}>Data saver</span>
                        <Checkbox className={styles['checkbox-size']} checked={this.state.dataSaverEnabled} enabled={true} onClick={this.toggleDataSaver}></Checkbox>
                    </label>
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