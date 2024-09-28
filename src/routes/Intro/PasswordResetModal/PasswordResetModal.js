// Copyright (C) 2017-2023 Smart code 203358507

const React = require('react');
const PropTypes = require('prop-types');
const { useRouteFocused } = require('stremio-router');
const { ModalDialog } = require('stremio/common');
const CredentialsTextInput = require('../CredentialsTextInput');
const styles = require('./styles');

const PasswordResetModal = ({ email, onCloseRequest }) => {
    const routeFocused = useRouteFocused();
    const [error, setError] = React.useState('');
    const emailRef = React.useRef(null);
    const goToPasswordReset = React.useCallback(() => {
        emailRef.current.value.length > 0 && emailRef.current.validity.valid ?
            window.open('https://www.strem.io/reset-password/' + emailRef.current.value, '_blank')
            :
            setError('Invalid email');
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
                    onClick: goToPasswordReset
                }
            }
        ];
    }, [onCloseRequest]);
    const emailOnChange = React.useCallback(() => {
        setError('');
    }, []);
    React.useEffect(() => {
        if (routeFocused) {
            emailRef.current.focus();
        }
    }, [routeFocused]);
    return (
        <ModalDialog className={styles['password-reset-modal-container']} title={'Password reset'} buttons={passwordResetModalButtons} onCloseRequest={onCloseRequest}>
            <CredentialsTextInput
                ref={emailRef}
                className={styles['credentials-text-input']}
                type={'email'}
                placeholder={'Email'}
                defaultValue={typeof email === 'string' ? email : ''}
                onChange={emailOnChange}
                onSubmit={goToPasswordReset}
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
