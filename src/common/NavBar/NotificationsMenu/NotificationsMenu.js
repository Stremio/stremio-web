const React = require('react');
const PropTypes = require('prop-types');
const classnames = require('classnames');
const Icon = require('stremio-icons/dom');
const Button = require('stremio/common/Button');
const Popup = require('stremio/common/Popup');
const NotificationsList = require('./NotificationsList');
const useNotifications = require('./useNotifications');
const useCatalogs = require('stremio/routes/Board/useCatalogs');
const useBinaryState = require('stremio/common/useBinaryState');
const styles = require('./styles');

const NotificationsMenu = ({ className, onClearButtonClicked, onSettingsButtonClicked }) => {
    const [menuOpen, openMenu, closeMenu, toggleMenu] = useBinaryState(false);
    //TODO use useNotifications hook instead of useCatalogs
    const metaItems = useCatalogs();

    return (
        <Popup
            open={menuOpen}
            onCloseRequest={closeMenu}
            renderLabel={({ref, className: popupLabelClassName, children}) => (
                <Button ref={ref} className={classnames(className, popupLabelClassName, styles['notifications-menu-label-container'], { 'active': menuOpen })} tabIndex={-1} onClick={toggleMenu}>
                    <Icon className={styles['icon']} icon={'ic_bell'} />
                    {children}
                </Button>
            )}
            renderMenu={() => (
                <div className={styles['notifications-menu-container']}>
                    <div className={styles['notifications-bar']}>
                        <div className={styles['notifications-label']}>Notifications</div>
                        <div className={styles['buttons-container']}>
                            <Button className={styles['button-container']} onClick={onClearButtonClicked}>
                                <Icon className={styles['icon']} icon={'ic_drawer'} />
                            </Button>
                            <Button className={styles['button-container']} onClick={onSettingsButtonClicked}>
                                <Icon className={styles['icon']} icon={'ic_settings'} />
                            </Button>
                        </div>
                    </div>
                    <NotificationsList className={styles['notifications-list']} metaItems={metaItems}/>
                </div>
            )}
        />
    );
};

NotificationsMenu.propTypes = {
    className: PropTypes.string,
    onClearButtonClicked: PropTypes.func,
    onSettingsButtonClicked: PropTypes.func
};

module.exports = NotificationsMenu;
