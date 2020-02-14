const React = require('react');
const classnames = require('classnames');
const throttle = require('lodash.throttle');
const Icon = require('stremio-icons/dom');
const { useServices } = require('stremio/services');
const { Button, Checkbox, NavBar, Multiselect, ColorInput, useProfile, useStreamingServer } = require('stremio/common');
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
        playInExternalPlayerCheckbox,
        hardwareDecodingCheckbox
    } = useProfileSettingsInputs();
    const {
        cacheSizeSelect,
        torrentProfileSelect
    } = useStreamingServerSettingsInputs();
    const logoutButtonOnClick = React.useCallback(() => {
        core.dispatch({
            action: 'Ctx',
            args: {
                action: 'Logout'
            }
        });
    }, []);
    const authenticateTraktOnClick = React.useCallback(() => {
        // TODO
    }, []);
    const importFacebookOnClick = React.useCallback(() => {
        // TODO
    }, []);
    const subscribeCalendarOnClick = React.useCallback(() => {
        // TODO
    }, []);
    const exportDataOnClick = React.useCallback(() => {
        // TODO
    }, []);
    const reloadStreamingServer = React.useCallback(() => {
        core.dispatch({
            action: 'Ctx',
            args: {
                action: 'ReloadStreamingServer'
            }
        });
    }, []);
    const sectionsContainerRef = React.useRef(null);
    const generalSectionRef = React.useRef(null);
    const playerSectionRef = React.useRef(null);
    const streamingServerSectionRef = React.useRef(null);
    const sections = React.useMemo(() => ([
        { ref: generalSectionRef, id: GENERAL_SECTION },
        { ref: playerSectionRef, id: PLAYER_SECTION },
        { ref: streamingServerSectionRef, id: STREAMING_SECTION },
    ]), []);
    const [selectedSectionId, setSelectedSectionId] = React.useState(sections[0].id);
    const updateSelectedSectionId = React.useCallback(() => {
        if (sectionsContainerRef.current.scrollTop + sectionsContainerRef.current.clientHeight === sectionsContainerRef.current.scrollHeight) {
            setSelectedSectionId(sections[sections.length - 1].id);
        } else {
            for (let i = sections.length - 1; i >= 0; i--) {
                if (sections[i].ref.current.offsetTop - sectionsContainerRef.current.offsetTop <= sectionsContainerRef.current.scrollTop) {
                    setSelectedSectionId(sections[i].id);
                    break;
                }
            }
        }
    }, []);
    const sideMenuButtonOnClick = React.useCallback((event) => {
        const section = sections.find((section) => {
            return section.id === event.currentTarget.dataset.section;
        });
        sectionsContainerRef.current.scrollTo({
            top: section.ref.current.offsetTop - sectionsContainerRef.current.offsetTop,
            behavior: 'smooth'
        });
    }, []);
    const sectionsContainerOnScorll = React.useCallback(throttle(() => {
        updateSelectedSectionId();
    }, 50), []);
    React.useEffect(() => {
        updateSelectedSectionId();
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
                    <Button className={classnames(styles['side-menu-button'], { [styles['selected']]: selectedSectionId === GENERAL_SECTION })} data-section={GENERAL_SECTION} onClick={sideMenuButtonOnClick}>
                        General
                    </Button>
                    <Button className={classnames(styles['side-menu-button'], { [styles['selected']]: selectedSectionId === PLAYER_SECTION })} data-section={PLAYER_SECTION} onClick={sideMenuButtonOnClick}>
                        Player
                    </Button>
                    <Button className={classnames(styles['side-menu-button'], { [styles['selected']]: selectedSectionId === STREAMING_SECTION })} data-section={STREAMING_SECTION} onClick={sideMenuButtonOnClick}>
                        Streaming server
                    </Button>
                    <div className={styles['spacing']} />
                    <div className={styles['version-info-label']}>App Version: {process.env.VERSION}</div>
                    {
                        streaminServer.type === 'Ready' ?
                            <div className={styles['version-info-label']}>Server Version: {streaminServer.settings.serverVersion}</div>
                            :
                            null
                    }
                </div>
                <div ref={sectionsContainerRef} className={styles['sections-container']} onScroll={sectionsContainerOnScorll}>
                    <div ref={generalSectionRef} className={styles['section-container']}>
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
                            <div className={styles['email-logout-container']}>
                                <div className={styles['email-label-container']} title={profile.auth === null ? 'Anonymous user' : profile.auth.user.email}>
                                    <div className={styles['email-label']}>
                                        {profile.auth === null ? 'Anonymous user' : profile.auth.user.email}
                                    </div>
                                </div>
                                {
                                    profile.auth !== null ?
                                        <Button className={styles['logout-button-container']} title={'Log out'} href={'#/intro'} onClick={logoutButtonOnClick}>
                                            <div className={styles['logout-label']}>Log out</div>
                                        </Button>
                                        :
                                        null
                                }
                            </div>
                        </div>
                        {
                            profile.auth === null ?
                                <div className={styles['option-container']}>
                                    <Button className={classnames(styles['option-input-container'], styles['button-container'])} title={'Log in / Sign up'} href={'#/intro'} onClick={logoutButtonOnClick}>
                                        <div className={styles['label']}>Log in / Sign up</div>
                                    </Button>
                                </div>
                                :
                                <div className={styles['option-container']}>
                                    <Button className={classnames(styles['option-input-container'], styles['button-container'])} title={'User panel'} target={'_blank'} href={'https://www.stremio.com/acc-settings'}>
                                        <Icon className={styles['icon']} icon={'ic_user'} />
                                        <div className={styles['label']}>User panel</div>
                                    </Button>
                                </div>
                        }
                        <div className={styles['option-container']}>
                            <Button className={classnames(styles['option-input-container'], styles['button-container'])} title={'Addons'} href={'#/addons'}>
                                <Icon className={styles['icon']} icon={'ic_addons'} />
                                <div className={styles['label']}>Addons</div>
                            </Button>
                        </div>
                        <div className={styles['option-container']}>
                            <div className={styles['option-name-container']}>
                                <div className={styles['label']}>Trakt Scrobbling</div>
                            </div>
                            <Button className={classnames(styles['option-input-container'], styles['button-container'])} title={'Authenticate'} onClick={authenticateTraktOnClick}>
                                <Icon className={styles['icon']} icon={'ic_trackt'} />
                                <div className={styles['label']}>Authenticate</div>
                            </Button>
                        </div>
                        <div className={styles['option-container']}>
                            <div className={styles['option-name-container']}>
                                <div className={styles['label']}>Facebook</div>
                            </div>
                            <Button className={classnames(styles['option-input-container'], styles['button-container'])} title={'Import'} onClick={importFacebookOnClick}>
                                <Icon className={styles['icon']} icon={'ic_facebook'} />
                                <div className={styles['label']}>Import</div>
                            </Button>
                        </div>
                        <div className={styles['option-container']}>
                            <div className={styles['option-name-container']}>
                                <div className={styles['label']}>Calendar</div>
                            </div>
                            <Button className={classnames(styles['option-input-container'], styles['button-container'])} title={'Subscribe'} onClick={subscribeCalendarOnClick}>
                                <Icon className={styles['icon']} icon={'ic_calendar'} />
                                <div className={styles['label']}>Subscribe</div>
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
                            <Button className={classnames(styles['option-input-container'], styles['link-container'])} title={'Export user data'} onClick={exportDataOnClick}>
                                <div className={styles['label']}>Export user data</div>
                            </Button>
                        </div>
                        <div className={styles['option-container']}>
                            <Button className={classnames(styles['option-input-container'], styles['link-container'])} title={'Contact support'} target={'_blank'} href={'https://stremio.zendesk.com/hc/en-us'}>
                                <div className={styles['label']}>Contact support</div>
                            </Button>
                        </div>
                        <div className={styles['option-container']}>
                            <Button className={classnames(styles['option-input-container'], styles['link-container'])} title={'Source code'} target={'_blank'} href={`https://github.com/stremio/stremio-web/commit/${process.env.COMMIT_HASH}`}>
                                <div className={styles['label']}>Source code</div>
                            </Button>
                        </div>
                        <div className={styles['option-container']}>
                            <Button className={classnames(styles['option-input-container'], styles['link-container'])} title={'Terms of Service'} target={'_blank'} href={'https://www.stremio.com/tos'}>
                                <div className={styles['label']}>Terms of Service</div>
                            </Button>
                        </div>
                        <div className={styles['option-container']}>
                            <Button className={classnames(styles['option-input-container'], styles['link-container'])} title={'Privacy Policy'} target={'_blank'} href={'https://www.stremio.com/privacy'}>
                                <div className={styles['label']}>Privacy Policy</div>
                            </Button>
                        </div>
                    </div>
                    <div ref={playerSectionRef} className={styles['section-container']}>
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
                                <div className={styles['label']}>Play in external player</div>
                            </div>
                            <Checkbox
                                className={classnames(styles['option-input-container'], styles['checkbox-container'])}
                                {...playInExternalPlayerCheckbox}
                            />
                        </div>
                        <div className={styles['option-container']}>
                            <div className={styles['option-name-container']}>
                                <div className={styles['label']}>Hardware-accelerated decoding</div>
                            </div>
                            <Checkbox
                                className={classnames(styles['option-input-container'], styles['checkbox-container'])}
                                {...hardwareDecodingCheckbox}
                            />
                        </div>
                    </div>
                    <div ref={streamingServerSectionRef} className={styles['section-container']}>
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
