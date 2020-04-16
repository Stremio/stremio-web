// Copyright (C) 2017-2020 Smart code 203358507

const React = require('react');
const { storiesOf } = require('@storybook/react');
const Stream = require('stremio/routes/MetaDetails/StreamsList/Stream');
const styles = require('./styles');

storiesOf('Stream', module).add('StreamWithThumbnail', () => (
    <Stream
        className={styles['stream-container']}
        addonName={'Sample addon name'}
        title={'1080p'}
        thumbnail={'images/anonymous.png'}
        progress={0.6}
    />
));
