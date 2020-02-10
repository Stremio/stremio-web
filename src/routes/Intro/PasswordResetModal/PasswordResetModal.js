const React = require('react');
const PropTypes = require('prop-types');
const { useRouteFocused } = require('stremio-router');
const { ModalDialog, TextInput } = require('stremio/common');
const styles = require('./styles');

const PasswordResetModal = ({ email, onCloseRequest }) => {
    const routeFocused = useRouteFocused();
    const [error, setError] = React.useState('');
    const [modalEmail, setModalEmail] = React.useState(typeof email === 'string' ? email : '');
    const modalEmailRef = React.useRef();
    const passwordResetClicked = React.useCallback(() => {
        modalEmail.length > 0 && modalEmailRef.current.validity.valid ?
            window.open('https://www.strem.io/reset-password/' + modalEmail, '_blank')
            :
            setError('Invalid email');
    }, [modalEmail]);
    const passwordResetModalButtons = React.useMemo(() => {
        return [
            {
                className: styles['cancel-button'],
                label: 'Cancel',
                props: {
                    onClick: onCloseRequest
                }
            },
            {
                label: 'Send',
                props: {
                    onClick: passwordResetClicked
                }
            }
        ];
    }, [onCloseRequest, passwordResetClicked]);
    const emailOnChange = React.useCallback((event) => {
        setError('');
        setModalEmail(event.currentTarget.value);
    }, []);
    const emailOnSubmit = React.useCallback(() => {
        passwordResetClicked();
    }, [passwordResetClicked]);
    React.useEffect(() => {
        if (routeFocused) {
            modalEmailRef.current.focus();
        }
    }, [routeFocused]);
    return (
        <ModalDialog className={styles['password-reset-modal-container']} title={'Password reset'} buttons={passwordResetModalButtons} onCloseRequest={onCloseRequest}>
            <div className={styles['message']}>Enter your email</div>
            <TextInput
                ref={modalEmailRef}
                className={styles['text-input']}
                type={'email'}
                placeholder={'Email'}
                value={modalEmail}
                onChange={emailOnChange}
                onSubmit={emailOnSubmit}
            />
            {
                error.length > 0 ?
                    <div className={styles['error-message']}>{error}</div>
                    :
                    null
            }
        </ModalDialog>
    );
};

PasswordResetModal.propTypes = {
    email: PropTypes.string,
    onCloseRequest: PropTypes.func
};

module.exports = PasswordResetModal;
