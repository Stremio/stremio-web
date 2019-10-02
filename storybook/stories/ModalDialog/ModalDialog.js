
const React = require('react');
const { storiesOf } = require('@storybook/react');
const { action } = require('@storybook/addon-actions');
const { ModalDialog } = require('stremio/common');
const Icon = require('stremio-icons/dom');
const ColorPicker = require('stremio/common/ColorPicker');
const styles = require('./styles');

storiesOf('ModalDialog', module).add('ModalDialog', () => {
    const oneButton = [
        {
            label: 'Show many buttons', icon: 'ic_ellipsis', props: {
                onClick: React.useCallback(()=>setButtons(manyButtons))
            }
        },
    ]
    const manyButtons = [
        {
            label: 'One', icon: 'ic_back_ios', props: {
                onClick: React.useCallback(()=>setButtons(oneButton))
            }
        },
        {
            label: 'A button with a long name', props: {
                onClick: action('A button with a long name clicked.')
            }
        },
        {
            label: (
                <React.Fragment>
                    <Icon className={styles['icon']} icon={'ic_actor'} />
                    {'A button with a long name, icon and custom class'}
                </React.Fragment>
            ), props: {
                className: styles['custom-button'],
                onClick: action('A button with a long name and icon clicked')
            }
        },
        {}
    ];
    const [buttons, setButtons] = React.useState(oneButton);
    return (
        <ModalDialog className={styles['modal-dialog']} title={'Test dialog'} buttons={buttons} onClose={action('ModalDialog close button clicked')}>
            <div className={styles['content-container']}>
                <div className={styles['content-column']}>
                    <ColorPicker className={styles['content-centered']} onChange={action('Color changed')} />
                </div>
                <div className={styles['content-column']}>
                    <h2>Some text here</h2>
                    <p>Lorem ipsum dolor sit amet</p>
                </div>
            </div>
        </ModalDialog>
    );
});