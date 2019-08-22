const React = require('react');
const PropTypes = require('prop-types');
const classnames = require('classnames');
const Icon = require('stremio-icons/dom');
const Button = require('../../Button');
const Popup = require('../../Popup');
const useBinaryState = require('../../useBinaryState');
const useFullscreen = require('../../useFullscreen');
const useUser = require('../../useUser');
const styles = require('./styles');

const NavMenu = ({ className }) => {
    const [menuOpen, openMenu, closeMenu, toggleMenu] = useBinaryState(false);
    const user = useUser();
    const [fullscreen, requestFullscreen, exitFullscreen] = useFullscreen();
    return (
        <Popup
            open={menuOpen}
            onCloseRequest={closeMenu}
            renderLabel={(ref) => (
                <Button ref={ref} className={classnames(className, styles['nav-menu-label-container'], { 'active': menuOpen })} tabIndex={-1} onClick={toggleMenu}>
                    <Icon className={styles['icon']} icon={'ic_more'} />
                </Button>
            )}
            renderMenu={() => (
                <div className={styles['nav-menu-container']}>
                    <div className={styles['user-info-container']}>
                        <div
                            className={styles['avatar-container']}
                            style={{
                                backgroundImage: user.anonymous ?
                                    `url('/images/anonymous.png')`
                                    :
                                    `url('${user.avatar}'), url('/images/default_avatar.png')`
                            }}
                        />
                        <div className={styles['email-container']}>
                            <div className={styles['label']}>{user.anonymous ? 'Anonymous user' : user.email}</div>
                        </div>
                        <Button className={styles['logout-button-container']} title={user.anonymous ? 'Log in / Sign up' : 'Log out'} href={'#/intro'} onClick={user.logout}>
                            <div className={styles['label']}>{user.anonymous ? 'Log in / Sign up' : 'Log out'}</div>
                        </Button>
                    </div>
                    <div className={styles['nav-menu-section']}>
                        <Button className={styles['nav-menu-option-container']} title={fullscreen ? 'Exit Fullscreen' : 'Enter Fullscreen'} onClick={fullscreen ? exitFullscreen : requestFullscreen}>
                            <Icon className={styles['icon']} icon={fullscreen ? 'ic_exit_fullscreen' : 'ic_fullscreen'} />
                            <div className={styles['label']}>{fullscreen ? 'Exit Fullscreen' : 'Enter Fullscreen'}</div>
                        </Button>
                    </div>
                    <div className={styles['nav-menu-section']}>
                        <Button className={styles['nav-menu-option-container']} title={'Settings'} href={'#/settings'}>
                            <Icon className={styles['icon']} icon={'ic_settings'} />
                            <div className={styles['label']}>Settings</div>
                        </Button>
                        <Button className={styles['nav-menu-option-container']} title={'Addons'} href={'#/addons'}>
                            <Icon className={styles['icon']} icon={'ic_addons'} />
                            <div className={styles['label']}>Addons</div>
                        </Button>
                        <Button className={styles['nav-menu-option-container']} title={'Remote Control'}>
                            <Icon className={styles['icon']} icon={'ic_remote'} />
                            <div className={styles['label']}>Remote Control</div>
                        </Button>
                        <Button className={styles['nav-menu-option-container']} title={'Play Magnet Link'}>
                            <Icon className={styles['icon']} icon={'ic_magnet'} />
                            <div className={styles['label']}>Play Magnet Link</div>
                        </Button>
                        <Button className={styles['nav-menu-option-container']} title={'Help & Feedback'} href={'https://stremio.zendesk.com/'} target={'_blank'}>
                            <Icon className={styles['icon']} icon={'ic_help'} />
                            <div className={styles['label']}>Help & Feedback</div>
                        </Button>
                    </div>
                    <div className={styles['nav-menu-section']}>
                        <Button className={styles['nav-menu-option-container']} title={'Terms of Service'} href={'https://www.stremio.com/tos'} target={'_blank'}>
                            <div className={styles['label']}>Terms of Service</div>
                        </Button>
                        <Button className={styles['nav-menu-option-container']} title={'Privacy Policy'} href={'https://www.stremio.com/privacy'} target={'_blank'}>
                            <div className={styles['label']}>Privacy Policy</div>
                        </Button>
                        <Button className={styles['nav-menu-option-container']} title={'About Stremio'} href={'https://www.stremio.com/'} target={'_blank'}>
                            <div className={styles['label']}>About Stremio</div>
                        </Button>
                    </div>
                </div>
            )}
        />
    );
};

NavMenu.propTypes = {
    className: PropTypes.string
};

module.exports = NavMenu;
