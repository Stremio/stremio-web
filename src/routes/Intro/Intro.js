const React = require('react');
const classnames = require('classnames');
const Icon = require('stremio-icons/dom');
const { useRouteFocused } = require('stremio-router');
const { Button } = require('stremio/common');
const { useServices } = require('stremio/services');
const CredentialsTextInput = require('./CredentialsTextInput');
const ConsentCheckbox = require('./ConsentCheckbox');
const styles = require('./styles');

const SIGNUP_FORM = 'signup';

const Intro = ({ queryParams }) => {
    const { core } = useServices();
    const routeFocused = useRouteFocused();
    const emailRef = React.useRef();
    const passwordRef = React.useRef();
    const confirmPasswordRef = React.useRef();
    const termsRef = React.useRef();
    const privacyPolicyRef = React.useRef();
    const marketingRef = React.useRef();
    const errorRef = React.useRef();
    const [state, dispatch] = React.useReducer(
        (state, action) => {
            switch (action.type) {
                case 'set-form':
                    if (state.form !== action.form) {
                        return {
                            form: action.form,
                            email: '',
                            password: '',
                            confirmPassword: '',
                            termsAccepted: false,
                            privacyPolicyAccepted: false,
                            marketingAccepted: false,
                            error: ''
                        };
                    }
                    return state;
                case 'change-credentials':
                    return {
                        ...state,
                        error: '',
                        [action.name]: action.value
                    };
                case 'toggle-checkbox':
                    return {
                        ...state,
                        error: '',
                        [action.name]: !state[action.name]
                    };
                case 'error':
                    return {
                        ...state,
                        error: action.error
                    };
                default:
                    return state;
            }
        },
        {
            form: queryParams.get('form'),
            email: '',
            password: '',
            confirmPassword: '',
            termsAccepted: false,
            privacyPolicyAccepted: false,
            marketingAccepted: false,
            error: ''
        }
    );
    React.useEffect(() => {
        const onEvent = ({ event, args }) => {
            if (event === 'CtxActionErr') {
                dispatch({ type: 'error', error: args[1].args.message });
            }
            if (event === 'CtxChanged') {
                const state = core.getState();
                if (state.ctx.content.auth !== null) {
                    window.location.replace('#/');
                }
            }
        };
        core.on('Event', onEvent);
        return () => {
            core.off('Event', onEvent);
        };
    }, []);
    const loginWithFacebook = React.useCallback(() => {
        FB.login((response) => {
            if (response.status === 'connected') {
                fetch('https://www.strem.io/fb-login-with-token/' + encodeURIComponent(response.authResponse.accessToken), { timeout: 10 * 1000 })
                    .then((resp) => {
                        if (resp.status < 200 || resp.status >= 300) {
                            throw new Error('Login failed at getting token from Stremio with status ' + resp.status);
                        } else {
                            return resp.json();
                        }
                    })
                    .then(() => {
                        core.dispatch({
                            action: 'UserOp',
                            args: {
                                userOp: 'Login',
                                args: {
                                    email: state.email,
                                    password: response.authResponse.accessToken
                                }
                            }
                        });
                    })
                    .catch((err) => {
                        console.error(err);
                    });
            }
        });
    }, [state.email, state.password]);
    const loginWithEmail = React.useCallback(() => {
        if (typeof state.email !== 'string' || state.email.length === 0) {
            dispatch({ type: 'error', error: 'Invalid email' });
            return;
        }
        if (state.password.length === 0) {
            dispatch({ type: 'error', error: 'Invalid password' });
            return;
        }
        core.dispatch({
            action: 'UserOp',
            args: {
                userOp: 'Login',
                args: {
                    email: state.email,
                    password: state.password
                }
            }
        });
    }, [state.email, state.password]);
    const loginAsGuest = React.useCallback(() => {
        if (!state.termsAccepted) {
            dispatch({ type: 'error', error: 'You must accept the Terms of Service' });
            return;
        }
        core.dispatch({
            action: 'UserOp',
            args: {
                userOp: 'Logout'
            }
        });
        location = '#/';
    }, [state.termsAccepted]);
    const signup = React.useCallback(() => {
        if (!state.termsAccepted) {
            dispatch({ type: 'error', error: 'You must accept the Terms of Service' });
            return;
        }
        if (!state.privacyPolicyAccepted) {
            dispatch({ type: 'error', error: 'You must accept the Privacy Policy' });
            return;
        }
        if (state.password !== state.confirmPassword) {
            dispatch({ type: 'error', error: 'Passwords do not match' });
            return;
        }
        core.dispatch({
            action: 'UserOp',
            args: {
                userOp: 'Register',
                args: {
                    email: state.email,
                    password: state.password,
                    gdpr_consent: {
                        tos: state.termsAccepted,
                        privacy: state.privacyPolicyAccepted,
                        marketing: state.marketingAccepted,
                        time: new Date(),
                        from: 'web'
                    }
                }
            }
        });
    }, [state.email, state.password, state.confirmPassword, state.termsAccepted, state.privacyPolicyAccepted, state.marketingAccepted]);
    const emailOnChange = React.useCallback((event) => {
        dispatch({
            type: 'change-credentials',
            name: 'email',
            value: event.currentTarget.value
        });
    }, []);
    const emailOnSubmit = React.useCallback(() => {
        passwordRef.current.focus();
    }, []);
    const passwordOnChange = React.useCallback((event) => {
        dispatch({
            type: 'change-credentials',
            name: 'password',
            value: event.currentTarget.value
        });
    }, []);
    const passwordOnSubmit = React.useCallback(() => {
        if (state.form === SIGNUP_FORM) {
            confirmPasswordRef.current.focus();
        } else {
            loginWithEmail();
        }
    }, [state.form, loginWithEmail]);
    const confirmPasswordOnChange = React.useCallback((event) => {
        dispatch({
            type: 'change-credentials',
            name: 'confirmPassword',
            value: event.currentTarget.value
        });
    }, []);
    const confirmPasswordOnSubmit = React.useCallback(() => {
        termsRef.current.focus();
    }, []);
    const toggleTermsAccepted = React.useCallback(() => {
        dispatch({ type: 'toggle-checkbox', name: 'termsAccepted' });
    }, []);
    const togglePrivacyPolicyAccepted = React.useCallback(() => {
        dispatch({ type: 'toggle-checkbox', name: 'privacyPolicyAccepted' });
    }, []);
    const toggleMarketingAccepted = React.useCallback(() => {
        dispatch({ type: 'toggle-checkbox', name: 'marketingAccepted' });
    }, []);
    React.useEffect(() => {
        dispatch({ type: 'set-form', form: queryParams.get('form') });
    }, [queryParams]);
    React.useEffect(() => {
        if (typeof state.error === 'string' && state.error.length > 0) {
            errorRef.current.scrollIntoView();
        }
    }, [state.error]);
    React.useEffect(() => {
        if (routeFocused) {
            emailRef.current.focus();
        }
    }, [state.form, routeFocused]);
    return (
        <div className={styles['intro-container']}>
            <div className={styles['form-container']}>
                <Button className={classnames(styles['form-button'], styles['facebook-button'])} onClick={loginWithFacebook}>
                    <Icon className={styles['icon']} icon={'ic_facebook'} />
                    <div className={styles['label']}>Continue with Facebook</div>
                </Button>
                <div className={styles['facebook-statement']}>We won't post anything on your behalf</div>
                <CredentialsTextInput
                    ref={emailRef}
                    className={styles['credentials-text-input']}
                    type={'email'}
                    placeholder={'Email'}
                    value={state.email}
                    onChange={emailOnChange}
                    onSubmit={emailOnSubmit}
                />
                <CredentialsTextInput
                    ref={passwordRef}
                    className={styles['credentials-text-input']}
                    type={'password'}
                    placeholder={'Password'}
                    value={state.password}
                    onChange={passwordOnChange}
                    onSubmit={passwordOnSubmit}
                />
                {
                    state.form === SIGNUP_FORM ?
                        <React.Fragment>
                            <CredentialsTextInput
                                ref={confirmPasswordRef}
                                className={styles['credentials-text-input']}
                                type={'password'}
                                placeholder={'Confirm Password'}
                                value={state.confirmPassword}
                                onChange={confirmPasswordOnChange}
                                onSubmit={confirmPasswordOnSubmit}
                            />
                            <ConsentCheckbox
                                ref={termsRef}
                                className={styles['consent-checkbox']}
                                label={'I have read and agree with the Stremio'}
                                link={'Terms and conditions'}
                                href={'https://www.stremio.com/tos'}
                                checked={state.termsAccepted}
                                toggle={toggleTermsAccepted}
                            />
                            <ConsentCheckbox
                                ref={privacyPolicyRef}
                                className={styles['consent-checkbox']}
                                label={'I have read and agree with the Stremio'}
                                link={'Privacy Policy'}
                                href={'https://www.stremio.com/privacy'}
                                checked={state.privacyPolicyAccepted}
                                toggle={togglePrivacyPolicyAccepted}
                            />
                            <ConsentCheckbox
                                ref={marketingRef}
                                className={styles['consent-checkbox']}
                                label={'I agree to receive marketing communications from Stremio'}
                                checked={state.marketingAccepted}
                                toggle={toggleMarketingAccepted}
                            />
                        </React.Fragment>
                        :
                        <div className={styles['forgot-password-link-container']}>
                            <Button className={styles['forgot-password-link']} href={'https://www.strem.io/reset-password/'} target={'_blank'}>Forgot password?</Button>
                        </div>
                }
                {
                    state.error.length > 0 ?
                        <div ref={errorRef} className={styles['error-message']}>{state.error}</div>
                        :
                        null
                }
                <Button className={classnames(styles['form-button'], styles['submit-button'])} onClick={state.form === SIGNUP_FORM ? signup : loginWithEmail}>
                    <div className={styles['label']}>{state.form === SIGNUP_FORM ? 'SING UP' : 'LOG IN'}</div>
                </Button>
                {
                    state.form === SIGNUP_FORM ?
                        <Button className={classnames(styles['form-button'], styles['guest-login-button'])} onClick={loginAsGuest}>
                            <div className={styles['label']}>GUEST LOGIN</div>
                        </Button>
                        :
                        null
                }
                <Button className={classnames(styles['form-button'], styles['switch-form-button'])} href={state.form === SIGNUP_FORM ? '#/intro?form=login' : '#/intro?form=signup'}>
                    <div className={styles['label']}>{state.form === SIGNUP_FORM ? 'LOG IN' : 'SING UP WITH EMAIL'}</div>
                </Button>
            </div>
        </div>
    );
};

module.exports = Intro;
