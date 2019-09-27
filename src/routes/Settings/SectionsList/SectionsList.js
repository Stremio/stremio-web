const React = require('react');
const { Button, Dropdown, Checkbox } = require('stremio/common');
const Icon = require('stremio-icons/dom/Icon');
const ColorInput = require('../ColorInput');
const classnames = require('classnames');
const styles = require('../styles');

const SectionsList = React.forwardRef(({ className, sections, preferences, onPreferenceChanged, onScroll }, ref) => {
    const scrollContainerRef = ref;
    const toggleCheckbox = (id) => {
        onPreferenceChanged(id, !preferences[id]);
    };

    const colorChanged = (id, color) => {
        onPreferenceChanged(id, color);
    };

    const updateDropdown = (event) => {
        var data = event.currentTarget.dataset;
        onPreferenceChanged(data.name, data.value);
    };

    const checkUser = (event) => {
        if(! preferences.user) {
            // Here in Stremio 4 we show a toast with a message, asking the anonymous user to log in/register
            console.log('No user found');
            event.preventDefault();
        }
    }

    // Determines whether the link should be opened in new window or in the current one.
    const getTargetFor = url => ['//', 'http://', 'https://', 'file://', 'ftp://', 'mailto:', 'magnet:']
        .some(scheme => url.startsWith(scheme)) ? '_blank' : '_self'

    // TODO: If we get the user data after initialization, these should be wrapped in React.useState and set by React.useEffect
    const changePasswordUrl = preferences.user && 'https://www.strem.io/reset-password/' + preferences.user.email;
    const webCalUrl = preferences.user && 'webcal://www.strem.io/calendar/' + preferences.user._id + '.ics';

    const sectionsElements = sections.map((section) =>
        <div key={section.id} ref={section.ref} className={styles['section']} data-section={section.id}>
            <div className={styles['section-header']}>{section.id}</div>
            {(section.inputs || [])
                .map((input) => {
                    if (input.type === 'user') {
                        return (
                            <React.Fragment key={'user'}>
                                <div className={classnames(styles['input-container'], styles['user-container'])}>
                                    {
                                        !preferences.user
                                            ?
                                            <div style={{ backgroundImage: `url('/images/anonymous.png')` }} className={styles['avatar']} />
                                            :
                                            <div style={{ backgroundImage: `url('${preferences.user.avatar}'), url('/images/default_avatar.png')` }} className={styles['avatar']} />
                                    }
                                    <div className={styles['email']}>{!preferences.user ? 'Anonymous user' : preferences.user.email}</div>
                                </div>
                                <div className={classnames(styles['input-container'], styles['button-container'])}>
                                    <Button className={styles['button']} type={'button'} href={'#/intro'}>
                                        <div className={styles['label']}>{preferences.user ? 'LOG OUT' : 'SIGN IN'}</div>
                                    </Button>
                                </div>
                                <div className={classnames(styles['input-container'], styles['link-container'])}>
                                    <Button className={styles['link']} type={'link'} href={changePasswordUrl} target={'_blank'} onClick={checkUser}>
                                        <div className={styles['label']}>{'Change password'}</div>
                                    </Button>
                                </div>
                                <div className={classnames(styles['input-container'], styles['text-container'])}>
                                    <div className={styles['text']}>
                                        <div className={styles['label']}>{'Import options'}</div>
                                    </div>
                                </div>
                                <div className={classnames(styles['input-container'], styles['link-container'])}>
                                    <Button className={styles['link']} type={'link'} href={'https://www.stremio.com/#TODO:install-facebook-addon'} target={'_blank'} onClick={checkUser}>
                                        <div className={styles['label']}>{'Import from Facebook'}</div>
                                    </Button>
                                </div>
                                <div className={classnames(styles['input-container'], styles['link-container'])}>
                                    <Button className={styles['link']} type={'link'} href={'https://www.stremio.com/#TODO:export-user-data'} target={'_blank'} onClick={checkUser}>
                                        <div className={styles['label']}>{'Export user data'}</div>
                                    </Button>
                                </div>
                                <div className={classnames(styles['input-container'], styles['link-container'])}>
                                    <Button className={styles['link']} type={'link'} href={webCalUrl} target={'_blank'} onClick={checkUser}>
                                        <div className={styles['label']}>{'Subscribe to calendar'}</div>
                                    </Button>
                                </div>
                                <div className={classnames(styles['input-container'], styles['link-container'])}>
                                    <Button className={styles['link']} type={'link'} href={'https://stremio.zendesk.com/'} target={'_blank'}>
                                        <div className={styles['label']}>{'Contact support'}</div>
                                    </Button>
                                </div>
                                <div className={classnames(styles['input-container'], styles['link-container'])}>
                                    <Button className={styles['link']} type={'link'} href={'https://docs.google.com/forms/d/e/1FAIpQLScubrlTpDMIPUUBlhZ5lwcXl3HxzKfunIMCX5Jnp-cDyglWjQ/viewform?usp=sf_link'} target={'_blank'}>
                                        <div className={styles['label']}>{'Request account deletion'}</div>
                                    </Button>
                                </div>
                                <div className={classnames(styles['input-container'], styles['button-container'])}>
                                    <div className={styles['input-header']}>{'Trakt Scrobbling'}</div>
                                    <Button className={styles['button']} type={'button'}>
                                        <Icon className={styles['icon']} icon={'ic_trackt'} />
                                        <div className={styles['label']}>{preferences.user && preferences.user.trakt ? 'ALREADY UTHENTIATED' : 'AUTHENTIATE'}</div>
                                    </Button>
                                </div>
                            </React.Fragment>
                        );
                    } else if (input.type === 'select') {
                        return (
                            <div key={input.id} className={classnames(styles['input-container'], styles['select-container'])}>
                                {input.header ? <div className={styles['input-header']}>{input.header}</div> : null}
                                <Dropdown options={input.options} selected={[preferences[input.id]]} name={input.id} key={input.id} className={styles['dropdown']} onSelect={updateDropdown} />
                            </div>
                        );
                    } else if (input.type === 'link') {
                        return (
                            <div key={input.id} className={classnames(styles['input-container'], styles['link-container'])}>
                                {input.header ? <div className={styles['input-header']}>{input.header}</div> : null}
                                <Button ref={input.ref} className={styles['link']} type={input.type} href={input.href} target={getTargetFor(input.href)}>
                                    <div className={styles['label']}>{input.label}</div>
                                </Button>
                            </div>
                        );
                    } else if (input.type === 'button') {
                        return (
                            <div key={input.id} className={classnames(styles['input-container'], styles['button-container'])}>
                                {input.header ? <div className={styles['input-header']}>{input.header}</div> : null}
                                <Button ref={input.ref} className={styles['button']} type={input.type} href={input.href}>
                                    {input.icon ? <Icon className={styles['icon']} icon={input.icon} /> : null}
                                    <div className={styles['label']}>{input.label}</div>
                                </Button>
                            </div>
                        );
                    } else if (input.type === 'checkbox') {
                        return (
                            <div key={input.id} className={classnames(styles['input-container'], styles['checkbox-container'])}>
                                {input.header ? <div className={styles['input-header']}>{input.header}</div> : null}
                                <Checkbox ref={input.ref} className={styles['checkbox']} checked={preferences[input.id]} onClick={toggleCheckbox.bind(null, input.id)}>
                                    <div className={styles['label']}>{input.label}</div>
                                </Checkbox>
                            </div>
                        );
                    } else if (input.type === 'static-text') {
                        return (
                            <div key={input.id} className={classnames(styles['input-container'], styles['text-container'])}>
                                {input.header ? <div className={styles['input-header']}>{input.header}</div> : null}
                                <div className={styles['text']}>
                                    {input.icon ? <Icon className={styles[input.icon === 'ic_x' ? 'x-icon' : 'icon']} icon={input.icon} /> : null}
                                    <div className={styles['label']}>{input.label}</div>
                                </div>
                            </div>
                        );
                    } else if (input.type === 'color') {
                        return (
                            <div key={input.id} className={classnames(styles['input-container'], styles['color-container'])}>
                                {input.header ? <div className={styles['input-header']}>{input.header}</div> : null}
                                <ColorInput className={styles['color-picker']} defaultValue={preferences[input.id]} tabIndex={'-1'} onChange={colorChanged.bind(null, input.id)} />
                                {/* <TextInput className={styles['color-picker']} type={input.type} defaultValue={input.color} tabIndex={'-1'} /> */}
                            </div>
                        );
                    }
                })}
        </div>
    );

    return (
        <div ref={scrollContainerRef} className={className} onScroll={onScroll}>
            {sectionsElements}
        </div>
    );
});

module.exports = SectionsList;