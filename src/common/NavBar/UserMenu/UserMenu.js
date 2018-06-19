import React, { Component } from 'react';
import Icon from 'stremio-icons/dom';
import styles from './styles';

class UserMenu extends Component {
    open = () => {

    }

    render() {
        return (
            <button className={styles['menu-button']} onClick={this.open}>
                <Icon className={styles['user-icon']} icon={'ic_user'} />
            </button>
        );
    }
}

export default UserMenu;
