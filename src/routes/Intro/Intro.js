import React, { Component } from 'react';
import Icon from 'stremio-icons/dom';
import { Checkbox } from 'stremio-common';
import styles from './styles';

class Intro extends Component {
    constructor(props) {
        super(props);

        this.emailRef = React.createRef();
        this.passwordRef = React.createRef();
        this.confirmPasswordRef = React.createRef();

        this.state = {
            selectedOption: 'signUp',
            termsAccepted: false,
            privacyPolicyAccepted: false,
            communicationsAccepted: false,
            email: '',
            password: '',
            error: ''
        };
    }

    changeSelectedOption = (event) => {
        this.setState({ selectedOption: event.currentTarget.dataset.option,
            termsAccepted: false,
            privacyPolicyAccepted: false,
            communicationsAccepted: false,
            email: '',
            password: '',
            error: '', });
    }

    emailOnChange = (event) => {
        this.setState({ email: event.target.value });
    }

    passwordOnChange = (event) => {
        this.setState({ password: event.target.value });
    }

    toggleTerms = () => {
        this.setState(({ termsAccepted }) => {
            return { termsAccepted: !termsAccepted }
        });
    }

    togglePrivacyPolicy = () => {
        this.setState(({ privacyPolicyAccepted }) => {
            return { privacyPolicyAccepted: !privacyPolicyAccepted }
        });
    }

    toggleCommunications = () => {
        this.setState(({ communicationsAccepted }) => {
            return { communicationsAccepted: !communicationsAccepted }
        });
    }

    shouldComponentUpdate(nextProps, nextState) {
        return nextState.selectedOption !== this.state.selectedOption ||
            nextState.termsAccepted !== this.state.termsAccepted ||
            nextState.privacyPolicyAccepted !== this.state.privacyPolicyAccepted ||
            nextState.communicationsAccepted !== this.state.communicationsAccepted ||
            nextState.email !== this.state.email ||
            nextState.password !== this.state.password ||
            nextState.error !== this.state.error;
    }

    renderAcceptanceOption({ accept, label, href, checked, onClick }) {
        return (
            <label className={styles['toggle-option']}>
                <div className={styles['checkbox-container']}>
                    <Checkbox className={styles['checkbox']} checked={checked} disabled={false} onClick={onClick} />
                </div>
                <div className={styles['accept']}>{accept}
                    <span>&nbsp;</span>
                    <a href={href} target={'_blank'} tabIndex={'-1'} className={styles['acceptance-label']}>{label}</a>
                </div>
            </label>
        );
    }

    loginErrorLabel = () => {
        if (this.state.email.length < 8) {
            event.preventDefault();
            this.setState({ error: 'Please enter a valid email' });
        } else {
            if (this.state.password.length < 1) {
                event.preventDefault();
                this.setState({ error: 'Wrong email or password. In case you have forgotten your password, click here.' });
            }
        }
    }

    singUpErrorLabel = () => {
        if (this.state.email.length < 8) {
            event.preventDefault();
            this.setState({ error: 'Please enter a valid email' });
        } else {
            if (!this.state.termsAccepted) {
                event.preventDefault();
                this.setState({ error: 'You must accept the Terms of Service' });
            } else {
                if (!this.state.privacyPolicyAccepted) {
                    event.preventDefault();
                    this.setState({ error: 'You must accept the Privacy Policy' });
                } else {
                    if (this.state.password.length < 1) {
                        event.preventDefault();
                        this.setState({ error: 'Invalid password' });
                    } else {
                        this.setState({ error: 'Passwords dont match' });
                    }
                }
            }
        }
    }

    guestLoginErrorLabel = () => {
        if (!this.state.termsAccepted) {
            event.preventDefault();
            this.setState({ error: 'You must accept the Terms of Service' });
        }
    }

    focusNextRef = (event) => {
        if(event.keyCode === 13 && this.state.email.length > 7) {
            this.passwordRef.current.focus();
        }
    }

    renderSignUpForm = () => {
        return (
            <form className={styles['login-form']}>
                <div className={styles['fb-button']}>
                    <Icon className={styles['icon']} icon={'ic_facebook'} />
                    <div className={styles['label']}>Login with Facebook</div>
                </div>
                <div className={styles['text']}>We won't post anything on your behalf</div>
                <div className={styles['or']}>OR</div>
                <input ref={this.emailRef} onKeyDown={this.focusNextRef} className={styles['email']} type={'text'} placeholder={'Email'} value={this.state.email} onChange={this.emailOnChange} />
                <input ref={this.passwordRef} onKeyDown={this.focusNextRef} className={styles['password']} type={'password'} placeholder={'Password'} value={this.state.password} onChange={this.passwordOnChange} />
                <input ref={this.confirmPasswordRef} className={styles['password']} type={'password'} placeholder={'Confirm Password'} />
                <div className={styles['acceptance-section']}>
                    {this.renderAcceptanceOption({ accept: 'I have read and agree with the Stremio', label: 'Terms and conditions', href: 'https://www.stremio.com/tos', checked: this.state.termsAccepted, onClick: this.toggleTerms })}
                    {this.renderAcceptanceOption({ accept: 'I have read and agree with the Stremio', label: 'Privacy Policy', href: 'https://www.stremio.com/privacy', checked: this.state.privacyPolicyAccepted, onClick: this.togglePrivacyPolicy })}
                    {this.renderAcceptanceOption({ accept: 'I agree to receive marketing communications from Stremio', checked: this.state.communicationsAccepted, onClick: this.toggleCommunications })}
                </div>
                {
                    this.state.error ?
                        <div className={styles['error']}>{this.state.error}</div>
                        :
                        null
                }
                <input className={styles['submit-button']} type={'submit'} value={'SING UP'} onClick={this.singUpErrorLabel}>
                </input>
                <div className={styles['option']} data-option={'login'} onClick={this.changeSelectedOption}>LOG IN</div>
                <a href={'#/'} className={styles['option']} onClick={this.guestLoginErrorLabel}>GUEST LOGIN</a>
            </form>
        );
    }

    renderLoginForm = () => {
        return (
            <form className={styles['login-form']}>
                <div className={styles['fb-button']}>
                    <Icon className={styles['icon']} icon={'ic_facebook'} />
                    <div className={styles['label']}>Login with Facebook</div>
                </div>
                <div className={styles['text']}>We won't post anything on your behalf</div>
                <div className={styles['or']}>OR</div>
                <input ref={this.emailRef} className={styles['email']} type={'text'} placeholder={'Email'} value={this.state.email} onChange={this.emailOnChange} />
                <input ref={this.passwordRef} className={styles['password']} type={'password'} placeholder={'Password'} value={this.state.password} onChange={this.passwordOnChange} />
                {
                    this.state.error ?
                        <div className={styles['error']}>{this.state.error}</div>
                        :
                        null
                }
                <input className={styles['submit-button']} type={'submit'} value={'LOG IN'} onClick={this.loginErrorLabel}>
                </input>
                <div className={styles['option']} data-option={'signUp'} onClick={this.changeSelectedOption}>SING UP WITH EMAIL</div>
            </form>
        );
    }

    renderSelectedMenu = () => {
        switch (this.state.selectedOption) {
            case 'signUp':
                return this.renderSignUpForm();
            case 'login':
                return this.renderLoginForm();
            default:
                return null;
        }
    }

    render() {
        return (
            <div className={styles['intro-container']}>
                <div className={styles['overlay']} />
                {this.renderSelectedMenu()}
            </div>
        );
    }
}

export default Intro;
