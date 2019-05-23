const React = require('react');
const PropTypes = require('prop-types');
const NavBar = require('../NavBar');

const tabs = [
    { label: 'Board', icon: 'ic_board', href: '#/' },
    { label: 'Discover', icon: 'ic_discover', href: '#/discover' },
    { label: 'Library', icon: 'ic_library', href: '#/library' },
    { label: 'Calendar', icon: 'ic_calendar', href: '#/calendar' },
];

const MainNavBar = ({ className }) => (
    <NavBar
        className={className}
        backButton={false}
        tabs={tabs}
        searchBar={true}
        userMenu={true}
    />
);

MainNavBar.propTypes = {
    className: PropTypes.string
};

module.exports = MainNavBar;
