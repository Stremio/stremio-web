const React = require('react');
const { storiesOf } = require('@storybook/react');
const { action } = require('@storybook/addon-actions');
const { Image } = require('stremio/common');
const styles = require('./styles');

storiesOf('Image', module).add('SampleImage', () => {
    const domEventHandler = React.useCallback((event) => {
        action('domEventHandler')(event.currentTarget.dataset);
    }, []);
    return (
        <Image
            className={styles['image']}
            src={'/images/default_avatar.png'}
            data-prop={'data-value'}
            onClick={domEventHandler}
        />
    );
});
