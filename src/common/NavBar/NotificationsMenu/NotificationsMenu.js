const React = require('react');
const PropTypes = require('prop-types');
const classnames = require('classnames');
const Icon = require('stremio-icons/dom');
const Button = require('stremio/common/Button');
const Popup = require('stremio/common/Popup');
const useBinaryState = require('stremio/common/useBinaryState');
const styles = require('./styles');

const NotificationsMenu = ({ className, metaItems }) => {
    const [menuOpen, openMenu, closeMenu, toggleMenu] = useBinaryState(false);
    return (
        <Popup
            open={menuOpen}
            onCloseRequest={closeMenu}
            renderLabel={(ref) => (
                <Button ref={ref} className={classnames(className, styles['notifications-menu-label-container'], { 'active': menuOpen })} tabIndex={-1} onClick={toggleMenu}>
                    <Icon className={styles['icon']} icon={'ic_bell'} />
                </Button>
            )}
            renderMenu={() => (
                <div className={styles['notifications-menu-container']} />
            )}
        />
    );
};

NotificationsMenu.propTypes = {
    className: PropTypes.string,
    metaItems: PropTypes.arrayOf(PropTypes.object).isRequired
};
NotificationsMenu.defaultProps = {
    metaItems: []
};

module.exports = NotificationsMenu;
