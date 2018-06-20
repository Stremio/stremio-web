import React, { PureComponent } from 'react';
import Icon from 'stremio-icons/dom';
import { Popup } from 'stremio-common';
import styles from './styles';

class UserMenu extends PureComponent {
    render() {
        return (
            <Popup>
                <Popup.Label>
                    <button className={styles['popup-label-container']}>
                        <Icon className={styles['user-icon']} icon={'ic_user'} />
                    </button>
                </Popup.Label>
                <Popup.Menu width={300}>
                    <div style={{ background: 'red', width: '100%', height: 300 }}>kopele</div>
                </Popup.Menu>
            </Popup>
        );
    }
}

export default UserMenu;
