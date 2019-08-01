const React = require('react');
const PropTypes = require('prop-types');
const { useFocusable } = require('stremio-navigation');
const NavBar = require('../NavBar');

const TABS = [
    { label: 'Board', icon: 'ic_board', href: '#/', keyCode: 112 },
    { label: 'Discover', icon: 'ic_discover', href: '#/discover', keyCode: 113 },
    { label: 'Library', icon: 'ic_library', href: '#/library', keyCode: 114 },
    { label: 'Calendar', icon: 'ic_calendar', href: '#/calendar', keyCode: 115 }
];

const MainNavBar = ({ className }) => {
    const focusable = useFocusable();
    React.useEffect(() => {
        const onKeyDown = (event) => {
            const tab = TABS.find(({ keyCode }) => event.keyCode === keyCode);
            if (tab) {
                event.preventDefault();
                window.location = tab.href;
            }
        };
        if (focusable) {
            window.addEventListener('keydown', onKeyDown);
        }
        return () => {
            window.removeEventListener('keydown', onKeyDown);
        };
    }, [focusable]);
    return (
        <NavBar
            className={className}
            backButton={false}
            tabs={TABS}
            searchBar={true}
            navMenu={true}
        />
    );
};

MainNavBar.propTypes = {
    className: PropTypes.string
};

module.exports = MainNavBar;
