const React = require('react');
const PropTypes = require('prop-types');
const NavBar = require('stremio/common/NavBar');

const TABS = [
    { route: 'board', label: 'Board', icon: 'ic_board', href: '#/' },
    { route: 'discover', label: 'Discover', icon: 'ic_discover', href: '#/discover' },
    { route: 'library', label: 'Library', icon: 'ic_library', href: '#/library' }
];

const MainNavBar = React.memo(({ className, route, query }) => {
    return (
        <NavBar
            className={className}
            route={route}
            query={query}
            backButton={false}
            tabs={TABS}
            searchBar={true}
            addonsButton={true}
            fullscreenButton={true}
            notificationsMenu={true}
            navMenu={true}
        />
    );
});

MainNavBar.displayName = 'MainNavBar';

MainNavBar.propTypes = {
    className: PropTypes.string,
    route: PropTypes.string,
    query: PropTypes.string
};

module.exports = MainNavBar;
