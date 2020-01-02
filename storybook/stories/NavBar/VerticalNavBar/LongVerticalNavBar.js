const React = require('react');
const { storiesOf } = require('@storybook/react');
const VerticalNavBar = require('stremio/common/VerticalNavBar');

const TABS = [
    { route: 'board', label: 'Board', icon: 'ic_board' },
    { route: 'discover', label: 'Discover', icon: 'ic_discover' },
    { route: 'library', label: 'Library', icon: 'ic_library' },
    { route: 'calendar', label: 'Calendar', icon: 'ic_calendar' },
    { route: 'addons', label: 'Addons', icon: 'ic_addons' },
    { route: 'settings', label: 'Settings', icon: 'ic_settings' },
    { route: 'board', label: 'Board', icon: 'ic_board' },
    { route: 'discover', label: 'Discover', icon: 'ic_discover' },
    { route: 'library', label: 'Library', icon: 'ic_library' },
    { route: 'calendar', label: 'Calendar', icon: 'ic_calendar' },
    { route: 'addons', label: 'Addons', icon: 'ic_addons' },
    { route: 'settings', label: 'Settings', icon: 'ic_settings' }
];

storiesOf('NavBar', module).add('LongVerticalNavBar', () => (
    <VerticalNavBar
        tabs={TABS}
    />
));
