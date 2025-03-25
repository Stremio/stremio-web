// Copyright (C) 2017-2023 Smart code 203358507

const React = require('react');
const classnames = require('classnames');
const throttle = require('lodash.throttle');
const { useTranslation } = require('react-i18next');
const { default: Icon } = require('@stremio/stremio-icons/react');
const { useRouteFocused } = require('stremio-router');
const { useServices } = require('stremio/services');
const { useProfile, usePlatform, useStreamingServer, withCoreSuspender, useToast } = require('stremio/common');
const { Button, ColorInput, MainNavBars, Multiselect, Toggle } = require('stremio/components');
const useProfileSettingsInputs = require('./useProfileSettingsInputs');
const useStreamingServerSettingsInputs = require('./useStreamingServerSettingsInputs');
const useDataExport = require('./useDataExport');
const styles = require('./styles');
const { default: URLsManager } = require('./URLsManager/URLsManager');

const GENERAL_SECTION = 'general';
const PLAYER_SECTION = 'player';
const STREAMING_SECTION = 'streaming';
const SHORTCUTS_SECTION = 'shortcuts';

const Settings = () => {
    const { t } = useTranslation();
    const { core, shell } = useServices();
    const { routeFocused } = useRouteFocused();
    const profile = useProfile();
    const [dataExport, loadDataExport] = useDataExport();
    const streamingServer = useStreamingServer();
    const platform = usePlatform();
    const toast = useToast();
    const {
        interfaceLanguageSelect,
        hideSpoilersToggle,
        subtitlesLanguageSelect,
        subtitlesSizeSelect,
        subtitlesTextColorInput,
        subtitlesBackgroundColorInput,
        subtitlesOutlineColorInput,
        audioLanguageSelect,
        surroundSoundToggle,
        seekTimeDurationSelect,
        seekShortTimeDurationSelect,
        escExitFullscreenToggle,
        quitOnCloseToggle,
        playInExternalPlayerSelect,
        nextVideoPopupDurationSelect,
        bingeWatchingToggle,
        playInBackgroundToggle,
        hardwareDecodingToggle,
    } = useProfileSettingsInputs(profile);
    const {
        streamingServerRemoteUrlInput,
        remoteEndpointSelect,
        cacheSizeSelect,
        torrentProfileSelect,
        transcodingProfileSelect,
    } = useStreamingServerSettingsInputs(streamingServer);
    const [traktAuthStarted, setTraktAuthStarted] = React.useState(false);
    const isTraktAuthenticated = React.useMemo(() => {
        return profile.auth !== null && profile.auth.user !== null && profile.auth.user.trakt !== null &&
            (Date.now() / 1000) < (profile.auth.user.trakt.created_at + profile.auth.user.trakt.expires_in);
    }, [profile.auth]);
    const logoutButtonOnClick = React.useCallback(() => {
        core.transport.dispatch({
            action: 'Ctx',
            args: {
                action: 'Logout'
            }
        });
    }, []);
    const toggleTraktOnClick = React.useCallback(() => {
        if (!isTraktAuthenticated && profile.auth !== null && profile.auth.user !== null && typeof profile.auth.user._id === 'string') {
            platform.openExternal(`https://www.strem.io/trakt/auth/${profile.auth.user._id}`);
            setTraktAuthStarted(true);
        } else {
            core.transport.dispatch({
                action: 'Ctx',
                args: {
                    action: 'LogoutTrakt'
                }
            });
        }
    }, [isTraktAuthenticated, profile.auth]);
    const subscribeCalendarOnClick = React.useCallback(() => {
        if (!profile.auth) return;

        const protocol = platform.name === 'ios' ? 'webcal' : 'https';
        const url = `${protocol}://www.strem.io/calendar/${profile.auth.user._id}.ics`;
        platform.openExternal(url);
        toast.show({
            type: 'success',
            title: platform.name === 'ios' ? t('SETTINGS_SUBSCRIBE_CALENDAR_IOS_TOAST') : t('SETTINGS_SUBSCRIBE_CALENDAR_TOAST'),
            timeout: 25000
        });
        // Stremio 4 emits not documented event subscribeCalendar
    }, [profile.auth]);
    const exportDataOnClick = React.useCallback(() => {
        loadDataExport();
    }, []);
    const onCopyRemoteUrlClick = React.useCallback(() => {
        if (streamingServer.remoteUrl) {
            navigator.clipboard.writeText(streamingServer.remoteUrl);
            toast.show({
                type: 'success',
                title: t('SETTINGS_REMOTE_URL_COPIED'),
                timeout: 2500,
            });
        }
    }, [streamingServer.remoteUrl]);
    const sectionsContainerRef = React.useRef(null);
    const generalSectionRef = React.useRef(null);
    const playerSectionRef = React.useRef(null);
    const streamingServerSectionRef = React.useRef(null);
    const shortcutsSectionRef = React.useRef(null);
    const sections = React.useMemo(() => ([
        { ref: generalSectionRef, id: GENERAL_SECTION },
        { ref: playerSectionRef, id: PLAYER_SECTION },
        { ref: streamingServerSectionRef, id: STREAMING_SECTION },
        { ref: shortcutsSectionRef, id: SHORTCUTS_SECTION },
    ]), []);
    const [selectedSectionId, setSelectedSectionId] = React.useState(GENERAL_SECTION);
    const updateSelectedSectionId = React.useCallback(() => {
        if (sectionsContainerRef.current.scrollTop + sectionsContainerRef.current.clientHeight >= sectionsContainerRef.current.scrollHeight - 50) {
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
    const sectionsContainerOnScroll = React.useCallback(throttle(() => {
        updateSelectedSectionId();
    }, 50), []);
    React.useEffect(() => {
        if (isTraktAuthenticated && traktAuthStarted) {
            core.transport.dispatch({
                action: 'Ctx',
                args: {
                    action: 'InstallTraktAddon'
                }
            });
            setTraktAuthStarted(false);
        }
    }, [isTraktAuthenticated, traktAuthStarted]);
    React.useEffect(() => {
        if (dataExport.exportUrl !== null && typeof dataExport.exportUrl === 'string') {
            platform.openExternal(dataExport.exportUrl);
        }
    }, [dataExport.exportUrl]);
    React.useLayoutEffect(() => {
        if (routeFocused) {
            updateSelectedSectionId();
        }
    }, [routeFocused]);
    return (
        <MainNavBars className={styles['settings-container']} route={'settings'}>
            <div className={classnames(styles['settings-content'], 'animation-fade-in')}>
                <div className={styles['side-menu-container']}>
                    <Button className={classnames(styles['side-menu-button'], { [styles['selected']]: selectedSectionId === GENERAL_SECTION })} title={ t('SETTINGS_NAV_GENERAL') } data-section={GENERAL_SECTION} onClick={sideMenuButtonOnClick}>
                        { t('SETTINGS_NAV_GENERAL') }
                    </Button>
                    <Button className={classnames(styles['side-menu-button'], { [styles['selected']]: selectedSectionId === PLAYER_SECTION })} title={ t('SETTINGS_NAV_PLAYER') }data-section={PLAYER_SECTION} onClick={sideMenuButtonOnClick}>
                        { t('SETTINGS_NAV_PLAYER') }
                    </Button>
                    <Button className={classnames(styles['side-menu-button'], { [styles['selected']]: selectedSectionId === STREAMING_SECTION })} title={ t('SETTINGS_NAV_STREAMING') } data-section={STREAMING_SECTION} onClick={sideMenuButtonOnClick}>
                        { t('SETTINGS_NAV_STREAMING') }
                    </Button>
                    <Button className={classnames(styles['side-menu-button'], { [styles['selected']]: selectedSectionId === SHORTCUTS_SECTION })} title={ t('SETTINGS_NAV_SHORTCUTS') } data-section={SHORTCUTS_SECTION} onClick={sideMenuButtonOnClick}>
                        { t('SETTINGS_NAV_SHORTCUTS') }
                    </Button>
                    <div className={styles['spacing']} />
                    <div className={styles['version-info-label']} title={process.env.VERSION}>
                        App Version: {process.env.VERSION}
                    </div>
                    <div className={styles['version-info-label']} title={process.env.COMMIT_HASH}>
                        Build Version: {process.env.COMMIT_HASH}
                    </div>
                    {
                        streamingServer.settings !== null && streamingServer.settings.type === 'Ready' ?
                            <div className={styles['version-info-label']} title={streamingServer.settings.content.serverVersion}>Server Version: {streamingServer.settings.content.serverVersion}</div>
                            :
                            null
                    }
                    {
                        typeof shell?.transport?.props?.shellVersion === 'string' ?
                            <div className={styles['version-info-label']} title={shell.transport.props.shellVersion}>Shell Version: {shell.transport.props.shellVersion}</div>
                            :
                            null
                    }
                </div>
                <div ref={sectionsContainerRef} className={styles['sections-container']} onScroll={sectionsContainerOnScroll}>
                    <div ref={generalSectionRef} className={styles['section-container']}>
                        <div className={classnames(styles['option-container'], styles['user-info-option-container'])}>
                            <div className={styles['user-info-content']}>
                                <div
                                    className={styles['avatar-container']}
                                    style={{
                                        backgroundImage: profile.auth === null ?
                                            `url('${require('/images/anonymous.png')}')`
                                            :
                                            profile.auth.user.avatar ?
                                                `url('${profile.auth.user.avatar}')`
                                                :
                                                `url('${require('/images/default_avatar.png')}')`
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
                                            <Button className={styles['logout-button-container']} title={ t('LOG_OUT') } onClick={logoutButtonOnClick}>
                                                <div className={styles['logout-label']}>{ t('LOG_OUT') }</div>
                                            </Button>
                                            :
                                            null
                                    }
                                </div>
                            </div>
                        </div>
                        {
                            profile.auth === null ?
                                <div className={styles['option-container']}>
                                    <Button className={classnames(styles['option-input-container'], styles['button-container'])} title={`${t('LOG_IN')} / ${t('SIGN_UP')}`} href={'#/intro'}>
                                        <div className={styles['label']}>{ t('LOG_IN') } / { t('SIGN_UP') }</div>
                                    </Button>
                                </div>
                                :
                                null
                        }
                    </div>
                    <div className={styles['section-container']}>
                        <div className={classnames(styles['option-container'], styles['link-container'])}>
                            {
                                profile.auth ?
                                    <Button className={classnames(styles['option-input-container'], styles['link-input-container'])} title={t('SETTINGS_DATA_EXPORT')} tabIndex={-1} onClick={exportDataOnClick}>
                                        <div className={styles['label']}>{ t('SETTINGS_DATA_EXPORT') }</div>
                                    </Button>
                                    :
                                    null
                            }
                        </div>
                        {
                            profile.auth !== null && profile.auth.user !== null && typeof profile.auth.user._id === 'string' ?
                                <div className={classnames(styles['option-container'], styles['link-container'])}>
                                    <Button className={classnames(styles['option-input-container'], styles['link-input-container'])} title={t('SETTINGS_SUBSCRIBE_CALENDAR')} tabIndex={-1} onClick={subscribeCalendarOnClick}>
                                        <div className={styles['label']}>{ t('SETTINGS_SUBSCRIBE_CALENDAR') }</div>
                                    </Button>
                                </div>
                                :
                                null
                        }
                        <div className={classnames(styles['option-container'], styles['link-container'])}>
                            <Button className={classnames(styles['option-input-container'], styles['link-input-container'])} title={t('SETTINGS_SUPPORT')} target={'_blank'} href={'https://stremio.zendesk.com/hc/en-us'}>
                                <div className={styles['label']}>{ t('SETTINGS_SUPPORT') }</div>
                            </Button>
                        </div>
                        <div className={classnames(styles['option-container'], styles['link-container'])}>
                            <Button className={classnames(styles['option-input-container'], styles['link-input-container'])} title={'Source code'} target={'_blank'} href={`https://github.com/stremio/stremio-web/tree/${process.env.COMMIT_HASH}`}>
                                <div className={styles['label']}>Source code</div>
                            </Button>
                        </div>
                        <div className={classnames(styles['option-container'], styles['link-container'])}>
                            <Button className={classnames(styles['option-input-container'], styles['link-input-container'])} title={t('TERMS_OF_SERVICE')} target={'_blank'} href={'https://www.stremio.com/tos'}>
                                <div className={styles['label']}>{ t('TERMS_OF_SERVICE') }</div>
                            </Button>
                        </div>
                        <div className={classnames(styles['option-container'], styles['link-container'])}>
                            <Button className={classnames(styles['option-input-container'], styles['link-input-container'])} title={t('PRIVACY_POLICY')} target={'_blank'} href={'https://www.stremio.com/privacy'}>
                                <div className={styles['label']}>{ t('PRIVACY_POLICY') }</div>
                            </Button>
                        </div>
                        {
                            profile.auth !== null && profile.auth.user !== null ?
                                <div className={classnames(styles['option-container'], styles['link-container'])}>
                                    <Button className={classnames(styles['option-input-container'], styles['link-input-container'])} title={t('SETTINGS_ACC_DELETE')} target={'_blank'} href={'https://stremio.zendesk.com/hc/en-us/articles/360021428911-How-to-delete-my-account'}>
                                        <div className={styles['label']}>{ t('SETTINGS_ACC_DELETE') }</div>
                                    </Button>
                                </div>
                                :
                                null
                        }
                        {
                            profile.auth !== null && profile.auth.user !== null && typeof profile.auth.user.email === 'string' ?
                                <div className={styles['option-container']}>
                                    <Button className={classnames(styles['option-input-container'], styles['link-input-container'])} title={t('SETTINGS_CHANGE_PASSWORD')} target={'_blank'} href={`https://www.strem.io/reset-password/${profile.auth.user.email}`}>
                                        <div className={styles['label']}>{ t('SETTINGS_CHANGE_PASSWORD') }</div>
                                    </Button>
                                </div>
                                :
                                null
                        }
                        <div className={styles['option-container']}>
                            <div className={classnames(styles['option-name-container'], styles['trakt-icon'])}>
                                <Icon className={styles['icon']} name={'trakt'} />
                                <div className={styles['label']}>Trakt Scrobbling</div>
                            </div>
                            <Button className={classnames(styles['option-input-container'], styles['button-container'])} title={'Authenticate'} disabled={profile.auth === null} tabIndex={-1} onClick={toggleTraktOnClick}>
                                <div className={styles['label']}>
                                    { profile.auth !== null && profile.auth.user !== null && profile.auth.user.trakt !== null ? t('LOG_OUT') : t('SETTINGS_TRAKT_AUTHENTICATE') }
                                </div>
                            </Button>
                        </div>
                    </div>
                    <div className={styles['section-container']}>
                        <div className={styles['option-container']}>
                            <div className={styles['option-name-container']}>
                                <div className={styles['label']}>{ t('SETTINGS_UI_LANGUAGE') }</div>
                            </div>
                            <Multiselect
                                className={classnames(styles['option-input-container'], styles['multiselect-container'])}
                                tabIndex={-1}
                                {...interfaceLanguageSelect}
                            />
                        </div>
                        {
                            shell.active &&
                                <div className={styles['option-container']}>
                                    <div className={styles['option-name-container']}>
                                        <div className={styles['label']}>{ t('SETTINGS_QUIT_ON_CLOSE') }</div>
                                    </div>
                                    <Toggle
                                        className={classnames(styles['option-input-container'], styles['toggle-container'])}
                                        tabIndex={-1}
                                        {...quitOnCloseToggle}
                                    />
                                </div>
                        }
                        <div className={styles['option-container']}>
                            <div className={styles['option-name-container']}>
                                <div className={styles['label']}>{ t('SETTINGS_BLUR_UNWATCHED_IMAGE') }</div>
                            </div>
                            <Toggle
                                className={classnames(styles['option-input-container'], styles['toggle-container'])}
                                tabIndex={-1}
                                {...hideSpoilersToggle}
                            />
                        </div>
                    </div>
                    <div ref={playerSectionRef} className={styles['section-container']}>
                        <div className={styles['section-title']}>{ t('SETTINGS_NAV_PLAYER') }</div>
                        <div className={styles['section-category-container']}>
                            <Icon className={styles['icon']} name={'subtitles'} />
                            <div className={styles['label']}>{t('SETTINGS_SECTION_SUBTITLES')}</div>
                        </div>
                        <div className={styles['option-container']}>
                            <div className={styles['option-name-container']}>
                                <div className={styles['label']}>{ t('SETTINGS_SUBTITLES_LANGUAGE') }</div>
                            </div>
                            <Multiselect
                                className={classnames(styles['option-input-container'], styles['multiselect-container'])}
                                {...subtitlesLanguageSelect}
                            />
                        </div>
                        {
                            shell.active ?
                                <div className={styles['option-container']}>
                                    <div className={styles['option-name-container']}>
                                        <div className={styles['label']}>{ t('SETTINGS_FULLSCREEN_EXIT') }</div>
                                    </div>
                                    <Toggle
                                        className={classnames(styles['option-input-container'], styles['toggle-container'])}
                                        {...escExitFullscreenToggle}
                                    />
                                </div>
                                :
                                null
                        }
                        <div className={styles['option-container']}>
                            <div className={styles['option-name-container']}>
                                <div className={styles['label']}>{ t('SETTINGS_SUBTITLES_SIZE') }</div>
                            </div>
                            <Multiselect
                                className={classnames(styles['option-input-container'], styles['multiselect-container'])}
                                {...subtitlesSizeSelect}
                            />
                        </div>
                        <div className={styles['option-container']}>
                            <div className={styles['option-name-container']}>
                                <div className={styles['label']}>{ t('SETTINGS_SUBTITLES_COLOR') }</div>
                            </div>
                            <ColorInput
                                className={classnames(styles['option-input-container'], styles['color-input-container'])}
                                {...subtitlesTextColorInput}
                            />
                        </div>
                        <div className={styles['option-container']}>
                            <div className={styles['option-name-container']}>
                                <div className={styles['label']}>{ t('SETTINGS_SUBTITLES_COLOR_BACKGROUND') }</div>
                            </div>
                            <ColorInput
                                className={classnames(styles['option-input-container'], styles['color-input-container'])}
                                {...subtitlesBackgroundColorInput}
                            />
                        </div>
                        <div className={styles['option-container']}>
                            <div className={styles['option-name-container']}>
                                <div className={styles['label']}>{ t('SETTINGS_SUBTITLES_COLOR_OUTLINE') }</div>
                            </div>
                            <ColorInput
                                className={classnames(styles['option-input-container'], styles['color-input-container'])}
                                {...subtitlesOutlineColorInput}
                            />
                        </div>
                    </div>
                    <div className={styles['section-container']}>
                        <div className={styles['section-category-container']}>
                            <Icon className={styles['icon']} name={'volume-medium'} />
                            <div className={styles['label']}>{t('SETTINGS_SECTION_AUDIO')}</div>
                        </div>
                        <div className={styles['option-container']}>
                            <div className={styles['option-name-container']}>
                                <div className={styles['label']}>{ t('SETTINGS_DEFAULT_AUDIO_TRACK') }</div>
                            </div>
                            <Multiselect
                                className={classnames(styles['option-input-container'], styles['multiselect-container'])}
                                {...audioLanguageSelect}
                            />
                        </div>
                        <div className={styles['option-container']}>
                            <div className={styles['option-name-container']}>
                                <div className={styles['label']}>{ t('SETTINGS_SURROUND_SOUND') }</div>
                            </div>
                            <Toggle
                                className={classnames(styles['option-input-container'], styles['toggle-container'])}
                                tabIndex={-1}
                                {...surroundSoundToggle}
                            />
                        </div>
                    </div>
                    <div className={styles['section-container']}>
                        <div className={styles['section-category-container']}>
                            <Icon className={styles['icon']} name={'remote'} />
                            <div className={styles['label']}>{t('SETTINGS_SECTION_CONTROLS')}</div>
                        </div>
                        <div className={styles['option-container']}>
                            <div className={styles['option-name-container']}>
                                <div className={styles['label']}>{ t('SETTINGS_SEEK_KEY') }</div>
                            </div>
                            <Multiselect
                                className={classnames(styles['option-input-container'], styles['multiselect-container'])}
                                {...seekTimeDurationSelect}
                            />
                        </div>
                        <div className={styles['option-container']}>
                            <div className={styles['option-name-container']}>
                                <div className={styles['label']}>{ t('SETTINGS_SEEK_KEY_SHIFT') }</div>
                            </div>
                            <Multiselect
                                className={classnames(styles['option-input-container'], styles['multiselect-container'])}
                                {...seekShortTimeDurationSelect}
                            />
                        </div>
                        <div className={styles['option-container']}>
                            <div className={styles['option-name-container']}>
                                <div className={styles['label']}>{ t('SETTINGS_PLAY_IN_BACKGROUND') }</div>
                            </div>
                            <Toggle
                                className={classnames(styles['option-input-container'], styles['toggle-container'])}
                                disabled={true}
                                tabIndex={-1}
                                {...playInBackgroundToggle}
                            />
                        </div>
                    </div>
                    <div className={styles['section-container']}>
                        <div className={styles['section-category-container']}>
                            <Icon className={styles['icon']} name={'play'} />
                            <div className={styles['label']}>{t('SETTINGS_SECTION_AUTO_PLAY')}</div>
                        </div>
                        <div className={styles['option-container']}>
                            <div className={styles['option-name-container']}>
                                <div className={styles['label']}>{ t('AUTO_PLAY') }</div>
                            </div>
                            <Toggle
                                className={classnames(styles['option-input-container'], styles['toggle-container'])}
                                {...bingeWatchingToggle}
                            />
                        </div>
                        <div className={styles['option-container']}>
                            <div className={styles['option-name-container']}>
                                <div className={styles['label']}>{ t('SETTINGS_NEXT_VIDEO_POPUP_DURATION') }</div>
                            </div>
                            <Multiselect
                                className={classnames(styles['option-input-container'], styles['multiselect-container'])}
                                disabled={!profile.settings.bingeWatching}
                                {...nextVideoPopupDurationSelect}
                            />
                        </div>
                    </div>
                    <div className={styles['section-container']}>
                        <div className={styles['section-category-container']}>
                            <Icon className={styles['icon']} name={'glasses'} />
                            <div className={styles['label']}>{t('SETTINGS_SECTION_ADVANCED')}</div>
                        </div>
                        <div className={styles['option-container']}>
                            <div className={styles['option-name-container']}>
                                <div className={styles['label']}>{ t('SETTINGS_PLAY_IN_EXTERNAL_PLAYER') }</div>
                            </div>
                            <Multiselect
                                className={classnames(styles['option-input-container'], styles['multiselect-container'])}
                                {...playInExternalPlayerSelect}
                            />
                        </div>
                        {
                            shell.active &&
                                <div className={styles['option-container']}>
                                    <div className={styles['option-name-container']}>
                                        <div className={styles['label']}>{ t('SETTINGS_HWDEC') }</div>
                                    </div>
                                    <Toggle
                                        className={classnames(styles['option-input-container'], styles['toggle-container'])}
                                        tabIndex={-1}
                                        {...hardwareDecodingToggle}
                                    />
                                </div>
                        }
                    </div>
                    <div ref={streamingServerSectionRef} className={styles['section-container']}>
                        <div className={styles['section-title']}>{ t('SETTINGS_NAV_STREAMING') }</div>
                        <URLsManager />
                        {
                            streamingServerRemoteUrlInput.value !== null ?
                                <div className={styles['option-container']}>
                                    <div className={styles['option-name-container']}>
                                        <div className={styles['label']}>{t('SETTINGS_REMOTE_URL')}</div>
                                    </div>
                                    <div className={classnames(styles['option-input-container'], styles['configure-input-container'])}>
                                        <div className={styles['label']} title={streamingServerRemoteUrlInput.value}>{streamingServerRemoteUrlInput.value}</div>
                                        <Button className={styles['configure-button-container']} title={t('SETTINGS_COPY_REMOTE_URL')} onClick={onCopyRemoteUrlClick}>
                                            <Icon className={styles['icon']} name={'link'} />
                                        </Button>
                                    </div>
                                </div>
                                :
                                null
                        }
                        {
                            profile.auth !== null && profile.auth.user !== null && remoteEndpointSelect !== null ?
                                <div className={styles['option-container']}>
                                    <div className={styles['option-name-container']}>
                                        <div className={styles['label']}>{ t('SETTINGS_HTTPS_ENDPOINT') }</div>
                                    </div>
                                    <Multiselect
                                        className={classnames(styles['option-input-container'], styles['multiselect-container'])}
                                        {...remoteEndpointSelect}
                                    />
                                </div>
                                :
                                null
                        }
                        {
                            cacheSizeSelect !== null ?
                                <div className={styles['option-container']}>
                                    <div className={styles['option-name-container']}>
                                        <div className={styles['label']}>{ t('SETTINGS_SERVER_CACHE_SIZE') }</div>
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
                                        <div className={styles['label']}>{ t('SETTINGS_SERVER_TORRENT_PROFILE') }</div>
                                    </div>
                                    <Multiselect
                                        className={classnames(styles['option-input-container'], styles['multiselect-container'])}
                                        {...torrentProfileSelect}
                                    />
                                </div>
                                :
                                null
                        }
                        {
                            transcodingProfileSelect !== null ?
                                <div className={styles['option-container']}>
                                    <div className={styles['option-name-container']}>
                                        <div className={styles['label']}>{ t('SETTINGS_TRANSCODE_PROFILE') }</div>
                                    </div>
                                    <Multiselect
                                        className={classnames(styles['option-input-container'], styles['multiselect-container'])}
                                        {...transcodingProfileSelect}
                                    />
                                </div>
                                :
                                null
                        }
                    </div>
                    <div ref={shortcutsSectionRef} className={styles['section-container']}>
                        <div className={styles['section-title']}>{ t('SETTINGS_NAV_SHORTCUTS') }</div>
                        <div className={styles['option-container']}>
                            <div className={styles['option-name-container']}>
                                <div className={styles['label']}>{ t('SETTINGS_SHORTCUT_PLAY_PAUSE') }</div>
                            </div>
                            <div className={classnames(styles['option-input-container'], styles['shortcut-container'])}>
                                <kbd>{ t('SETTINGS_SHORTCUT_SPACE') }</kbd>
                            </div>
                        </div>
                        <div className={styles['option-container']}>
                            <div className={styles['option-name-container']}>
                                <div className={styles['label']}>{ t('SETTINGS_SHORTCUT_SEEK_FORWARD') }</div>
                            </div>
                            <div className={classnames(styles['option-input-container'], styles['shortcut-container'])}>
                                <kbd>→</kbd>
                                <div className={styles['label']}>{ t('SETTINGS_SHORTCUT_OR') }</div>
                                <kbd>⇧ { t('SETTINGS_SHORTCUT_SHIFT') }</kbd>
                                <div className={styles['label']}>+</div>
                                <kbd>→</kbd>
                            </div>
                        </div>
                        <div className={styles['option-container']}>
                            <div className={styles['option-name-container']}>
                                <div className={styles['label']}>{ t('SETTINGS_SHORTCUT_SEEK_BACKWARD') }</div>
                            </div>
                            <div className={classnames(styles['option-input-container'], styles['shortcut-container'])}>
                                <kbd>←</kbd>
                                <div className={styles['label']}>{ t('SETTINGS_SHORTCUT_OR') }</div>
                                <kbd>⇧ { t('SETTINGS_SHORTCUT_SHIFT') }</kbd>
                                <div className={styles['label']}>+</div>
                                <kbd>←</kbd>
                            </div>
                        </div>
                        <div className={styles['option-container']}>
                            <div className={styles['option-name-container']}>
                                <div className={styles['label']}>{ t('SETTINGS_SHORTCUT_VOLUME_UP') }</div>
                            </div>
                            <div className={classnames(styles['option-input-container'], styles['shortcut-container'])}>
                                <kbd>↑</kbd>
                            </div>
                        </div>
                        <div className={styles['option-container']}>
                            <div className={styles['option-name-container']}>
                                <div className={styles['label']}>{ t('SETTINGS_SHORTCUT_VOLUME_DOWN') }</div>
                            </div>
                            <div className={classnames(styles['option-input-container'], styles['shortcut-container'])}>
                                <kbd>↓</kbd>
                            </div>
                        </div>
                        <div className={styles['option-container']}>
                            <div className={styles['option-name-container']}>
                                <div className={styles['label']}>{ t('SETTINGS_SHORTCUT_MENU_SUBTITLES') }</div>
                            </div>
                            <div className={classnames(styles['option-input-container'], styles['shortcut-container'])}>
                                <kbd>S</kbd>
                            </div>
                        </div>
                        <div className={styles['option-container']}>
                            <div className={styles['option-name-container']}>
                                <div className={styles['label']}>{ t('SETTINGS_SHORTCUT_MENU_AUDIO') }</div>
                            </div>
                            <div className={classnames(styles['option-input-container'], styles['shortcut-container'])}>
                                <kbd>A</kbd>
                            </div>
                        </div>
                        <div className={styles['option-container']}>
                            <div className={styles['option-name-container']}>
                                <div className={styles['label']}>{ t('SETTINGS_SHORTCUT_MENU_INFO') }</div>
                            </div>
                            <div className={classnames(styles['option-input-container'], styles['shortcut-container'])}>
                                <kbd>I</kbd>
                            </div>
                        </div>
                        <div className={styles['option-container']}>
                            <div className={styles['option-name-container']}>
                                <div className={styles['label']}>{ t('SETTINGS_SHORTCUT_MENU_VIDEOS') }</div>
                            </div>
                            <div className={classnames(styles['option-input-container'], styles['shortcut-container'])}>
                                <kbd>V</kbd>
                            </div>
                        </div>
                        <div className={styles['option-container']}>
                            <div className={styles['option-name-container']}>
                                <div className={styles['label']}>{ t('SETTINGS_SHORTCUT_FULLSCREEN') }</div>
                            </div>
                            <div className={classnames(styles['option-input-container'], styles['shortcut-container'])}>
                                <kbd>F</kbd>
                            </div>
                        </div>
                        <div className={styles['option-container']}>
                            <div className={styles['option-name-container']}>
                                <div className={styles['label']}>{ t('SETTINGS_SHORTCUT_NAVIGATE_MENUS') }</div>
                            </div>
                            <div className={classnames(styles['option-input-container'], styles['shortcut-container'])}>
                                <kbd>1</kbd>
                                <div className={styles['label']}>{ t('SETTINGS_SHORTCUT_TO') }</div>
                                <kbd>6</kbd>
                            </div>
                        </div>
                        <div className={styles['option-container']}>
                            <div className={styles['option-name-container']}>
                                <div className={styles['label']}>{ t('SETTINGS_SHORTCUT_GO_TO_SEARCH') }</div>
                            </div>
                            <div className={classnames(styles['option-input-container'], styles['shortcut-container'])}>
                                <kbd>0</kbd>
                            </div>
                        </div>
                        <div className={styles['option-container']}>
                            <div className={styles['option-name-container']}>
                                <div className={styles['label']}>{ t('SETTINGS_SHORTCUT_EXIT_BACK') }</div>
                            </div>
                            <div className={classnames(styles['option-input-container'], styles['shortcut-container'])}>
                                <kbd>{ t('SETTINGS_SHORTCUT_ESC') }</kbd>
                            </div>
                        </div>
                    </div>
                    <div className={classnames(styles['section-container'], styles['versions-section-container'])}>
                        <div className={styles['option-container']}>
                            <div className={styles['option-name-container']}>
                                <div className={styles['label']}>
                                    App Version
                                </div>
                            </div>
                            <div className={classnames(styles['option-input-container'], styles['info-container'])}>
                                <div className={styles['label']}>
                                    {process.env.VERSION}
                                </div>
                            </div>
                        </div>
                        <div className={styles['option-container']}>
                            <div className={styles['option-name-container']}>
                                <div className={styles['label']}>
                                    Build Version
                                </div>
                            </div>
                            <div className={classnames(styles['option-input-container'], styles['info-container'])}>
                                <div className={styles['label']}>
                                    {process.env.COMMIT_HASH}
                                </div>
                            </div>
                        </div>
                        {
                            streamingServer.settings !== null && streamingServer.settings.type === 'Ready' ?
                                <div className={styles['option-container']}>
                                    <div className={styles['option-name-container']}>
                                        <div className={styles['label']}>
                                            Server Version
                                        </div>
                                    </div>
                                    <div className={classnames(styles['option-input-container'], styles['info-container'])}>
                                        <div className={styles['label']}>
                                            {streamingServer.settings.content.serverVersion}
                                        </div>
                                    </div>
                                </div>
                                :
                                null
                        }
                        {
                            typeof shell?.transport?.props?.shellVersion === 'string' ?
                                <div className={styles['option-container']}>
                                    <div className={styles['option-name-container']}>
                                        <div className={styles['label']}>
                                            Shell Version
                                        </div>
                                    </div>
                                    <div className={classnames(styles['option-input-container'], styles['info-container'])}>
                                        <div className={styles['label']}>
                                            { shell.transport.props.shellVersion }
                                        </div>
                                    </div>
                                </div>
                                :
                                null
                        }
                    </div>
                </div>
            </div>
        </MainNavBars>
    );
};

const SettingsFallback = () => (
    <MainNavBars className={styles['settings-container']} route={'settings'} />
);

module.exports = withCoreSuspender(Settings, SettingsFallback);
