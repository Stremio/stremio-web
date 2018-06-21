import React, { PureComponent } from 'react';
import classnames from 'classnames';
import Icon from 'stremio-icons/dom';
import { Popup } from 'stremio-common';
import styles from './styles';

class UserMenu extends PureComponent {
    render() {
        return (
            <Popup>
                <Popup.Label>
                    <button className={classnames(this.props.className, styles['popup-label-container'])}>
                        <Icon className={classnames(styles['user-icon'], styles['icon'])} icon={'ic_user'} />
                        <Icon className={classnames(styles['arrow-icon'], styles['icon'])} icon={'ic_arrow_down'} />
                    </button>
                </Popup.Label>
                <Popup.Menu width={300}>
                    <div style={{ background: 'red', width: '100%', height: 300 }}>popup</div>
                </Popup.Menu>
            </Popup>
        );
    }
}

export default UserMenu;
