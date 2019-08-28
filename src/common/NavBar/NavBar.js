const React = require('react');
const PropTypes = require('prop-types');
const classnames = require('classnames');
const NavTabButton = require('./NavTabButton');
const SearchBar = require('./SearchBar');
const AddonsButton = require('./AddonsButton');
const NavMenu = require('./NavMenu');
const styles = require('./styles');

const NavBar = React.memo(({ className, backButton = false, tabs = [], title = '', searchBar = false, addonsButton = false, navMenu = false }) => {
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
                    tabs.slice(0, 4).map(({ href = '', icon = '', label = '', onClick }) => (
                        <NavTabButton
                            key={`${href}${icon}${label}`}
                            className={styles['nav-tab-button']}
                            href={href}
                            icon={icon}
                            label={label}
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
        onClick: PropTypes.func
    })),
    title: PropTypes.string,
    searchBar: PropTypes.bool,
    addonsButton: PropTypes.bool,
    navMenu: PropTypes.bool
};

module.exports = NavBar;
