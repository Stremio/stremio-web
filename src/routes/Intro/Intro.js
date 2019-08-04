const React = require('react');
const classnames = require('classnames');
const Icon = require('stremio-icons/dom');
const { Button, Input } = require('stremio/common');
const ConsentCheckbox = require('./ConsentCheckbox');
require('./styles');

const LOGIN_FORM = 'LOGIN_FORM';
const SIGNUP_FORM = 'SIGNUP_FORM';

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
            selectedForm: SIGNUP_FORM,
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

    emailOnSubmit = () => {
        this.passwordRef.current.focus();
    }

    passwordOnChange = (event) => {
        this.setState({ password: event.currentTarget.value });
    }

    passwordOnSubmit = () => {
        if (this.state.selectedForm === SIGNUP_FORM) {
            this.confirmPasswordRef.current.focus();
        } else {
            this.loginWithEmail();
        }
    }

    confirmPasswordOnChange = (event) => {
        this.setState({ confirmPassword: event.currentTarget.value });
    }

    confirmPasswordOnSubmit = () => {
        this.termsRef.current.focus();
    }

    toggleTermsAccepted = () => {
        this.setState(({ termsAccepted }) => ({
            termsAccepted: !termsAccepted
        }));
    }

    togglePrivacyPolicyAccepted = () => {
        this.setState(({ privacyPolicyAccepted }) => ({
            privacyPolicyAccepted: !privacyPolicyAccepted
        }));
    }

    toggleMarketingAccepted = () => {
        this.setState(({ marketingAccepted }) => ({
            marketingAccepted: !marketingAccepted
        }));
    }

    loginWithFacebook = () => {
        alert('TODO: Facebook login');
    }

    loginWithEmail = () => {
        if (this.state.email.length === 0) {
            this.setState({ error: 'Invalid email' });
            return;
        }

        if (this.state.password.length === 0) {
            this.setState({ error: 'Invalid password' });
            return;
        }

        this.setState({ error: '' });
        alert('TODO: Email login');
    }

    signup = () => {
        if (this.state.email.length === 0) {
            this.setState({ error: 'Invalid email' });
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
        alert('TODO: Signup');
    }

    loginAsGuest = () => {
        if (!this.state.termsAccepted) {
            this.setState({ error: 'You must accept the Terms of Service' });
            return;
        }

        if (!this.state.privacyPolicyAccepted) {
            this.setState({ error: 'You must accept the Privacy Policy' });
            return;
        }

        this.setState({ error: '' });
        alert('TODO: Guest login');
    }

    render() {
        return (
            <div className={'intro-container'}>
                <div className={'form-container'}>
                    <Button className={classnames('form-button', 'facebook-button')} onClick={this.loginWithFacebook}>
                        <Icon className={'icon'} icon={'ic_facebook'} />
                        <div className={'label'}>Continue with Facebook</div>
                    </Button>
                    <div className={'facebook-statement'}>We won't post anything on your behalf</div>
                    <Input
                        ref={this.emailRef}
                        className={'text-input'}
                        type={'email'}
                        placeholder={'Email'}
                        value={this.state.email}
                        onChange={this.emailOnChange}
                        onSubmit={this.emailOnSubmit}
                    />
                    <Input
                        ref={this.passwordRef}
                        className={'text-input'}
                        type={'password'}
                        placeholder={'Password'}
                        value={this.state.password}
                        onChange={this.passwordOnChange}
                        onSubmit={this.passwordOnSubmit}
                    />
                    {
                        this.state.selectedForm === SIGNUP_FORM ?
                            <React.Fragment>
                                <Input
                                    ref={this.confirmPasswordRef}
                                    className={'text-input'}
                                    type={'password'}
                                    placeholder={'Confirm Password'}
                                    value={this.state.confirmPassword}
                                    onChange={this.confirmPasswordOnChange}
                                    onSubmit={this.confirmPasswordOnSubmit}
                                />
                                <ConsentCheckbox
                                    ref={this.termsRef}
                                    className={'consent-checkbox'}
                                    label={'I have read and agree with the Stremio'}
                                    link={'Terms and conditions'}
                                    href={'https://www.stremio.com/tos'}
                                    checked={this.state.termsAccepted}
                                    toggle={this.toggleTermsAccepted}
                                />
                                <ConsentCheckbox
                                    ref={this.privacyPolicyRef}
                                    className={'consent-checkbox'}
                                    label={'I have read and agree with the Stremio'}
                                    link={'Privacy Policy'}
                                    href={'https://www.stremio.com/privacy'}
                                    checked={this.state.privacyPolicyAccepted}
                                    toggle={this.togglePrivacyPolicyAccepted}
                                />
                                <ConsentCheckbox
                                    ref={this.marketingRef}
                                    className={'consent-checkbox'}
                                    label={'I agree to receive marketing communications from Stremio'}
                                    checked={this.state.marketingAccepted}
                                    toggle={this.toggleMarketingAccepted}
                                />
                            </React.Fragment>
                            :
                            <div className={'forgot-password-link-container'}>
                                <Button className={'forgot-password-link'} href={'https://www.strem.io/reset-password/'} target={'_blank'}>Forgot password?</Button>
                            </div>
                    }
                    {
                        this.state.error.length > 0 ?
                            <div ref={this.errorRef} className={'error-message'}>{this.state.error}</div>
                            :
                            null
                    }
                    <Button className={classnames('form-button', 'submit-button')} onClick={this.state.selectedForm === SIGNUP_FORM ? this.signup : this.loginWithEmail}>
                        <div className={'label'}>{this.state.selectedForm === SIGNUP_FORM ? 'SING UP' : 'LOG IN'}</div>
                    </Button>
                    {
                        this.state.selectedForm === SIGNUP_FORM ?
                            <Button className={classnames('form-button', 'guest-login-button')} onClick={this.loginAsGuest}>
                                <div className={'label'}>GUEST LOGIN</div>
                            </Button>
                            :
                            null
                    }
                    <Button className={classnames('form-button', 'switch-form-button')} data-form={this.state.selectedForm === SIGNUP_FORM ? LOGIN_FORM : SIGNUP_FORM} onClick={this.changeSelectedForm}>
                        <div className={'label'}>{this.state.selectedForm === SIGNUP_FORM ? 'LOG IN' : 'SING UP WITH EMAIL'}</div>
                    </Button>
                </div>
            </div>
        );
    }
}

module.exports = Intro;
