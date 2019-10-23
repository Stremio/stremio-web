const React = require('react');
const { storiesOf } = require('@storybook/react');
const { action } = require('@storybook/addon-actions');
const { SharePrompt } = require('stremio/common');
const styles = require('./styles');

storiesOf('SharePrompt', module).add('SharePrompt', () => (
    <SharePrompt
        className={styles['share-prompt-container']}
        label={'Demo label'}
        url={'Demo url'}
        close={action('Demo item closed')}
    />
));
