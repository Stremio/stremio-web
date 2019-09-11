const React = require('react');
const classnames = require('classnames');
const UrlUtils = require('url');
const Icon = require('stremio-icons/dom');
const { Button, routesRegexp, useLocationHash } = require('stremio/common');
const CredentialsTextInput = require('./CredentialsTextInput');
const ConsentCheckbox = require('./ConsentCheckbox');
const styles = require('./styles');

const LOGIN_FORM = 'LOGIN_FORM';
const SIGNUP_FORM = 'SIGNUP_FORM';

const Intro = () => {
    const locationHash = useLocationHash();
    const active = React.useMemo(() => {
        const { pathname: locationPathname } = UrlUtils.parse(locationHash.slice(1));
        return !!locationPathname.match(routesRegexp.intro.regexp);
    }, [locationHash]);
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
                case 'switch-form':
                    return {
                        form: state.form === SIGNUP_FORM ? LOGIN_FORM : SIGNUP_FORM,
                        email: '',
                        password: '',
                        confirmPassword: '',
                        termsAccepted: false,
                        privacyPolicyAccepted: false,
                        marketingAccepted: false,
                        error: ''
                    };
                case 'change-credentials':
                    return {
                        ...state,
                        [action.name]: action.value
                    };
                case 'toggle-checkbox':
                    return {
                        ...state,
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
            form: SIGNUP_FORM,
            email: '',
            password: '',
            confirmPassword: '',
            termsAccepted: false,
            privacyPolicyAccepted: false,
            marketingAccepted: false,
            error: ''
        }
    );
    const loginWithFacebook = React.useCallback(() => {
        alert('TODO: Facebook login');
    }, []);
    const loginWithEmail = React.useCallback(() => {
        if (typeof state.email !== 'string' || state.email.length === 0) {
            dispatch({ type: 'error', error: 'Invalid email' });
            return;
        }

        alert('TODO: Login');
    }, [state.email, state.password]);
    const loginAsGuest = React.useCallback(() => {
        if (!state.termsAccepted) {
            dispatch({ type: 'error', error: 'You must accept the Terms of Service' });
            return;
        }

        alert('TODO: Guest login');
    }, [state.termsAccepted, state.privacyPolicyAccepted, state.marketingAccepted]);
    const signup = React.useCallback(() => {
        alert('TODO: Signup');
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
    const switchForm = React.useCallback(() => {
        dispatch({ type: 'switch-form' });
    }, []);
    React.useEffect(() => {
        if (typeof state.error === 'string' && state.error.length > 0) {
            errorRef.current.scrollIntoView();
        }
    }, [state.error]);
    React.useEffect(() => {
        if (active) {
            emailRef.current.focus();
        }
    }, [state.form, active]);
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
                    className={styles['text-input']}
                    type={'email'}
                    placeholder={'Email'}
                    value={state.email}
                    onChange={emailOnChange}
                    onSubmit={emailOnSubmit}
                />
                <CredentialsTextInput
                    ref={passwordRef}
                    className={styles['text-input']}
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
                                className={styles['text-input']}
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
                <Button className={classnames(styles['form-button'], styles['switch-form-button'])} onClick={switchForm}>
                    <div className={styles['label']}>{state.form === SIGNUP_FORM ? 'LOG IN' : 'SING UP WITH EMAIL'}</div>
                </Button>
            </div>
        </div>
    );
};

module.exports = Intro;
