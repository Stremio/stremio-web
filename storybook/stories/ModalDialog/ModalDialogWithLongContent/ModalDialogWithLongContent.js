// Copyright (C) 2017-2020 Smart code 203358507

const React = require('react');
const { storiesOf } = require('@storybook/react');
const { action } = require('@storybook/addon-actions');
const { ModalDialog } = require('stremio/common');

storiesOf('ModalDialog', module).add('ModalDialogWithLongContent', () => (
    <ModalDialog title={'ModalDialogWithLongContent'} onCloseRequest={action('onCloseRequest')}>
        <div style={{ height: 1000, background: 'red', color: 'white' }}>
            1000px height content
        </div>
    </ModalDialog>
));