const React = require('react');
const PropTypes = require('prop-types');
const NavBar = require('stremio/common/NavBar');

const TABS = [
    { id: 'board', label: 'Board', icon: 'ic_board', href: '#/' },
    { id: 'discover', label: 'Discover', icon: 'ic_discover', href: '#/discover' },
    { id: 'library', label: 'Library', icon: 'ic_library', href: '#/library' }
];

const MainNavBar = React.memo(({ className, selected }) => {
    return (
        <NavBar
            className={className}
            backButton={false}
            tabs={TABS.map(({ id, label, icon, href }) => ({
                label,
                icon,
                href,
                selected: id === selected
            }))}
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
    selected: PropTypes.string
};

module.exports = MainNavBar;
