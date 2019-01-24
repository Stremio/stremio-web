import React, { Component } from 'react';
import Icon from 'stremio-icons/dom';
import CheckboxLabel from './CheckboxLabel';
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

    changeSelectedForm = (event) => {
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
        this.setState(({ termsAccepted }) => {
            return { termsAccepted: !termsAccepted }
        });
    }

    togglePrivacyPolicy = () => {
        this.setState(({ privacyPolicyAccepted }) => ({
            privacyPolicyAccepted: !privacyPolicyAccepted
        }));
    }

    toggleMarketing = () => {
        this.setState(({ marketingAccepted }) => {
            return { marketingAccepted: !marketingAccepted }
        });
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

    loginErrorLabel = (event) => {
        event.preventDefault();
        if (this.state.email.length < 8) {
            this.setState({ error: 'Please enter a valid email' });
        } else {
            if (this.emailRef.current === document.activeElement) {
                this.passwordRef.current.focus();
            }

            if (this.state.password.length < 1) {
                this.setState({ error: 'Wrong email or password.' });
            }
        }
    }

    singUpErrorLabel = (event) => {
        event.preventDefault();
        if (this.state.email.length < 8) {
            this.setState({ error: 'Please enter a valid email' });
        } else {
            if (this.emailRef.current === document.activeElement) {
                this.passwordRef.current.focus();
            }

            if (this.state.password.length < 1) {
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
                        }
                    }
                }
            }
        }
    }

    guestLoginErrorLabel = (event) => {
        if (!this.state.termsAccepted) {
            event.preventDefault();
            this.setState({ error: 'You must accept the Terms of Service' });
        }
    }

    renderSignUpForm = () => {
        return (
            <form className={styles['form-container']} onSubmit={this.singUpErrorLabel}>
                <input ref={this.emailRef} className={styles['email']} type={'text'} placeholder={'Email'} value={this.state.email} onChange={this.emailOnChange} />
                <input ref={this.passwordRef} className={styles['password']} type={'password'} placeholder={'Password'} value={this.state.password} onChange={this.passwordOnChange} />
                <input ref={this.confirmPasswordRef} className={styles['password']} type={'password'} placeholder={'Confirm Password'} value={this.state.confirmPassword} onChange={this.confirmPasswordOnChange} />
                <div className={styles['acceptance-section']}>
                    <CheckboxLabel ref={this.termsRef} className={styles['checkbox-label']} label='I have read and agree with the Stremio' link='Terms and conditions' href='https://www.stremio.com/tos' checked={this.state.termsAccepted} onClick={this.toggleTerms} />
                    <CheckboxLabel ref={this.privacyPolicyRef} className={styles['checkbox-label']} label='I have read and agree with the Stremio' link='Privacy Policy' href='https://www.stremio.com/privacy' checked={this.state.privacyPolicyAccepted} onClick={this.togglePrivacyPolicy} />
                    <CheckboxLabel ref={this.marketingRef} className={styles['checkbox-label']} label='I agree to receive marketing communications from Stremio' checked={this.state.marketingAccepted} onClick={this.toggleMarketing} />
                </div>
                {
                    this.state.error ?
                        <div className={styles['error']}>{this.state.error}</div>
                        :
                        null
                }
                <input className={styles['submit-button']} type={'submit'} value={'SING UP'} />
            </form>
        );
    }

    renderLoginForm = () => {
        return (
            <form className={styles['form-container']} onSubmit={this.loginErrorLabel}>
                <input ref={this.emailRef} className={styles['email']} type={'text'} placeholder={'Email'} value={this.state.email} onChange={this.emailOnChange} />
                <input ref={this.passwordRef} className={styles['password']} type={'password'} placeholder={'Password'} value={this.state.password} onChange={this.passwordOnChange} />
                <a className={styles['forgot-password']} href={'https://www.strem.io/reset-password/'} target={'_blank'}>Forgot password?</a>
                {
                    this.state.error ?
                        <div className={styles['error']}>{this.state.error}</div>
                        :
                        null
                }
                <input className={styles['submit-button']} type={'submit'} value={'LOG IN'} />
            </form>
        );
    }

    renderSelectedMenu = () => {
        switch (this.state.selectedForm) {
            case FORMS.SIGN_UP:
                return this.renderSignUpForm();
            case FORMS.LOGIN:
                return this.renderLoginForm();
            default:
                return null;
        }
    }

    render() {
        return (
            <div className={styles['intro-container']}>
                <div className={styles['overlay']} />
                <div className={styles['intro']}>
                    <div className={styles['facebook-button']}>
                        <Icon className={styles['icon']} icon={'ic_facebook'} />
                        <div className={styles['label']}>Login with Facebook</div>
                    </div>
                    <div className={styles['text']}>We won't post anything on your behalf</div>
                    <div className={styles['or']}>OR</div>
                    {this.renderSelectedMenu()}
                    <div className={styles['option']} data-option={this.state.selectedForm === FORMS.SIGN_UP ? FORMS.LOGIN : FORMS.SIGN_UP} onClick={this.changeSelectedForm}>{this.state.selectedForm === FORMS.SIGN_UP ? 'LOG IN' : 'SING UP WITH EMAIL'}</div>
                    {
                        this.state.selectedForm === FORMS.SIGN_UP ?
                            <a className={styles['option']} href={'#/'} onClick={this.guestLoginErrorLabel}>GUEST LOGIN</a>
                            :
                            null
                    }
                </div>
            </div>
        );
    }
}

export default Intro;
