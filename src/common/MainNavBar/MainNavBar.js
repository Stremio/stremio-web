const React = require('react');
const PropTypes = require('prop-types');
const NavBar = require('stremio/common/NavBar');

const TABS = [
    { label: 'Board', icon: 'ic_board', href: '#/' },
    { label: 'Discover', icon: 'ic_discover', href: '#/discover' },
    { label: 'Library', icon: 'ic_library', href: '#/library' },
    { label: 'Calendar', icon: 'ic_calendar', href: '#/calendar' }
];

const MainNavBar = ({ className }) => {
    return (
        <NavBar
            className={className}
            backButton={false}
            tabs={TABS}
            searchBar={true}
            addonsButton={true}
            navMenu={true}
        />
    );
};

MainNavBar.propTypes = {
    className: PropTypes.string
};

module.exports = MainNavBar;
