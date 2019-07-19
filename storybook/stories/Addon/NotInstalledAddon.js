const React = require('react');
const { storiesOf } = require('@storybook/react');

storiesOf('Addon', module).add('NotInstalled', () => (
    <div>Not installed addon</div>
));
