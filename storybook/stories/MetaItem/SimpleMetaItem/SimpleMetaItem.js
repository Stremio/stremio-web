const React = require('react');
const { storiesOf } = require('@storybook/react');
const { action } = require('@storybook/addon-actions');
const { MetaItem } = require('stremio/common');
const styles = require('./styles');

storiesOf('MetaItem', module).add('SimpleMetaItem', () => (
    <MetaItem
        className={styles['meta-item-container']}
        id={'meta-item-id'}
        type={'movie'}
        name={'Demo item'}
        posterShape={'poster'}
        poster={'https://blog.stremio.com/wp-content/uploads/2019/07/Stremio-open-source-850x531.jpg'}
        title={'Demo item'}
        progress={0.4}
        playIcon={true}
        onClick={action('Demo item clicked')}
    />
));
