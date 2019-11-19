const React = require('react');
const { storiesOf } = require('@storybook/react');
const { Image } = require('stremio/common');
const styles = require('./styles');

storiesOf('Image', module).add('SampleImage', () => (
    <Image
        className={styles['image']}
        src={'/images/default_avatar.png'}
    />
));
