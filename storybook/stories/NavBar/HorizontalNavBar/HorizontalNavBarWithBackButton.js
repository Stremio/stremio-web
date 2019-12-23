const React = require('react');
const { storiesOf } = require('@storybook/react');
const HorizontalNavBar = require('stremio/common/HorizontalNavBar');

storiesOf('NavBar', module).add('HorizontalNavBarWithBackButton', () => (
    <HorizontalNavBar
        backButton={true}
        searchBar={true}
        addonsButton={true}
        fullscreenButton={true}
        notificationsMenu={true}
        navMenu={false}
    />
));
