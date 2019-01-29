import React, { Component, Fragment } from 'react';
import Icon from 'stremio-icons/dom';
import { Button, Input, Link } from 'stremio-common';
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

    changeSelectedForm = (event) => {
        event.currentTarget.blur();
        this.setState({
            selectedForm: event.currentTarget.dataset.option,
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

    passwordOnChange = (event) => {
        this.setState({ password: event.target.value });
    }

    confirmPasswordOnChange = (event) => {
        this.setState({ confirmPassword: event.target.value });
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

    loginOnSubmit = (event) => {
        event.preventDefault();
        if (this.state.email.length < 8) {
            this.setState({ error: 'Please enter a valid email' });
        } else {
            if (this.emailRef.current === document.activeElement) {
                this.passwordRef.current.focus();
            }

            if (this.state.password.length === 0) {
                this.setState({ error: 'Invalid password' });
            }
        }
    }

    signUpOnSubmit = (event) => {
        event.preventDefault();
        if (this.state.email.length < 8) {
            this.setState({ error: 'Please enter a valid email' });
        } else {
            if (this.emailRef.current === document.activeElement) {
                this.passwordRef.current.focus();
            }

            if (this.state.password.length === 0) {
                this.setState({ error: 'Invalid password' });
            } else {
                if (this.passwordRef.current === document.activeElement) {
                    this.confirmPasswordRef.current.focus();
                }

                if (this.state.password !== this.state.confirmPassword) {
                    this.setState({ error: 'Passwords dont match' });
                } else {
                    if (this.confirmPasswordRef.current === document.activeElement) {
                        this.termsRef.current.focus();
                    }

                    if (!this.state.termsAccepted) {
                        this.setState({ error: 'You must accept the Terms of Service' });
                    } else {
                        if (this.termsRef.current === document.activeElement) {
                            this.privacyPolicyRef.current.focus();
                        }

                        if (!this.state.privacyPolicyAccepted) {
                            this.setState({ error: 'You must accept the Privacy Policy' });
                        } else {
                            if (this.privacyPolicyRef.current === document.activeElement) {
                                this.marketingRef.current.focus();
                            }
                            this.setState({ error: '' });
                        }
                    }
                }
            }
        }
    }

    guestLoginOnSubmit = () => {
        if (!this.state.termsAccepted) {
            this.setState({ error: 'You must accept the Terms of Service' });
        }
    }

    render() {
        return (
            <div className={styles['intro-container']}>
                <div className={styles['overlay']} />
                <div className={styles['scroll-container']}>
                    <div className={styles['intro']}>
                        <Button className={styles['facebook-button']}>
                            <Icon className={styles['icon']} icon={'ic_facebook'} />
                            <div className={styles['label']}>Login with Facebook</div>
                        </Button>
                        <div className={styles['facebook-statement']}>We won't post anything on your behalf</div>
                        <form className={styles['form-container']} onSubmit={this.state.selectedForm === FORMS.LOGIN ? this.loginOnSubmit : this.signUpOnSubmit}>
                            <Input ref={this.emailRef} className={styles['text-input']} type={'text'} placeholder={'Email'} value={this.state.email} onChange={this.emailOnChange} />
                            <Input ref={this.passwordRef} className={styles['text-input']} type={'password'} placeholder={'Password'} value={this.state.password} onChange={this.passwordOnChange} />
                            {
                                this.state.selectedForm === FORMS.LOGIN ?
                                    <Link className={styles['forgot-password']} href={'https://www.strem.io/reset-password/'} target={'_blank'}>Forgot password?</Link>
                                    :
                                    <Fragment>
                                        <Input ref={this.confirmPasswordRef} className={styles['text-input']} type={'password'} placeholder={'Confirm Password'} value={this.state.confirmPassword} onChange={this.confirmPasswordOnChange} />
                                        <ConsentCheckbox ref={this.termsRef} className={styles['consent-checkbox']} label={'I have read and agree wead and agree wead and agree wead and agree wead and agree wead and agree w ead and agree wead and agree wead and agree w ead and agree wead and agree wead and agree wead and agree w ead and agree wead and agree wead and agree w ead and agree wead and agree wead and agree wead and agree wead and agree wead and agree w ead and agree wead and agree wead and agree wead and agree w ead and agree wead and agree wead and agree wead and agree w ith the Stremio'} link={'Terms and conditions'} href={'https://www.stremio.com/tos'} checked={this.state.termsAccepted} onClick={this.toggleTerms} />
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
                            <Input className={styles['submit-button']} type={'submit'} value={this.state.selectedForm === FORMS.LOGIN ? 'LOG IN' : 'SING UP'} />
                        </form>

                        <Button className={styles['switch-form-button']} data-option={this.state.selectedForm === FORMS.SIGN_UP ? FORMS.LOGIN : FORMS.SIGN_UP} onClick={this.changeSelectedForm}>{this.state.selectedForm === FORMS.SIGN_UP ? 'LOG IN' : 'SING UP WITH EMAIL'}</Button>
                        {
                            this.state.selectedForm === FORMS.SIGN_UP ?
                                <Button className={styles['guest-login-button']} onClick={this.guestLoginOnSubmit}>GUEST LOGIN</Button>
                                :
                                null
                        }
                    </div>
                </div>
            </div>
        );
    }
}

export default Intro;
