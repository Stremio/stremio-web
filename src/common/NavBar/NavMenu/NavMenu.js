const React = require('react');
const PropTypes = require('prop-types');
const classnames = require('classnames');
const Icon = require('stremio-icons/dom');
const Input = require('../../Input');
const Popup = require('../../Popup');
const styles = require('./styles');

const NavMenu = ({ className, email = '', avatar = '', logout }) => {
    const [active, setActive] = React.useState(false);
    const onPopupOpen = React.useCallback(() => {
        setActive(true);
    }, []);
    const onPopupClose = React.useCallback(() => {
        setActive(false);
    }, []);
    const [fullscreen, setFullscreen] = React.useState(document.fullscreenElement instanceof HTMLElement);
    const toggleFullscreen = React.useCallback(() => {
        if (fullscreen) {
            document.exitFullscreen();
        } else {
            document.documentElement.requestFullscreen();
        }
    }, [fullscreen]);
    const onFullscreenChange = React.useCallback(() => {
        setFullscreen(document.fullscreenElement instanceof HTMLElement);
    }, []);
    React.useEffect(() => {
        document.addEventListener('fullscreenchange', onFullscreenChange);
        return () => {
            document.removeEventListener('fullscreenchange', onFullscreenChange);
        };
    }, []);
    return (
        <Popup onOpen={onPopupOpen} onClose={onPopupClose}>
            <Popup.Label>
                <Input className={classnames(className, styles['nav-menu-button'], { 'active': active })} tabIndex={-1} type={'button'}>
                    <Icon className={styles['icon']} icon={'ic_more'} />
                </Input>
            </Popup.Label>
            <Popup.Menu className={styles['nav-menu-container']}>
                <div className={styles['nav-menu']}>
                    <div className={styles['user-info']}>
                        <div
                            className={styles['avatar']}
                            style={{
                                backgroundImage: email.length === 0 ?
                                    `url('/images/anonymous.png')`
                                    :
                                    `url('${avatar}'), url('/images/default_avatar.png')`
                            }}
                        />
                        <div className={styles['email-container']}>
                            <div className={styles['user-info-label']}>{email.length === 0 ? 'Anonymous user' : email}</div>
                        </div>
                        <Input className={styles['login-logout-button']} tabIndex={-1} type={'link'} href={'#/intro'} onClick={email.length === 0 ? null : logout}>
                            <div className={styles['user-info-label']}>{email.length === 0 ? 'Log in / Sign up' : 'Log out'}</div>
                        </Input>
                    </div>
                    <div className={styles['nav-menu-section']}>
                        <Input className={classnames(styles['option'], 'focusable-with-border')} type={'button'} onClick={toggleFullscreen}>
                            <Icon className={styles['option-icon']} icon={'ic_fullscreen'} />
                            <div className={styles['option-label']}>{fullscreen ? 'Exit Fullscreen' : 'Enter Fullscreen'}</div>
                        </Input>
                    </div>
                    <div className={styles['nav-menu-section']}>
                        <Input className={classnames(styles['option'], 'focusable-with-border')} type={'link'} href={'#/settings'}>
                            <Icon className={styles['option-icon']} icon={'ic_settings'} />
                            <div className={styles['option-label']}>Settings</div>
                        </Input>
                        <Input className={classnames(styles['option'], 'focusable-with-border')} type={'link'} href={'#/addons'}>
                            <Icon className={styles['option-icon']} icon={'ic_addons'} />
                            <div className={styles['option-label']}>Addons</div>
                        </Input>
                        <Input className={classnames(styles['option'], 'focusable-with-border')} type={'button'}>
                            <Icon className={styles['option-icon']} icon={'ic_remote'} />
                            <div className={styles['option-label']}>Remote Control</div>
                        </Input>
                        <Input className={classnames(styles['option'], 'focusable-with-border')} type={'button'}>
                            <Icon className={styles['option-icon']} icon={'ic_magnet'} />
                            <div className={styles['option-label']}>Play Magnet Link</div>
                        </Input>
                        <Input className={classnames(styles['option'], 'focusable-with-border')} type={'link'} href={'https://stremio.zendesk.com/'} target={'_blank'}>
                            <Icon className={styles['option-icon']} icon={'ic_help'} />
                            <div className={styles['option-label']}>Help & Feedback</div>
                        </Input>
                    </div>
                    <div className={styles['nav-menu-section']}>
                        <Input className={classnames(styles['option'], 'focusable-with-border')} type={'link'} href={'https://www.stremio.com/tos'} target={'_blank'}>
                            <div className={styles['option-label']}>Terms of Service</div>
                        </Input>
                        <Input className={classnames(styles['option'], 'focusable-with-border')} type={'link'} href={'https://www.stremio.com/'} target={'_blank'}>
                            <div className={styles['option-label']}>About Stremio</div>
                        </Input>
                    </div>
                </div>
            </Popup.Menu>
        </Popup>
    );
};

NavMenu.propTypes = {
    className: PropTypes.string,
    email: PropTypes.string,
    avatar: PropTypes.string,
    logout: PropTypes.func
};

module.exports = NavMenu;
