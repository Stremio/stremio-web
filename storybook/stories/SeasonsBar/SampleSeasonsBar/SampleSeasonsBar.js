const React = require('react');
const { storiesOf } = require('@storybook/react');
const { action } = require('@storybook/addon-actions');
const SeasonsBar = require('stremio/routes/MetaDetails/VideosList/SeasonsBar');
const styles = require('./styles');

storiesOf('SeasonsBar', module).add('SampleSeasonsBar', () => {
    const [season, setSeason] = React.useState(1);
    const seasons = React.useMemo(() => {
        return [1, 2, 3, 4, 5, /*6,*/ 7];
    }, []);
    const onSelect = React.useCallback((event) => {
        action('onSelect')(event);
        setSeason(event.value);
    }, []);
    return (
        <SeasonsBar
            className={styles['seasons-bar']}
            seasons={seasons}
            season={season}
            onSelect={onSelect}
        />
    );
});
