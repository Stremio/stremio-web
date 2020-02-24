const React = require('react');
const PropTypes = require('prop-types');
const classnames = require('classnames');
const Icon = require('stremio-icons/dom');
const Button = require('stremio/common/Button');
const Image = require('stremio/common/Image');
const SearchBar = require('./SearchBar');
const AddonsButton = require('./AddonsButton');
const FullscreenButton = require('./FullscreenButton');
const NavMenu = require('./NavMenu');
const styles = require('./styles');

const HorizontalNavBar = React.memo(({ className, route, query, title, backButton, searchBar, addonsButton, fullscreenButton, navMenu }) => {
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
                typeof title === 'string' && title.length > 0 ?
                    <h2 className={styles['title']}>{title}</h2>
                    :
                    null
            }
            <div className={styles['spacing']} />
            {
                searchBar ?
                    <SearchBar
                        className={styles['search-bar']}
                        query={query}
                        active={route === 'search'}
                    />
                    :
                    null
            }
            <div className={styles['spacing']} />
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
    title: PropTypes.string,
    backButton: PropTypes.bool,
    searchBar: PropTypes.bool,
    addonsButton: PropTypes.bool,
    fullscreenButton: PropTypes.bool,
    navMenu: PropTypes.bool
};

module.exports = HorizontalNavBar;
