const React = require('react');
const { storiesOf } = require('@storybook/react');
const { action } = require('@storybook/addon-actions');
const Addon = require('stremio/routes/Addons/Addon');
const styles = require('./styles');

storiesOf('Addon', module).add('NotInstalled', () => (
    <Addon
        className={styles['not-installed-addon-container']}
        id={'addon-id'}
        name={'Demo name'}
        logo={'/images/intro_background.jpg'}
        description={'Demo description'}
        types={['Demo type']}
        version={'1.0.0'}
        transportUrl={'Demo url'}
        installed={false}
        toggle={action('Demo item install button clicked')}
    />
));
