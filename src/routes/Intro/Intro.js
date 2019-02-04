import React, { Component, Fragment } from 'react';
import Icon from 'stremio-icons/dom';
import { Input } from 'stremio-common';
import ConsentCheckbox from './ConsentCheckbox';
import styles from './styles';

const FORMS = {
    LOGIN: '1',
    SIGN_UP: '2'
};

class Intro extends Component {
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
            selectedForm: FORMS.LOGIN,
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
            error: '',
        });
    }

    emailOnChange = (event) => {
        this.setState({ email: event.target.value });
    }

    emailOnSubmit = (event) => {
        event.preventDefault();
        this.passwordRef.current.focus();
    }

    passwordOnChange = (event) => {
        this.setState({ password: event.target.value });
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
        this.setState({ confirmPassword: event.target.value });
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
        } else {
            this.setState({ error: '' });
            alert('Guest login');
        }
    }

    render() {
        return (
            <div className={styles['intro-container']}>
                <div className={styles['overlay']} />
                <div className={styles['scroll-content']}>
                    <div className={styles['form-container']}>
                        <Input className={styles['facebook-button']} type={'button'} onClick={this.loginWithFacebook}>
                            <Icon className={styles['icon']} icon={'ic_facebook'} />
                            <div className={styles['label']}>Login with Facebook</div>
                        </Input>
                        <div className={styles['facebook-statement']}>We won't post anything on your behalf</div>
                        <form onSubmit={this.emailOnSubmit}>
                            <Input ref={this.emailRef} className={styles['text-input']} type={'email'} placeholder={'Email'} value={this.state.email} onChange={this.emailOnChange} />
                        </form>
                        <form onSubmit={this.passwordOnSubmit}>
                            <Input ref={this.passwordRef} className={styles['text-input']} type={'password'} placeholder={'Password'} value={this.state.password} onChange={this.passwordOnChange} />
                        </form>
                        {
                            this.state.selectedForm === FORMS.LOGIN ?
                                <Input className={styles['forgot-password-link']} type={'link'} href={'https://www.strem.io/reset-password/'} target={'_blank'}>Forgot password?</Input>
                                :
                                <Fragment>
                                    <form onSubmit={this.confirmPasswordOnSubmit}>
                                        <Input ref={this.confirmPasswordRef} className={styles['text-input']} type={'password'} placeholder={'Confirm Password'} value={this.state.confirmPassword} onChange={this.confirmPasswordOnChange} />
                                    </form>
                                    <ConsentCheckbox ref={this.termsRef} className={styles['consent-checkbox']} label={'I have read and agree with the Stremio'} link={'Terms and conditions'} href={'https://www.stremio.com/tos'} checked={this.state.termsAccepted} onClick={this.toggleTerms} />
                                    <ConsentCheckbox ref={this.privacyPolicyRef} className={styles['consent-checkbox']} label={'I have read and agree with the Stremio'} link={'Privacy Policy'} href={'https://www.stremio.com/privacy'} checked={this.state.privacyPolicyAccepted} onClick={this.togglePrivacyPolicy} />
                                    <ConsentCheckbox ref={this.marketingRef} className={styles['consent-checkbox']} label={'I agree to receive marketing communications from Stremio'} checked={this.state.marketingAccepted} onClick={this.toggleMarketing} />
                                </Fragment>
                        }
                        {
                            this.state.error.length > 0 ?
                                <div ref={this.errorRef} className={styles['error']}>{this.state.error}</div>
                                :
                                null
                        }
                        <Input className={styles['submit-button']} type={'button'} onClick={this.state.selectedForm === FORMS.LOGIN ? this.loginWithEmail : this.signup}>
                            <div className={styles['label']}>{this.state.selectedForm === FORMS.LOGIN ? 'LOG IN' : 'SING UP'}</div>
                        </Input>
                        {
                            this.state.selectedForm === FORMS.SIGN_UP ?
                                <Input className={styles['guest-login-button']} type={'button'} onClick={this.loginAsGuest}>
                                    <div className={styles['label']}>GUEST LOGIN</div>
                                </Input>
                                :
                                null
                        }
                        <Input className={styles['switch-form-button']} type={'button'} data-form={this.state.selectedForm === FORMS.SIGN_UP ? FORMS.LOGIN : FORMS.SIGN_UP} onClick={this.changeSelectedForm}>
                            <div className={styles['label']}>{this.state.selectedForm === FORMS.SIGN_UP ? 'LOG IN' : 'SING UP WITH EMAIL'}</div>
                        </Input>
                    </div>
                </div>
            </div >
        );
    }
}

export default Intro;
