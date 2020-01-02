const React = require('react');
const { storiesOf } = require('@storybook/react');
const VerticalNavBar = require('stremio/common/VerticalNavBar');
const styles = require('./styles');

const TABS = [
    { label: 'Board', icon: 'ic_board' },
    { label: 'Discover', icon: 'ic_discover' },
    { label: 'Library', icon: 'ic_library' },
    { label: 'Calendar', icon: 'ic_calendar' },
    { label: 'Addons', icon: 'ic_addons' },
    { label: 'Settings', icon: 'ic_settings' },
    { label: 'Board', icon: 'ic_board' },
    { label: 'Discover', icon: 'ic_discover' },
    { label: 'Library', icon: 'ic_library' },
    { label: 'Calendar', icon: 'ic_calendar' },
    { label: 'Addons', icon: 'ic_addons' },
    { label: 'Settings', icon: 'ic_settings' }
];

storiesOf('NavBar', module).add('LongVerticalNavBar', () => (
    <VerticalNavBar
        className={styles['long-vertical-nav-bar']}
        tabs={TABS}
    />
));
