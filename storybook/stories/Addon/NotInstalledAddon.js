const React = require('react');
const { storiesOf } = require('@storybook/react');
const { action } = require('@storybook/addon-actions');
const Addon = require('stremio/routes/Addons/Addon');
const styles = require('./styles');

storiesOf('Addon', module).add('NotInstalled', () => (
    <Addon
        className={styles['installed-addon-container']}
        id={'addon.id'}
        name={'Addon name'}
        version={'1.0.0'}
        logo={'/images/intro_background.jpg'}
        description={'Addon description ...'}
        types={['movie', 'series']}
        installed={false}
        onToggle={action('Toggle')}
        onShare={action('Share')}
        dataset={{ transportUrl: 'http://www.com' }}
    />
));
