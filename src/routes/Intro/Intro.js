import React, { Component } from 'react';
import Icon from 'stremio-icons/dom';
import { Checkbox } from 'stremio-common';
import styles from './styles';

class Intro extends Component {
    constructor(props) {
        super(props);

        this.state = {
            selectedOption: 'signUp',
            termsAccepted: false,
            privacyPolicyAccepted: false,
            communicationsAccepted: false
        };
    }

    changeSelectedOption = (event) => {
        this.setState({ selectedOption: event.currentTarget.dataset.option });
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
            nextState.communicationsAccepted !== this.state.communicationsAccepted;
    }

    renderAcceptanceOption({ label, href, checked, onClick }) {
        return (
            <label className={styles['toggle-option']}>
                <Checkbox className={styles['checkbox-size']} checked={checked} disabled={false} onClick={onClick} />
                <div className={styles['accept']}>I accept the
                        <span>&nbsp;</span>
                    <a href={href} target={'_blank'} className={styles['acceptance-label']}>{label}</a>
                </div>
            </label>
        );
    }

    renderErrorLabel = () => {
        return (
            <div className={styles['error-label']}></div>
        );
    }

    renderSignUpForm = () => {
        return (
            <div className={styles['login-form']}>
                <div className={styles['fb-button']}>
                    <Icon className={styles['icon']} icon={'ic_facebook'} />
                    <div className={styles['label']}>Login with Facebook</div>
                </div>
                <div className={styles['text']}>We won't post anything on your behalf</div>
                <div className={styles['or']}>OR</div>
                <input className={styles['email']} type={'text'} placeholder={'Email'} />
                <input className={styles['password']} type={'text'} placeholder={'Password'} />
                <input className={styles['password']} type={'text'} placeholder={'Confirm Password'} />
                <div className={styles['acceptance-section']}>
                    {this.renderAcceptanceOption({ label: 'Terms and conditions', href: 'https://www.stremio.com/tos', checked: this.state.termsAccepted, onClick: this.toggleTerms })}
                    {this.renderAcceptanceOption({ label: 'Privacy Policy', href: 'https://www.stremio.com/privacy', checked: this.state.privacyPolicyAccepted, onClick: this.togglePrivacyPolicy })}
                    {this.renderAcceptanceOption({ label: 'to receive marketing communications from Stremio', href: 'https://www.stremio.com/privacy', checked: this.state.communicationsAccepted, onClick: this.toggleCommunications })}
                </div>
                <div className={styles['login-button']}>
                    <div className={styles['label']}>SIGN UP</div>
                </div>
                <div className={styles['option']} data-option={'login'} onClick={this.changeSelectedOption}>LOG IN</div>
                <div className={styles['option']}>GUEST LOGIN</div>
                {/* <a href={this.state.termsAccepted ? '#/' : null} className={styles['option']}>GUEST LOGIN</a> */}
            </div>
        );
    }

    renderLoginForm = () => {
        return (
            <div className={styles['login-form']}>
                <div className={styles['fb-button']}>
                    <Icon className={styles['icon']} icon={'ic_facebook'} />
                    <div className={styles['label']}>Login with Facebook</div>
                </div>
                <div className={styles['text']}>We won't post anything on your behalf</div>
                <div className={styles['or']}>OR</div>
                <input className={styles['email']} type={'text'} placeholder={'Email'} />
                <input className={styles['password']} type={'text'} placeholder={'Password'} />
                <div className={styles['login-button']}>
                    <div className={styles['label']}>LOG IN</div>
                </div>
                <div className={styles['option']} data-option={'signUp'} onClick={this.changeSelectedOption}>SING UP WITH EMAIL</div>
            </div>
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
