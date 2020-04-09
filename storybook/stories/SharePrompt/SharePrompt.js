// Copyright (C) 2017-2020 Smart code 203358507

const React = require('react');
const { storiesOf } = require('@storybook/react');
const { SharePrompt, ModalDialog } = require('stremio/common');
const styles = require('./styles');

storiesOf('SharePrompt', module).add('SharePrompt', () => (
    <ModalDialog title={'Share Stremio'}>
        <SharePrompt
            className={styles['share-prompt-container']}
            url={'https://stremio.com'}
        />
    </ModalDialog>
));
