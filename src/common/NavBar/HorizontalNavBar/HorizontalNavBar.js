const React = require('react');
const PropTypes = require('prop-types');
const classnames = require('classnames');
const Icon = require('stremio-icons/dom');
const Button = require('stremio/common/Button');
const Image = require('stremio/common/Image');
const SearchBar = require('../SearchBar');
const AddonsButton = require('../AddonsButton');
const FullscreenButton = require('../FullscreenButton');
const NotificationsMenu = require('../NotificationsMenu');
const NavMenu = require('../NavMenu');
const styles = require('./styles');

const HorizontalNavBar = React.memo(({ className, route, query, backButton, searchBar, addonsButton, fullscreenButton, notificationsMenu, navMenu }) => {
    const backButtonOnClick = React.useCallback(() => {
        window.history.back();
    }, []);
    return (
        <nav className={classnames(className, styles['horizontal-nav-bar-container'])}>
            {
                backButton ?
                    <Button className={styles['back-button-container']} tabIndex={-1} onClick={backButtonOnClick}>
                        <Icon className={styles['icon']} icon={'ic_back_ios'} />
                    </Button>
                    :
                    <div className={styles['logo-container']}>
                        <Image
                            className={styles['logo']}
                            src={'/images/stremio_symbol.png'}
                            alt={' '}
                        />
                    </div>
            }
            {
                searchBar ?
                    <React.Fragment>
                        <div className={styles['spacing']} />
                        <SearchBar className={styles['search-bar']} query={query} active={route === 'search'} />
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

HorizontalNavBar.displayName = 'HorizontalNavBar';

HorizontalNavBar.propTypes = {
    className: PropTypes.string,
    route: PropTypes.string,
    query: PropTypes.string,
    backButton: PropTypes.bool,
    searchBar: PropTypes.bool,
    addonsButton: PropTypes.bool,
    fullscreenButton: PropTypes.bool,
    notificationsMenu: PropTypes.bool,
    navMenu: PropTypes.bool
};

module.exports = HorizontalNavBar;
