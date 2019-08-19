const React = require('react');
const PropTypes = require('prop-types');
const classnames = require('classnames');
const NavBarButton = require('./NavBarButton');
const SearchBar = require('./SearchBar');
const NavMenu = require('./NavMenu');
const styles = require('./styles');

const NavBar = React.memo(({ className, backButton = false, tabs = [], title = '', searchBar = false, navMenu = false }) => {
    const onBackButtonClick = React.useCallback(() => {
        window.history.back();
    }, []);
    return (
        <nav className={classnames(className, styles['nav-bar-container'])}>
            {
                backButton ?
                    <NavBarButton
                        className={styles['nav-bar-button']}
                        icon={'ic_back_ios'}
                        label={'Back'}
                        onClick={onBackButtonClick}
                    />
                    :
                    null
            }
            {
                Array.isArray(tabs) && tabs.length > 0 ?
                    tabs.slice(0, 4).map(({ href, icon, label }) => (
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
                    <React.Fragment>
                        <div className={styles['spacing']} />
                        <SearchBar className={styles['search-bar']} />
                        <div className={styles['spacing']} />
                    </React.Fragment>
                    :
                    null
            }
            {
                navMenu ?
                    <NavMenu className={styles['nav-menu-label']} />
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
        icon: PropTypes.string.isRequired,
        label: PropTypes.string.isRequired,
        href: PropTypes.string.isRequired
    })),
    title: PropTypes.string,
    searchBar: PropTypes.bool,
    navMenu: PropTypes.bool
};

module.exports = NavBar;
