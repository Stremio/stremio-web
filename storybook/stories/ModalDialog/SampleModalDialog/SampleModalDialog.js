const React = require('react');
const { storiesOf } = require('@storybook/react');
const { action } = require('@storybook/addon-actions');
const { ModalDialog } = require('stremio/common');

storiesOf('ModalDialog', module).add('SampleModalDialog', () => {
    const domEventHandler = React.useCallback((event) => {
        action('domEventHandler')(event.currentTarget.dataset);
    }, []);
    return (
        <ModalDialog title={'SampleModalDialog'}
            data-prop={'data-value'}
            dataset={{ 'dataset-prop': 'dataset-value' }}
            onCloseRequest={action('onCloseRequest')}
            onClick={domEventHandler}>
            <div style={{ height: 100, background: 'red', color: 'white' }}>
                100px height content
            </div>
        </ModalDialog>
    );
});