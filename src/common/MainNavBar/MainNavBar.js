const React = require('react');
const PropTypes = require('prop-types');
const NavBar = require('stremio/common/NavBar');

const TABS = [
    { label: 'Board', icon: 'ic_board', href: '#/' },
    { label: 'Discover', icon: 'ic_discover', href: '#/discover' },
    { label: 'Library', icon: 'ic_library', href: '#/library' }
];

const MainNavBar = React.memo(({ className }) => {
    return (
        <NavBar
            className={className}
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
    className: PropTypes.string
};

module.exports = MainNavBar;
