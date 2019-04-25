const React = require('react');
const PropTypes = require('prop-types');
const NavBarButton = require('./NavBarButton');
const SearchBar = require('./SearchBar');
const UserMenu = require('./UserMenu');
const styles = require('./styles');

const NavBar = React.memo(({ backButton, tabs, title, searchBar, userMenu }) => {
    const onBackButtonClick = React.useCallback(() => {
        window.history.back();
    }, []);
    return (
        <nav className={styles['nav-bar']}>
            {
                backButton ?
                    <NavBarButton
                        className={styles['back-button']}
                        icon={'ic_back_ios'}
                        label={'back'}
                        onClick={onBackButtonClick}
                    />
                    :
                    null
            }
            {
                Array.isArray(tabs) && tabs.length > 0 ?
                    <div className={styles['nav-tabs-container']}>
                        {tabs.map(({ href, icon, label }) => (
                            <NavBarButton
                                key={href}
                                className={styles['nav-tab-button']}
                                href={href}
                                icon={icon}
                                label={label}
                            />
                        ))}
                    </div>
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
});

NavBar.displayName = 'NavBar';
NavBar.propTypes = {
    tabs: PropTypes.arrayOf(PropTypes.exact({
        icon: PropTypes.string.isRequired,
        label: PropTypes.string.isRequired,
        href: PropTypes.string.isRequired
    })),
    title: PropTypes.string,
    backButton: PropTypes.bool,
    searchBar: PropTypes.bool,
    userMenu: PropTypes.bool
};

module.exports = NavBar;
