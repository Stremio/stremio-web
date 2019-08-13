const React = require('react');
const PropTypes = require('prop-types');
const classnames = require('classnames');
const Icon = require('stremio-icons/dom');
const Button = require('../../Button');
const Popup = require('../../Popup');
const useBinaryState = require('../../useBinaryState');
const useFullscreen = require('../../useFullscreen');
const styles = require('./styles');

const NavMenu = ({ className, email = '', avatar = '', logout }) => {
    const [menuOpen, openMenu, closeMenu] = useBinaryState(false);
    const [fullscreen, requestFullscreen, exitFullscreen] = useFullscreen();
    return (
        <Popup
            open={menuOpen}
            onCloseRequest={closeMenu}
            renderLabel={(props) => (
                <Button {...props} className={classnames(className, styles['nav-menu-button'], { 'active': menuOpen })} tabIndex={-1} onClick={openMenu}>
                    <Icon className={styles['icon']} icon={'ic_more'} />
                    {props.children}
                </Button>
            )}
            renderMenu={() => (
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
                        <Button className={styles['login-logout-button']} href={'#/intro'} onClick={email.length === 0 ? null : logout}>
                            <div className={styles['user-info-label']}>{email.length === 0 ? 'Log in / Sign up' : 'Log out'}</div>
                        </Button>
                    </div>
                    <div className={styles['nav-menu-section']}>
                        <Button className={styles['option']} onClick={fullscreen ? exitFullscreen : requestFullscreen}>
                            <Icon className={styles['option-icon']} icon={'ic_fullscreen'} />
                            <div className={styles['option-label']}>{fullscreen ? 'Exit Fullscreen' : 'Enter Fullscreen'}</div>
                        </Button>
                    </div>
                    <div className={styles['nav-menu-section']}>
                        <Button className={styles['option']} href={'#/settings'}>
                            <Icon className={styles['option-icon']} icon={'ic_settings'} />
                            <div className={styles['option-label']}>Settings</div>
                        </Button>
                        <Button className={styles['option']} href={'#/addons'}>
                            <Icon className={styles['option-icon']} icon={'ic_addons'} />
                            <div className={styles['option-label']}>Addons</div>
                        </Button>
                        <Button className={styles['option']}>
                            <Icon className={styles['option-icon']} icon={'ic_remote'} />
                            <div className={styles['option-label']}>Remote Control</div>
                        </Button>
                        <Button className={styles['option']}>
                            <Icon className={styles['option-icon']} icon={'ic_magnet'} />
                            <div className={styles['option-label']}>Play Magnet Link</div>
                        </Button>
                        <Button className={styles['option']} href={'https://stremio.zendesk.com/'} target={'_blank'}>
                            <Icon className={styles['option-icon']} icon={'ic_help'} />
                            <div className={styles['option-label']}>Help & Feedback</div>
                        </Button>
                    </div>
                    <div className={styles['nav-menu-section']}>
                        <Button className={styles['option']} href={'https://www.stremio.com/tos'} target={'_blank'}>
                            <div className={styles['option-label']}>Terms of Service</div>
                        </Button>
                        <Button className={styles['option']} href={'https://www.stremio.com/'} target={'_blank'}>
                            <div className={styles['option-label']}>About Stremio</div>
                        </Button>
                    </div>
                </div>
            )}
        />
    );
};

NavMenu.propTypes = {
    className: PropTypes.string,
    email: PropTypes.string,
    avatar: PropTypes.string,
    logout: PropTypes.func
};

module.exports = NavMenu;
