const React = require('react');
const PropTypes = require('prop-types');
const NavBarButton = require('./NavBarButton');
const SearchBar = require('./SearchBar');
const UserMenu = require('./UserMenu');
const styles = require('./styles');

const NavBar = ({ backButton, tabs, title, searchBar, userMenu }) => {
    const onBackButtonClick = React.useCallback(() => {
        window.history.back();
    }, []);
    return (
        <nav className={styles['nav-bar']}>
            {
                backButton ?
                    <NavBarButton
                        className={styles['nav-bar-button']}
                        icon={'ic_back_ios'}
                        label={'back'}
                        onClick={onBackButtonClick}
                    />
                    :
                    null
            }
            {
                tabs.length > 0 ?
                    tabs.map(({ href, icon, label }) => (
                        <NavBarButton
                            key={href}
                            className={styles['nav-bar-button']}
                            href={href}
                            icon={icon}
                            label={label}
                        />
                    ))
                    :
                    <h2 className={styles['title']}>{title}</h2>
            }
            {
                searchBar ?
                    <SearchBar className={styles['search-bar']} />
                    :
                    null
            }
            {
                userMenu ?
                    <UserMenu className={styles['user-menu']} />
                    :
                    null
            }
        </nav>
    );
};

NavBar.propTypes = {
    tabs: PropTypes.arrayOf(PropTypes.exact({
        icon: PropTypes.string.isRequired,
        label: PropTypes.string.isRequired,
        href: PropTypes.string.isRequired
    })).isRequired,
    title: PropTypes.string.isRequired,
    backButton: PropTypes.bool.isRequired,
    searchBar: PropTypes.bool.isRequired,
    userMenu: PropTypes.bool.isRequired
};

NavBar.defaultProps = {
    tabs: Object.freeze([]),
    title: '',
    backButton: false,
    searchBar: false,
    userMenu: false
};

module.exports = NavBar;
