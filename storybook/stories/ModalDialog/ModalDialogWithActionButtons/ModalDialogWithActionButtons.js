const React = require('react');
const { storiesOf } = require('@storybook/react');
const { action } = require('@storybook/addon-actions');
const { ModalDialog } = require('stremio/common');
const styles = require('./styles');

storiesOf('ModalDialog', module).add('ModalDialogWithActionButtons', () => (
    <ModalDialog title={'ModalDialogWithActionButtons'}
        onCloseRequest={action('onCloseRequest')}
        buttons={[
            { label: 'Accept', props: { onClick: action('Accept') } },
            { label: 'Addons', icon: 'ic_addons', className: styles['addons-button-container'], props: { onClick: action('Addons') } },
        ]}>
        <div style={{ height: 1000, background: 'red', color: 'white' }}>
            1000px height content
        </div>
    </ModalDialog>
));