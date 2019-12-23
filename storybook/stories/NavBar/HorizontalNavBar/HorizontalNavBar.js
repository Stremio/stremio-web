const React = require('react');
const { storiesOf } = require('@storybook/react');
const HorizontalNavBar = require('stremio/common/HorizontalNavBar');
const styles = require('./styles');

storiesOf('NavBar', module).add('HorizontalNavBar', () => (
    <HorizontalNavBar
        className={styles['nav-bar']}
        backButton={false}
        searchBar={true}
        addonsButton={true}
        fullscreenButton={true}
        notificationsMenu={true}
        navMenu={false}
    />
));
