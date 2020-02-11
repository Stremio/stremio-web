const React = require('react');
const classnames = require('classnames');
const Icon = require('stremio-icons/dom');
const { useServices } = require('stremio/services');
const { Button, Checkbox, NavBar, Multiselect, TextInput, ColorInput, useProfile, useStreamingServer } = require('stremio/common');
const useProfileSettingsInputs = require('./useProfileSettingsInputs');
const useStreamingServerSettingsInputs = require('./useStreamingServerSettingsInputs');
const styles = require('./styles');

const GENERAL_SECTION = 'general';
const PLAYER_SECTION = 'player';
const STREAMING_SECTION = 'streaming';

const Settings = () => {
    const { core } = useServices();
    const profile = useProfile();
    const streaminServer = useStreamingServer();
    const {
        interfaceLanguageSelect,
        subtitlesLanguageSelect,
        subtitlesSizeSelect,
        subtitlesTextColorInput,
        subtitlesBackgroundColorInput,
        subtitlesOutlineColorInput,
        bingeWatchingCheckbox,
        playInBackgroundCheckbox,
        playInExternalPlayerCheckbox
    } = useProfileSettingsInputs();
    const {
        cacheSizeSelect,
        torrentProfileSelect
    } = useStreamingServerSettingsInputs();
    const [section, setSection] = React.useState(GENERAL_SECTION);
    const sectionsContainerRef = React.useRef(null);
    const sectionsContainerOnScorll = React.useCallback((event) => {
    }, []);
    const sideMenuButtonOnClick = React.useCallback((event) => {
    }, []);
    const logoutButtonOnClick = React.useCallback(() => {
        core.dispatch({
            action: 'Ctx',
            args: {
                action: 'Logout'
            }
        });
    }, []);
    const reloadStreamingServer = React.useCallback(() => {
        core.dispatch({
            action: 'Ctx',
            args: {
                action: 'ReloadStreamingServer'
            }
        });
    }, []);
    return (
        <div className={styles['settings-container']}>
            <NavBar
                className={styles['nav-bar']}
                backButton={true}
                addonsButton={true}
                fullscreenButton={true}
                notificationsMenu={true}
                navMenu={true}
            />
            <div className={styles['settings-content']}>
                <div className={styles['side-menu-container']}>
                    <Button className={classnames(styles['side-menu-button'], { [styles['selected']]: section === GENERAL_SECTION })} data-section={GENERAL_SECTION} onClick={sideMenuButtonOnClick}>
                        General
                    </Button>
                    <Button className={classnames(styles['side-menu-button'], { [styles['selected']]: section === PLAYER_SECTION })} data-section={PLAYER_SECTION} onClick={sideMenuButtonOnClick}>
                        Player
                    </Button>
                    <Button className={classnames(styles['side-menu-button'], { [styles['selected']]: section === STREAMING_SECTION })} data-section={STREAMING_SECTION} onClick={sideMenuButtonOnClick}>
                        Streaming server
                    </Button>
                </div>
                <div ref={sectionsContainerRef} className={styles['sections-container']} onScroll={sectionsContainerOnScorll}>
                    <div className={styles['section-container']}>
                        <div className={styles['section-title']}>General</div>
                        <div className={classnames(styles['option-container'], styles['user-info-option-container'])}>
                            <div
                                className={styles['avatar-container']}
                                style={{
                                    backgroundImage: profile.auth === null ?
                                        'url(\'/images/anonymous.png\')'
                                        :
                                        `url('${profile.auth.user.avatar}'), url('/images/default_avatar.png')`
                                }}
                            />
                            <div className={styles['email-label']} title={profile.auth === null ? 'Anonymous user' : profile.auth.user.email}>
                                {profile.auth === null ? 'Anonymous user' : profile.auth.user.email}
                            </div>
                        </div>
                        {
                            profile.auth === null ?
                                <div className={styles['option-container']}>
                                    <Button className={classnames(styles['option-input-container'], styles['button-container'])} title={'Log in / Sign up'} href={'#/intro'} onClick={logoutButtonOnClick}>
                                        <div className={styles['label']}>{'Log in / Sign up'}</div>
                                    </Button>
                                </div>
                                :
                                <div className={styles['option-container']}>
                                    <Button className={classnames(styles['option-input-container'], styles['button-container'])} title={'User panel'} target={'_blank'} href={'https://www.stremio.com/acc-settings'}>
                                        <Icon className={styles['icon']} icon={'ic_user'} />
                                        <div className={styles['label']}>{'User panel'}</div>
                                    </Button>
                                </div>
                        }
                        <div className={styles['option-container']}>
                            <Button className={classnames(styles['option-input-container'], styles['button-container'])} title={'Addons'}>
                                <Icon className={styles['icon']} icon={'ic_addons'} />
                                <div className={styles['label']}>Addons</div>
                            </Button>
                        </div>
                        <div className={styles['option-container']}>
                            <div className={styles['option-name-container']}>
                                <div className={styles['label']}>Interface language</div>
                            </div>
                            <Multiselect
                                className={classnames(styles['option-input-container'], styles['multiselect-container'])}
                                {...interfaceLanguageSelect}
                            />
                        </div>
                        <div className={styles['option-container']}>
                            <div className={styles['option-name-container']}>
                                <div className={styles['label']}>Trakt Scrobbling</div>
                            </div>
                            <Button className={classnames(styles['option-input-container'], styles['button-container'])} title={'Authenticate'}>
                                <Icon className={styles['icon']} icon={'ic_trackt'} />
                                <div className={styles['label']}>Authenticate</div>
                            </Button>
                        </div>
                        <div className={styles['option-container']}>
                            <div className={styles['option-name-container']}>
                                <div className={styles['label']}>Facebook import</div>
                            </div>
                            <Button className={classnames(styles['option-input-container'], styles['button-container'])} title={'Authenticate'}>
                                <Icon className={styles['icon']} icon={'ic_facebook'} />
                                <div className={styles['label']}>Authenticate</div>
                            </Button>
                        </div>
                        <div className={styles['option-container']}>
                            <div className={styles['option-name-container']}>
                                <div className={styles['label']}>Calendar</div>
                            </div>
                            <Button className={classnames(styles['option-input-container'], styles['button-container'])} title={'Subscribe'}>
                                <Icon className={styles['icon']} icon={'ic_calendar'} />
                                <div className={styles['label']}>Subscribe</div>
                            </Button>
                        </div>
                        <div className={styles['option-container']}>
                            <Button className={classnames(styles['option-input-container'], styles['link-container'])} title={'Export user data'}>
                                <div className={styles['label']}>Export user data</div>
                            </Button>
                        </div>
                        <div className={styles['option-container']}>
                            <Button className={classnames(styles['option-input-container'], styles['link-container'])} title={'Contact support'}>
                                <div className={styles['label']}>Contact support</div>
                            </Button>
                        </div>
                        <div className={styles['option-container']}>
                            <Button className={classnames(styles['option-input-container'], styles['link-container'])} title={'Terms of Service'}>
                                <div className={styles['label']}>Terms of Service</div>
                            </Button>
                        </div>
                        <div className={styles['option-container']}>
                            <Button className={classnames(styles['option-input-container'], styles['link-container'])} title={'Privacy Policy'}>
                                <div className={styles['label']}>Privacy Policy</div>
                            </Button>
                        </div>
                        {
                            profile.auth !== null ?
                                <div className={styles['option-container']}>
                                    <Button className={classnames(styles['option-input-container'], styles['link-container'])} title={'Log out'} href={'#/intro'} onClick={logoutButtonOnClick}>
                                        <div className={styles['label']}>Log out</div>
                                    </Button>
                                </div>
                                :
                                null
                        }
                    </div>
                    <div className={styles['section-container']}>
                        <div className={styles['section-title']}>Player</div>
                        <div className={styles['option-container']}>
                            <div className={styles['option-name-container']}>
                                <div className={styles['label']}>Subtitles language</div>
                            </div>
                            <Multiselect
                                className={classnames(styles['option-input-container'], styles['multiselect-container'])}
                                {...subtitlesLanguageSelect}
                            />
                        </div>
                        <div className={styles['option-container']}>
                            <div className={styles['option-name-container']}>
                                <div className={styles['label']}>Subtitles size</div>
                            </div>
                            <Multiselect
                                className={classnames(styles['option-input-container'], styles['multiselect-container'])}
                                {...subtitlesSizeSelect}
                            />
                        </div>
                        <div className={styles['option-container']}>
                            <div className={styles['option-name-container']}>
                                <div className={styles['label']}>Subtitles text color</div>
                            </div>
                            <ColorInput
                                className={classnames(styles['option-input-container'], styles['color-input-container'])}
                                {...subtitlesTextColorInput}
                            />
                        </div>
                        <div className={styles['option-container']}>
                            <div className={styles['option-name-container']}>
                                <div className={styles['label']}>Subtitles background color</div>
                            </div>
                            <ColorInput
                                className={classnames(styles['option-input-container'], styles['color-input-container'])}
                                {...subtitlesBackgroundColorInput}
                            />
                        </div>
                        <div className={styles['option-container']}>
                            <div className={styles['option-name-container']}>
                                <div className={styles['label']}>Subtitles outline color</div>
                            </div>
                            <ColorInput
                                className={classnames(styles['option-input-container'], styles['color-input-container'])}
                                {...subtitlesOutlineColorInput}
                            />
                        </div>
                        <div className={styles['option-container']}>
                            <div className={styles['option-name-container']}>
                                <div className={styles['label']}>Auto-play next episode</div>
                            </div>
                            <Checkbox
                                className={classnames(styles['option-input-container'], styles['checkbox-container'])}
                                {...bingeWatchingCheckbox}
                            />
                        </div>
                        <div className={styles['option-container']}>
                            <div className={styles['option-name-container']}>
                                <div className={styles['label']}>Play in background</div>
                            </div>
                            <Checkbox
                                className={classnames(styles['option-input-container'], styles['checkbox-container'])}
                                {...playInBackgroundCheckbox}
                            />
                        </div>
                        <div className={styles['option-container']}>
                            <div className={styles['option-name-container']}>
                                <div className={styles['label']}>Hardware-accelerated decoding</div>
                            </div>
                            <Checkbox
                                className={classnames(styles['option-input-container'], styles['checkbox-container'])}
                                checked={false}
                            />
                        </div>
                    </div>
                    <div className={styles['section-container']}>
                        <div className={styles['section-title']}>Streaming Server</div>
                        <div className={styles['option-container']}>
                            <Button className={classnames(styles['option-input-container'], styles['button-container'])} title={'Reload'} onClick={reloadStreamingServer}>
                                <div className={styles['label']}>Reload</div>
                            </Button>
                        </div>
                        <div className={styles['option-container']}>
                            <div className={styles['option-name-container']}>
                                <div className={styles['label']}>Status</div>
                            </div>
                            <div className={classnames(styles['option-input-container'], styles['info-container'])}>
                                <div className={styles['label']}>
                                    {
                                        streaminServer.type === 'Ready' ?
                                            'Online'
                                            :
                                            streaminServer.type === 'Error' ?
                                                `Error: (${streaminServer.error})`
                                                :
                                                streaminServer.type
                                    }
                                </div>
                            </div>
                        </div>
                        {
                            streaminServer.type === 'Ready' ?
                                <div className={styles['option-container']}>
                                    <div className={styles['option-name-container']}>
                                        <div className={styles['label']}>Base Url</div>
                                    </div>
                                    <div className={classnames(styles['option-input-container'], styles['info-container'], styles['selectable'])}>
                                        <div className={styles['label']}>
                                            {streaminServer.base_url}
                                        </div>
                                    </div>
                                </div>
                                :
                                null
                        }
                        {
                            cacheSizeSelect !== null ?
                                <div className={styles['option-container']}>
                                    <div className={styles['option-name-container']}>
                                        <div className={styles['label']}>Cache size</div>
                                    </div>
                                    <Multiselect
                                        className={classnames(styles['option-input-container'], styles['multiselect-container'])}
                                        {...cacheSizeSelect}
                                    />
                                </div>
                                :
                                null
                        }
                        {
                            torrentProfileSelect !== null ?
                                <div className={styles['option-container']}>
                                    <div className={styles['option-name-container']}>
                                        <div className={styles['label']}>Torrent profile</div>
                                    </div>
                                    <Multiselect
                                        className={classnames(styles['option-input-container'], styles['multiselect-container'])}
                                        {...torrentProfileSelect}
                                    />
                                </div>
                                :
                                null
                        }
                    </div>
                </div>
            </div>
        </div>
    );
};

module.exports = Settings;
