const React = require('react');
const PropTypes = require('prop-types');
const NavBarButton = require('./NavBarButton');
const styles = require('./styles');

const onBackButtonClick = () => {
    window.history.back();
};

const NavBar = ({ backButton, tabs, title, searchInput, userMenu }) => (
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
                <div className={styles['tabs-container']}>
                    {tabs.map(({ href, icon, label }) => (
                        <NavBarButton
                            key={href}
                            className={styles['nav-bar-button']}
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
            searchInput ?
                <div className={styles['search-input']} />
                :
                null
        }
        {
            userMenu ?
                <div className={styles['user-menu']} />
                :
                null
        }
    </nav>
);

NavBar.propTypes = {
    tabs: PropTypes.arrayOf(PropTypes.exact({
        icon: PropTypes.string.isRequired,
        label: PropTypes.string.isRequired,
        href: PropTypes.string.isRequired
    })).isRequired,
    title: PropTypes.string.isRequired,
    backButton: PropTypes.bool.isRequired,
    searchInput: PropTypes.bool.isRequired,
    userMenu: PropTypes.bool.isRequired
};

NavBar.defaultProps = {
    tabs: Object.freeze([]),
    title: '',
    backButton: false,
    searchInput: false,
    userMenu: false
};

module.exports = NavBar;
