const React = require('react');
const PropTypes = require('prop-types');
const VerticalNavBar = require('stremio/common/VerticalNavBar');

const TABS = [
    { route: 'board', label: 'Board', icon: 'ic_board', href: '#/' },
    { route: 'discover', label: 'Discover', icon: 'ic_discover', href: '#/discover' },
    { route: 'library', label: 'Library', icon: 'ic_library', href: '#/library' }
];

const MainVerticalNavBar = React.memo(({ className, route }) => {
    return (
        <VerticalNavBar
            className={className}
            route={route}
            tabs={TABS}
        />
    );
});

MainVerticalNavBar.displayName = 'MainVerticalNavBar';

MainVerticalNavBar.propTypes = {
    className: PropTypes.string,
    route: PropTypes.string
};

module.exports = MainVerticalNavBar;
