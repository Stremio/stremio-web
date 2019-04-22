const React = require('react');
const classnames = require('classnames');
const Icon = require('stremio-icons/dom');
const Popup = require('../../Popup');
const { Input } = require('stremio-navigation');
const styles = require('./styles');

const UserMenu = ({ className }) => (
    <Popup>
        <Popup.Label>
            <Input className={classnames(className, styles['user-menu-button'])} type={'button'}>
                <Icon className={classnames(styles['icon'], styles['user-icon'])} icon={'ic_user'} />
                <Icon className={classnames(styles['icon'], styles['arrow-icon'])} icon={'ic_arrow_down'} />
            </Input>
        </Popup.Label>
        <Popup.Menu>
            <div style={{ background: 'red', width: 400, height: 300 }}>userpanel</div>
        </Popup.Menu>
    </Popup>
);

module.exports = UserMenu;
