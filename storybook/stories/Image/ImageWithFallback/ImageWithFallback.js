const React = require('react');
const { storiesOf } = require('@storybook/react');
const { action } = require('@storybook/addon-actions');
const Icon = require('stremio-icons/dom');
const { Image } = require('stremio/common');
const styles = require('./styles');

storiesOf('Image', module).add('ImageWithFallback', () => (
    <Image
        className={styles['image']}
        src={'/images/non_existing.png'}
        onError={action('onError')}
        renderFallback={() => (
            <Icon className={styles['icon']} icon={'ic_broken_link'} />
        )}
    />
));
