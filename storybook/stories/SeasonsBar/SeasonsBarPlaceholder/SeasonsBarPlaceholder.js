const React = require('react');
const { storiesOf } = require('@storybook/react');
const SeasonsBar = require('stremio/routes/Detail/VideosList/SeasonsBar');
const styles = require('./styles');

storiesOf('SeasonsBar', module).add('SeasonsBarPlaceholder', () => {
    return (
        <SeasonsBar.Placeholder
            className={styles['seasons-bar']}
        />
    );
});
