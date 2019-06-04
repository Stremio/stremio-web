const React = require('react');
const classnames = require('classnames');
const Icon = require('stremio-icons/dom');
const { Input } = require('stremio-navigation');
const ConsentCheckbox = require('./ConsentCheckbox');
const styles = require('./styles');

const FORMS = {
    LOGIN: 'LOGIN',
    SIGN_UP: 'SIGN_UP'
};

class Intro extends React.Component {
    constructor(props) {
        super(props);

        this.emailRef = React.createRef();
        this.passwordRef = React.createRef();
        this.confirmPasswordRef = React.createRef();
        this.termsRef = React.createRef();
        this.privacyPolicyRef = React.createRef();
        this.marketingRef = React.createRef();
        this.errorRef = React.createRef();

        this.state = {
            selectedForm: FORMS.SIGN_UP,
            termsAccepted: false,
            privacyPolicyAccepted: false,
            marketingAccepted: false,
            email: '',
            password: '',
            confirmPassword: '',
            error: ''
        };
    }

    componentDidMount() {
        this.emailRef.current.focus();
    }

    shouldComponentUpdate(nextProps, nextState) {
        return nextState.selectedForm !== this.state.selectedForm ||
            nextState.termsAccepted !== this.state.termsAccepted ||
            nextState.privacyPolicyAccepted !== this.state.privacyPolicyAccepted ||
            nextState.marketingAccepted !== this.state.marketingAccepted ||
            nextState.email !== this.state.email ||
            nextState.password !== this.state.password ||
            nextState.confirmPassword !== this.state.confirmPassword ||
            nextState.error !== this.state.error;
    }

    componentDidUpdate(prevProps, prevState) {
        if (prevState.error !== this.state.error && this.state.error.length > 0) {
            this.errorRef.current.scrollIntoView();
        }

        if (prevState.selectedForm !== this.state.selectedForm) {
            this.emailRef.current.focus();
        }
    }

    changeSelectedForm = (event) => {
        this.setState({
            selectedForm: event.currentTarget.dataset.form,
            termsAccepted: false,
            privacyPolicyAccepted: false,
            marketingAccepted: false,
            email: '',
            password: '',
            confirmPassword: '',
            error: ''
        });
    }

    emailOnChange = (event) => {
        this.setState({ email: event.currentTarget.value });
    }

    emailOnSubmit = (event) => {
        event.preventDefault();
        this.passwordRef.current.focus();
    }

    passwordOnChange = (event) => {
        this.setState({ password: event.currentTarget.value });
    }

    passwordOnSubmit = (event) => {
        event.preventDefault();
        if (this.state.selectedForm === FORMS.LOGIN) {
            this.loginWithEmail();
        } else {
            this.confirmPasswordRef.current.focus();
        }
    }

    confirmPasswordOnChange = (event) => {
        this.setState({ confirmPassword: event.currentTarget.value });
    }

    confirmPasswordOnSubmit = (event) => {
        event.preventDefault();
        this.termsRef.current.focus();
    }

    toggleTerms = () => {
        this.setState(({ termsAccepted }) => ({
            termsAccepted: !termsAccepted
        }));
    }

    togglePrivacyPolicy = () => {
        this.setState(({ privacyPolicyAccepted }) => ({
            privacyPolicyAccepted: !privacyPolicyAccepted
        }));
    }

    toggleMarketing = () => {
        this.setState(({ marketingAccepted }) => ({
            marketingAccepted: !marketingAccepted
        }));
    }

    loginWithFacebook = () => {
        alert('Facebook login');
    }

    loginWithEmail = () => {
        if (this.state.email.length < 8) {
            this.setState({ error: 'Please enter a valid email' });
            return;
        }

        if (this.state.password.length === 0) {
            this.setState({ error: 'Invalid password' });
            return;
        }

        this.setState({ error: '' });
        alert('Email login');
    }

    signup = () => {
        if (this.state.email.length < 8) {
            this.setState({ error: 'Please enter a valid email' });
            return;
        }

        if (this.state.password.length === 0) {
            this.setState({ error: 'Invalid password' });
            return;
        }

        if (this.state.password !== this.state.confirmPassword) {
            this.setState({ error: 'Passwords dont match' });
            return;
        }

        if (!this.state.termsAccepted) {
            this.setState({ error: 'You must accept the Terms of Service' });
            return;
        }

        if (!this.state.privacyPolicyAccepted) {
            this.setState({ error: 'You must accept the Privacy Policy' });
            return;
        }

        this.setState({ error: '' });
        alert('Signup');
    }

    loginAsGuest = () => {
        if (!this.state.termsAccepted) {
            this.setState({ error: 'You must accept the Terms of Service' });
            return;
        }

        this.setState({ error: '' });
        alert('Guest login');
    }

    render() {
        return (
            <div className={styles['intro-container']} tabIndex={-1}>
                <div className={styles['form-container']}>
                    <Input className={classnames(styles['login-form-button'], styles['facebook-button'], 'focusable-with-border')} type={'button'} onClick={this.loginWithFacebook}>
                        <Icon className={styles['icon']} icon={'ic_facebook'} />
                        <div className={styles['label']}>Login with Facebook</div>
                    </Input>
                    <div className={styles['facebook-statement']}>We won't post anything on your behalf</div>
                    <Input
                        ref={this.emailRef}
                        className={styles['text-input']}
                        type={'email'}
                        placeholder={'Email'}
                        value={this.state.email}
                        onChange={this.emailOnChange}
                        onSubmit={this.emailOnSubmit}
                    />
                    <Input
                        ref={this.passwordRef}
                        className={styles['text-input']}
                        type={'password'}
                        placeholder={'Password'}
                        value={this.state.password}
                        onChange={this.passwordOnChange}
                        onSubmit={this.passwordOnSubmit}
                    />
                    {
                        this.state.selectedForm === FORMS.LOGIN ?
                            <div className={styles['forgot-password-link-container']}>
                                <Input className={classnames(styles['forgot-password-link'], 'focusable-with-border')} type={'link'} href={'https://www.strem.io/reset-password/'} target={'_blank'}>Forgot password?</Input>
                            </div>
                            :
                            <React.Fragment>
                                <Input
                                    ref={this.confirmPasswordRef}
                                    className={styles['text-input']}
                                    type={'password'}
                                    placeholder={'Confirm Password'}
                                    value={this.state.confirmPassword}
                                    onChange={this.confirmPasswordOnChange}
                                    onSubmit={this.confirmPasswordOnSubmit}
                                />
                                <ConsentCheckbox
                                    ref={this.termsRef}
                                    className={classnames(styles['consent-checkbox'], 'focusable-with-border')}
                                    label={'I have read and agree with the Stremio'}
                                    link={'Terms and conditions'}
                                    href={'https://www.stremio.com/tos'}
                                    checked={this.state.termsAccepted}
                                    toggle={this.toggleTerms}
                                />
                                <ConsentCheckbox
                                    ref={this.privacyPolicyRef}
                                    className={classnames(styles['consent-checkbox'], 'focusable-with-border')}
                                    label={'I have read and agree with the Stremio'}
                                    link={'Privacy Policy'}
                                    href={'https://www.stremio.com/privacy'}
                                    checked={this.state.privacyPolicyAccepted}
                                    toggle={this.togglePrivacyPolicy}
                                />
                                <ConsentCheckbox
                                    ref={this.marketingRef}
                                    className={classnames(styles['consent-checkbox'], 'focusable-with-border')}
                                    label={'I agree to receive marketing communications from Stremio'}
                                    checked={this.state.marketingAccepted}
                                    toggle={this.toggleMarketing}
                                />
                            </React.Fragment>
                    }
                    {
                        this.state.error.length > 0 ?
                            <div ref={this.errorRef} className={styles['error-message']}>{this.state.error}</div>
                            :
                            null
                    }
                    <Input className={classnames(styles['login-form-button'], styles['submit-button'], 'focusable-with-border')} type={'button'} onClick={this.state.selectedForm === FORMS.LOGIN ? this.loginWithEmail : this.signup}>
                        <div className={styles['label']}>{this.state.selectedForm === FORMS.LOGIN ? 'LOG IN' : 'SING UP'}</div>
                    </Input>
                    {
                        this.state.selectedForm === FORMS.SIGN_UP ?
                            <Input className={classnames(styles['login-form-button'], styles['guest-login-button'], 'focusable-with-border')} type={'button'} onClick={this.loginAsGuest}>
                                <div className={styles['label']}>GUEST LOGIN</div>
                            </Input>
                            :
                            null
                    }
                    <Input className={classnames(styles['login-form-button'], styles['switch-form-button'], 'focusable-with-border')} type={'button'} data-form={this.state.selectedForm === FORMS.SIGN_UP ? FORMS.LOGIN : FORMS.SIGN_UP} onClick={this.changeSelectedForm}>
                        <div className={styles['label']}>{this.state.selectedForm === FORMS.SIGN_UP ? 'LOG IN' : 'SING UP WITH EMAIL'}</div>
                    </Input>
                </div>
            </div>
        );
    }
}

module.exports = Intro;
