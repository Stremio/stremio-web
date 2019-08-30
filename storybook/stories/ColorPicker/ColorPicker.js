const React = require('react');
const { storiesOf } = require('@storybook/react');
const { ColorPicker } = require('stremio/common');
const styles = require('./styles');

storiesOf('ColorPicker', module).add('ColorPicker', () => (
    <ColorPicker
        className={styles['color-picker-container']}
        value={'#000000'}
        onChange={(color) => { console.log(color) }}
    />
));
