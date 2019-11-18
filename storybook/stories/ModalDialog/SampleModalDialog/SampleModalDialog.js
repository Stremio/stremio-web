
const React = require('react');
const { storiesOf } = require('@storybook/react');
const { action } = require('@storybook/addon-actions');
const { ModalDialog } = require('stremio/common');

storiesOf('ModalDialog', module).add('SampleModalDialog', () => (
    <ModalDialog title={'SampleModalDialog'} onCloseRequest={action('onCloseRequest')}>
        <div style={{ height: 100, background: 'red', color: 'white' }}>
            100px height content
        </div>
    </ModalDialog>
));