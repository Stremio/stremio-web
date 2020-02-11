const React = require('react');
const PropTypes = require('prop-types');
const { useRouteFocused } = require('stremio-router');
const { ModalDialog } = require('stremio/common');
const CredentialsTextInput = require('../CredentialsTextInput');
const styles = require('./styles');

const PasswordResetModal = ({ email, onCloseRequest }) => {
    const routeFocused = useRouteFocused();
    const [error, setError] = React.useState('');
    const еmailRef = React.useRef(null);
    const goToPasswordReset = React.useCallback(() => {
        еmailRef.current.value.length > 0 && еmailRef.current.validity.valid ?
            window.open('https://www.strem.io/reset-password/' + еmailRef.current.value, '_blank')
            :
            setError('Invalid email');
    }, []);
    const passwordResetOnClick = React.useCallback(() => {
        goToPasswordReset();
    }, []);
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
                    onClick: passwordResetOnClick
                }
            }
        ];
    }, [onCloseRequest, passwordResetOnClick]);
    const emailOnChange = React.useCallback(() => {
        setError('');
    }, []);
    const emailOnSubmit = React.useCallback(() => {
        goToPasswordReset();
    }, []);
    React.useEffect(() => {
        if (routeFocused) {
            еmailRef.current.focus();
        }
    }, [routeFocused]);
    return (
        <ModalDialog className={styles['password-reset-modal-container']} title={'Password reset'} buttons={passwordResetModalButtons} onCloseRequest={onCloseRequest}>
            <div className={styles['message']}>Enter your email</div>
            <CredentialsTextInput
                ref={еmailRef}
                className={styles['credentials-text-input']}
                type={'email'}
                placeholder={'Email'}
                defaultValue={typeof email === 'string' ? email : ''}
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
