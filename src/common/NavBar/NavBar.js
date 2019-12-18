const React = require('react');
const PropTypes = require('prop-types');
const classnames = require('classnames');
const NavTabButton = require('./NavTabButton');
const SearchBar = require('./SearchBar');
const AddonsButton = require('./AddonsButton');
const FullscreenButton = require('./FullscreenButton');
const NotificationsMenu = require('./NotificationsMenu');
const NavMenu = require('./NavMenu');
const styles = require('./styles');

const NavBar = React.memo(({ className, backButton, tabs, title, searchBar, addonsButton, fullscreenButton, notificationsMenu, navMenu }) => {
    const backButtonOnClick = React.useCallback(() => {
        window.history.back();
    }, []);
    return (
        <nav className={classnames(className, styles['nav-bar-container'])}>
            {
                backButton ?
                    <NavTabButton
                        className={styles['nav-tab-button']}
                        icon={'ic_back_ios'}
                        label={'Back'}
                        onClick={backButtonOnClick}
                    />
                    :
                    null
            }
            {
                Array.isArray(tabs) && tabs.length > 0 ?
                    tabs.slice(0, 4).map(({ href, icon, label, selected, onClick }, index) => (
                        <NavTabButton
                            key={index}
                            className={styles['nav-tab-button']}
                            href={href}
                            icon={icon}
                            label={label}
                            selected={selected}
                            onClick={onClick}
                        />
                    ))
                    :
                    <h2 className={styles['title']}>{title}</h2>
            }
            {
                searchBar ?
                    <React.Fragment>
                        <div className={styles['spacing']} />
                        <SearchBar className={styles['search-bar']} />
                        <div className={styles['spacing']} />
                    </React.Fragment>
                    :
                    null
            }
            {
                addonsButton ?
                    <AddonsButton className={styles['addons-button']} />
                    :
                    null
            }
            {
                fullscreenButton ?
                    <FullscreenButton className={styles['fullscreen-button']} />
                    :
                    null
            }
            {
                notificationsMenu ?
                    <NotificationsMenu className={styles['notifications-menu']} />
                    :
                    null
            }
            {
                navMenu ?
                    <NavMenu className={styles['nav-menu']} />
                    :
                    null
            }
        </nav>
    );
});

NavBar.displayName = 'NavBar';

NavBar.propTypes = {
    className: PropTypes.string,
    backButton: PropTypes.bool,
    tabs: PropTypes.arrayOf(PropTypes.shape({
        icon: PropTypes.string,
        label: PropTypes.string,
        href: PropTypes.string,
        selected: PropTypes.bool,
        onClick: PropTypes.func
    })),
    title: PropTypes.string,
    searchBar: PropTypes.bool,
    addonsButton: PropTypes.bool,
    fullscreenButton: PropTypes.bool,
    notificationsMenu: PropTypes.bool,
    navMenu: PropTypes.bool
};

module.exports = NavBar;
