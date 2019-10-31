
const React = require('react');
const { storiesOf } = require('@storybook/react');
const { action } = require('@storybook/addon-actions');
const classnames = require('classnames');
const Icon = require('stremio-icons/dom');
const { Modal } = require('stremio-router');
const { ModalDialog } = require('stremio/common');
const styles = require('./styles');
const useBinaryState = require('stremio/common/useBinaryState');

storiesOf('ModalDialog', module).add('ModalDialog', () => {
    const [modalVisible, showModal, hideModal, toggleModal] = useBinaryState(false);
    const [modalBVisible, showModalB, hideModalB, toggleModalB] = useBinaryState(false);

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

    const oneButton = [
        {
            label: 'Show many buttons', icon: 'ic_ellipsis', props: {
                onClick: React.useCallback(() => setButtons(manyButtons), [])
            }
        },
    ]
    const manyButtons = [
        {
            label: 'One', icon: 'ic_back_ios', props: {
                onClick: React.useCallback(() => setButtons(oneButton), [])
            }
        },
        {
            label: 'A disabled button with a long name', props: {
                disabled: true,
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
        <React.Fragment>
            <button className={styles['button']} onClick={toggleModal}>Toggle dialog without buttons</button>

            <button className={styles['button']} onClick={toggleModalB}>Toggle dialog with buttons</button>

            <ModalDialog className={styles['modal-dialog']} title={'Test dialog without buttons'} visible={modalVisible} onClose={hideModal}>
                {modalDummyContents}
            </ModalDialog>
            <ModalDialog className={styles['modal-dialog']} title={'Test dialog with buttons'} buttons={buttons} visible={modalBVisible} onClose={hideModalB}>
                {modalDummyContents}
            </ModalDialog>
        </React.Fragment>
    );
});