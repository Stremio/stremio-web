
const React = require('react');
const { storiesOf } = require('@storybook/react');
const { action } = require('@storybook/addon-actions');
const { ModalDialog } = require('stremio/common');
const styles = require('./styles');
const useBinaryState = require('stremio/common/useBinaryState');

storiesOf('ModalDialog', module).add('ModalDialog', () => {
    const [modalVisible, showModal, hideModal] = useBinaryState(false);
    const [modalBVisible, showModalB, hideModalB] = useBinaryState(true);

    const modalDummyContents = (
        <div className={styles['content-container']}>
            <div className={styles['content-column']}>
                <h2>What is Lorem Ipsum?</h2>
                <p>Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.</p>
            </div>
            <div className={styles['content-column']}>
                <h2>Where does it come from?</h2>
                <p>Contrary to popular belief, Lorem Ipsum is not simply random text. It has roots in a piece of classical Latin literature from 45 BC, making it over 2000 years old. Richard McClintock, a Latin professor at Hampden-Sydney College in Virginia, looked up one of the more obscure Latin words, consectetur, from a Lorem Ipsum passage, and going through the cites of the word in classical literature, discovered the undoubtable source. Lorem Ipsum comes from sections 1.10.32 and 1.10.33 of "de Finibus Bonorum et Malorum" (The Extremes of Good and Evil) by Cicero, written in 45 BC. This book is a treatise on the theory of ethics, very popular during the Renaissance. The first line of Lorem Ipsum, "Lorem ipsum dolor sit amet..", comes from a line in section 1.10.32.</p>
            </div>
        </div>
    );

    /*

    Every Button has the following properties:

    label (String/React component) - the contents of the button.
    icon                  (String) - icon class name. It will be shown to the left of the button's text
    className             (String) - Custom className applied along side the default one. Used for custom styles
    props                 (Object) - the properties applied to the button itself. If a className is supplied here it will override all other class names for this Button

    */

    const oneButton = [
        {
            label: 'Show many buttons', icon: 'ic_ellipsis', props: {
                onClick: React.useCallback(() => setButtons(manyButtons), [setButtons])
            }
        },
    ]
    const manyButtons = [
        {
            label: 'One',
            icon: 'ic_back_ios',
            props: {
                onClick: React.useCallback(() => setButtons(oneButton), [setButtons])
            }
        },
        {
            label: 'A disabled button with a long name',
            props: {
                disabled: true,
                tabIndex: -1, // We don't need keyboard focus on disabled elements
                onClick: action('The onClick on disabled buttons should not be called!')
            }
        },
        {
            label: 'A button with a long name, icon and custom class',
            className: styles['custom-button'],
            props: {
                onClick: action('A button with a long name and icon clicked')
            }
        },
        {}
    ];
    const [buttons, setButtons] = React.useState(oneButton);

    return (
        <div>
            <button className={styles['show-modal-button']} onClick={showModal}>Show dialog without buttons</button>
            {
                modalVisible
                    ?
                    <ModalDialog className={styles['modal-dialog']} title={'Test dialog without buttons'} visible={modalVisible} onCloseRequest={hideModal}>
                        {modalDummyContents}
                    </ModalDialog>
                    :
                    null
            }

            <button className={styles['show-modal-button']} onClick={showModalB}>Show dialog with buttons</button>
            {
                modalBVisible
                    ?
                    <ModalDialog className={styles['modal-dialog']} title={'Test dialog with buttons'} buttons={buttons} visible={modalBVisible} onCloseRequest={hideModalB}>
                        {modalDummyContents}
                    </ModalDialog>
                    :
                    null
            }
        </div>
    );
});