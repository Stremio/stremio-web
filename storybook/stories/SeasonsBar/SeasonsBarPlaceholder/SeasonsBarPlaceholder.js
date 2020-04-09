// Copyright (C) 2017-2020 Smart code 203358507

const React = require('react');
const { storiesOf } = require('@storybook/react');
const SeasonsBar = require('stremio/routes/MetaDetails/VideosList/SeasonsBar');
const styles = require('./styles');

storiesOf('SeasonsBar', module).add('SeasonsBarPlaceholder', () => {
    return (
        <SeasonsBar.Placeholder
            className={styles['seasons-bar']}
        />
    );
});
