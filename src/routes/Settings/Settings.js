import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Icon from 'stremio-icons/dom';
import { Input, Popup, Checkbox } from 'stremio-common';
import classnames from 'classnames';
import styles from './styles';

class Settings extends Component {
    constructor(props) {
        super(props);

        this.state = {}
    }

    static getDerivedStateFromProps(nextProps, prevState) {
        const sections = nextProps.settingsConfiguration.reduce((sections, setting) => {
            if (!sections[setting.section]) {
                sections[setting.section] = {
                    ref: React.createRef(),
                    order: Object.keys(sections).length,
                    inputs: []
                };
            }

            sections[setting.section].inputs.push({
                ref: React.createRef(),
                active: prevState.sections && prevState.sections[setting.section].inputs.find(({ label }) => label === setting.label).active,
                ...setting
            });
            return sections;
        }, {});

        const selectedSection = sections[prevState.selectedSection] ?
            prevState.selectedSection
            :
            Object.keys(sections).find((sectionName) => sections[sectionName].order === 0);

        return { selectedSection, sections };
    }

    changeSection = (event) => {
        this.setState({ selectedSection: event.currentTarget.dataset.section });
    }

    shouldComponentUpdate(nextProps, nextState) {
        return nextState.selectedSection !== this.state.selectedSection ||
            nextState.sections !== this.state.sections;
    }

    componentDidUpdate(prevProps, prevState) {
        if (prevState.selectedSection !== this.state.selectedSection) {
            const sectionName = Object.keys(this.state.sections).find((sectionName) => sectionName === this.state.selectedSection);
            this.state.sections[sectionName].ref.current.scrollIntoView();
        }

        Object.values(this.state.sections).forEach(({ inputs }) => {
            inputs.forEach((input) => {
                input.ref.current && !input.active && input.ref.current.close && input.ref.current.close();
            });
        });
    }

    activate = (label) => {
        this.setState(({ sections }) => ({
            sections: Object.keys(sections).reduce((nextSections, sectionName) => {
                nextSections[sectionName] = nextSections[sectionName] || sections[sectionName];
                nextSections[sectionName].inputs = nextSections[sectionName].inputs.map((input) => ({
                    ...input,
                    active: label === input.label
                }));
                return nextSections;
            }, {})
        }));
    }

    deactivate = () => {
        this.setState(({ sections }) => ({
            sections: Object.keys(sections).reduce((nextSections, sectionName) => {
                nextSections[sectionName] = nextSections[sectionName] || sections[sectionName];
                nextSections[sectionName].inputs = nextSections[sectionName].inputs.map((input) => ({
                    ...input,
                    active: false
                }));
                return nextSections;
            }, {})
        }));
    }

    renderPopup({ ref, activate, deactivate, active, label, inputLabel, array, onClick }) {
        return (
            <Popup ref={ref} className={'popup-container'} onOpen={activate.bind(null, inputLabel)} onClose={deactivate}>
                <Popup.Label>
                    <div className={classnames(styles['bar-button'], { 'active': active })}>
                        <div className={styles['label']}>{label}</div>
                        <Icon className={styles['icon']} icon={'ic_arrow_down'} />
                    </div>
                </Popup.Label>
                <Popup.Menu>
                    <div className={styles['popup-content']}>
                        {array.map((element) =>
                            <div className={classnames(styles['label'], { [styles['selected']]: label === element })} key={element} data-element={element} onClick={onClick}>{element}</div>
                        )}
                    </div>
                </Popup.Menu>
            </Popup>
        );
    }

    renderAvatar() {
        if (this.props.email.length === 0) {
            return (
                <div style={{ backgroundImage: `url('/images/anonymous.png')` }} className={styles['avatar']} />
            );
        }

        return (
            <div style={{ backgroundImage: `url('${this.props.avatar}'), url('/images/default_avatar.png') ` }} className={styles['avatar']} />
        );
    }

    render() {
        return (
            <div className={styles['settings-container']}>
                <div className={styles['side-menu']}>
                    {Object.keys(this.state.sections).map((section) =>
                        <div className={classnames(styles['setting'], { [styles['selected']]: this.state.selectedSection === section })} key={section} data-section={section} onClick={this.changeSection}>{section}</div>
                    )}
                </div>
                <div className={styles['scroll-container']}>
                    {Object.keys(this.state.sections).map((section) =>
                        <section ref={this.state.sections[section].ref} className={styles['section']} key={section}>
                            <div className={styles['section-header']}>{section}</div>
                            {
                                section === 'General'
                                    ?
                                    <div className={styles['user-info']}>
                                        {this.renderAvatar()}
                                        <div className={styles['email']}>{this.props.email.length === 0 ? 'Anonymous user' : this.props.email}</div>
                                    </div>
                                    :
                                    null
                            }
                            {this.state.sections[section].inputs.map((input) => {
                                if (input.type === 'select') {
                                    return (
                                        <div className={styles['select-container']} key={input.label}>
                                            {input.header ? <div className={styles['header']}>{input.header}</div> : null}
                                            {this.renderPopup({
                                                ref: input.ref,
                                                activate: this.activate,
                                                deactivate: this.deactivate,
                                                active: input.active,
                                                inputLabel: input.label,
                                                label: input.options[0],
                                                array: input.options,
                                                onClick: input.onChange
                                            })}
                                        </div>
                                    );
                                } else if (input.type === 'link') {
                                    return (
                                        <div className={styles['link-container']} key={input.label}>
                                            {input.header ? <div className={styles['header']}>{input.header}</div> : null}
                                            <Input ref={input.ref} className={styles['link']} type={input.type} href={input.href} target={'_blank'}>{input.label}</Input>
                                        </div>
                                    );
                                } else if (input.type === 'button') {
                                    return (
                                        <div className={styles['button-container']} key={input.label}>
                                            {input.header ? <div className={styles['header']}>{input.header}</div> : null}
                                            <Input ref={input.ref} className={styles['button']} type={input.type}>
                                                {input.icon ? <Icon className={styles['icon']} icon={input.icon} /> : null}
                                                <div className={styles['label']}>{input.label}</div>
                                            </Input>
                                        </div>
                                    );
                                } else if (input.type === 'checkbox') {
                                    return (
                                        <div className={styles['checkbox-container']} key={input.label}>
                                            {input.header ? <div className={styles['header']}>{input.header}</div> : null}
                                            <Checkbox ref={input.ref} className={styles['checkbox']} checked={input.value} onClick={this.onChange}>
                                                <div className={styles['label']}>{input.label}</div>
                                            </Checkbox>
                                        </div>
                                    );
                                } else if (input.type === 'text') {
                                    return (
                                        <div className={styles['text-container']} key={input.label}>
                                            {input.header ? <div className={styles['header']}>{input.header}</div> : null}
                                            <div className={styles['text']}>
                                                {input.icon ? <Icon className={styles['icon']} icon={input.icon} /> : null}
                                                {input.label}
                                            </div>
                                        </div>
                                    );
                                } else if (input.type === 'color') {
                                    return (
                                        <div className={styles['color-container']} key={input.label}>
                                            {input.header ? <div className={styles['header']}>{input.header}</div> : null}
                                            <input className={styles['color-picker']} type={input.type} defaultValue={input.color} tabIndex={'-1'} />
                                        </div>
                                    );
                                }
                            })}
                        </section>
                    )})}
                </div>
            </div>
        );
    }
}

Settings.propTypes = {
    avatar: PropTypes.string.isRequired,
    email: PropTypes.string.isRequired,
    settingsConfiguration: PropTypes.arrayOf(PropTypes.shape({
        section: PropTypes.string.isRequired,
        header: PropTypes.string,
        label: PropTypes.string,
        type: PropTypes.string.isRequired,
        href: PropTypes.string,
        icon: PropTypes.string,
        options: PropTypes.arrayOf(PropTypes.string),
        value: PropTypes.oneOfType([
            PropTypes.bool,
            PropTypes.string
        ]),
        onChange: PropTypes.func
    })).isRequired
}
Settings.defaultProps = {
    avatar: '',
    email: '',
    settingsConfiguration: [
        { section: 'General', label: 'LOG OUT', type: 'button' },
        { section: 'General', label: 'Change password', type: 'link', href: '' },
        { section: 'General', label: 'Import options', type: 'text' },
        { section: 'General', label: 'Import from Facebook', type: 'link', href: '' },
        { section: 'General', label: 'Export user data', type: 'link', href: '' },
        { section: 'General', label: 'Subscribe to calendar', type: 'link', href: '' },
        { section: 'General', label: 'Contact support', type: 'link', href: 'https://stremio.zendesk.com/' },
        { section: 'General', label: 'Request account deletion', type: 'link', href: 'https://docs.google.com/forms/d/e/1FAIpQLScubrlTpDMIPUUBlhZ5lwcXl3HxzKfunIMCX5Jnp-cDyglWjQ/viewform?usp=sf_link' },
        { section: 'General', header: 'Trakt Scrobbling', label: 'AUTHENTICATE', type: 'button', icon: 'ic_trackt' },
        { section: 'General', header: 'UI Language', label: 'UI Language', type: 'select', options: ['Български език', 'English', 'Deutsch', 'Español', 'Italiano'], value: 'English', onChange: (function() { alert('32423') }) },
        { section: 'Player', label: 'ADD-ONS', type: 'button', icon: 'ic_addons' },
        { section: 'Player', header: 'Default Subtitles Language', label: 'Default Subtitles Language', type: 'select', options: ['English', 'Nederlands', 'Avesta', 'Български език', 'Deutsch', 'Español', 'Italiano'], value: 'English' },
        { section: 'Player', header: 'Default Subtitles Size', label: 'Default Subtitles Size', type: 'select', options: ['72%', '80%', '100%', '120%', '140%', '160%', '180%'], value: '100%' },
        { section: 'Player', header: 'Subtitles Background', label: 'Subtitles background', type: 'select', options: ['None', 'Solid', 'Transparent'], value: 'None' },
        { section: 'Player', header: 'Subtitles color', label: 'Subtitles color', type: 'color', color: '#FFFFFF' },
        { section: 'Player', header: 'Subtitles outline color', label: 'Subtitles outline color', type: 'color', color: '#000000' },
        { section: 'Player', label: 'Auto-play next episode', type: 'checkbox', value: true },
        { section: 'Player', label: 'Pause playback when minimized', type: 'checkbox', value: false },
        { section: 'Player', label: 'Hardware-accelerated decoding', type: 'checkbox', value: true },
        { section: 'Player', label: 'Launch player in a separate window (advanced)', type: 'checkbox', value: true },
        { section: 'Streaming', header: 'Caching', label: 'Caching', type: 'select', options: ['No Caching', '2GB', '5GB', '10GB'] },
        { section: 'Streaming', header: 'Torrent Profile', label: 'Torrent Profile', type: 'select', options: ['Default', 'Soft', 'Fast'] },
        { section: 'Streaming', header: 'Streaming server URL: http://127.0.0.1:11470', label: 'Streaming server is available.', type: 'text', icon: 'ic_check' }
    ]
}

export default Settings;
