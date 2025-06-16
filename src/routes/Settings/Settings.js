// Copyright (C) 2017-2023 Smart code 203358507

const React = require('react');
const classnames = require('classnames');
const throttle = require('lodash.throttle');
const { useTranslation } = require('react-i18next');
const { default: Icon } = require('@stremio/stremio-icons/react');
const { useRouteFocused } = require('stremio-router');
const { useServices } = require('stremio/services');
const { useProfile, usePlatform, useStreamingServer, withCoreSuspender, useToast } = require('stremio/common');
const { Button, ColorInput, MainNavBars, MultiselectMenu, Toggle } = require('stremio/components');
const { SECTIONS } = require('./constants');
const { default: Menu } = require('./Menu');
const { default: Link } = require('./Link');
const { default: Option } = require('./Option');
const { default: Section } = require('./Section');
const { default: Category } = require('./Category');
const { default: URLsManager } = require('./URLsManager/URLsManager');
const useProfileSettingsInputs = require('./useProfileSettingsInputs');
const useStreamingServerSettingsInputs = require('./useStreamingServerSettingsInputs');
const useDataExport = require('./useDataExport');
const styles = require('./styles');
const { default: User } = require('./User');

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
        pauseOnMinimizeToggle,
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
        { ref: generalSectionRef, id: SECTIONS.GENERAL },
        { ref: playerSectionRef, id: SECTIONS.PLAYER },
        { ref: streamingServerSectionRef, id: SECTIONS.STREAMING },
        { ref: shortcutsSectionRef, id: SECTIONS.SHORTCUTS },
    ]), []);
    const [selectedSectionId, setSelectedSectionId] = React.useState(SECTIONS.GENERAL);
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
                <Menu
                    selected={selectedSectionId}
                    shell={shell}
                    streamingServer={streamingServer}
                    onSelect={sideMenuButtonOnClick}
                />

                <div ref={sectionsContainerRef} className={styles['sections-container']} onScroll={sectionsContainerOnScroll}>
                    <Section ref={generalSectionRef}>
                        <User profile={profile} onLogout={logoutButtonOnClick} />
                    </Section>

                    <Section>
                        {
                            profile.auth &&
                                <Link
                                    label={t('SETTINGS_DATA_EXPORT')}
                                    onClick={exportDataOnClick}
                                />
                        }
                        {
                            profile.auth !== null && profile.auth.user !== null && typeof profile.auth.user._id === 'string' &&
                                <Link
                                    label={t('SETTINGS_SUBSCRIBE_CALENDAR')}
                                    onClick={subscribeCalendarOnClick}
                                />
                        }
                        <Link
                            label={t('SETTINGS_SUPPORT')}
                            href={'https://stremio.zendesk.com/hc/en-us'}
                        />
                        <Link
                            label={'Source Code'}
                            href={`https://github.com/stremio/stremio-web/tree/${process.env.COMMIT_HASH}`}
                        />
                        <Link
                            label={t('TERMS_OF_SERVICE')}
                            href={'https://www.stremio.com/tos'}
                        />
                        <Link
                            label={t('PRIVACY_POLICY')}
                            href={'https://www.stremio.com/privacy'}
                        />
                        {
                            profile.auth !== null && profile.auth.user !== null &&
                                <Link
                                    label={t('SETTINGS_ACC_DELETE')}
                                    href={'https://stremio.zendesk.com/hc/en-us/articles/360021428911-How-to-delete-my-account'}
                                />
                        }
                        {
                            profile.auth !== null && profile.auth.user !== null && typeof profile.auth.user.email === 'string' &&
                                <Link
                                    label={t('SETTINGS_CHANGE_PASSWORD')}
                                    href={`https://www.strem.io/reset-password/${profile.auth.user.email}`}
                                />
                        }
                        <Option className={styles['trakt-container']} icon={'trakt'} label={'Trakt Scrobbling'}>
                            <Button className={styles['button']} title={'Authenticate'} disabled={profile.auth === null} tabIndex={-1} onClick={toggleTraktOnClick}>
                                {isTraktAuthenticated ? t('LOG_OUT') : t('SETTINGS_TRAKT_AUTHENTICATE')}
                            </Button>
                        </Option>
                    </Section>

                    <Section>
                        <Option label={'SETTINGS_UI_LANGUAGE'}>
                            <MultiselectMenu
                                className={styles['multiselect']}
                                {...interfaceLanguageSelect}
                            />
                        </Option>
                        {
                            shell.active &&
                                <Option label={'SETTINGS_QUIT_ON_CLOSE'}>
                                    <Toggle
                                        tabIndex={-1}
                                        {...quitOnCloseToggle}
                                    />
                                </Option>
                        }
                        {
                            shell.active &&
                                <Option label={'SETTINGS_FULLSCREEN_EXIT'}>
                                    <Toggle
                                        tabIndex={-1}
                                        {...escExitFullscreenToggle}
                                    />
                                </Option>
                        }
                        <Option label={'SETTINGS_BLUR_UNWATCHED_IMAGE'}>
                            <Toggle
                                tabIndex={-1}
                                {...hideSpoilersToggle}
                            />
                        </Option>
                    </Section>

                    <Section ref={playerSectionRef} label={'SETTINGS_NAV_PLAYER'}>
                        <Category icon={'subtitles'} label={'SETTINGS_SECTION_SUBTITLES'}>
                            <Option label={'SETTINGS_SUBTITLES_LANGUAGE'}>
                                <MultiselectMenu
                                    className={styles['multiselect']}
                                    {...subtitlesLanguageSelect}
                                />
                            </Option>
                            <Option label={'SETTINGS_SUBTITLES_SIZE'}>
                                <MultiselectMenu
                                    className={styles['multiselect']}
                                    {...subtitlesSizeSelect}
                                />
                            </Option>
                            <Option label={'SETTINGS_SUBTITLES_COLOR'}>
                                <ColorInput
                                    className={styles['color-input']}
                                    {...subtitlesTextColorInput}
                                />
                            </Option>
                            <Option label={'SETTINGS_SUBTITLES_COLOR_BACKGROUND'}>
                                <ColorInput
                                    className={styles['color-input']}
                                    {...subtitlesBackgroundColorInput}
                                />
                            </Option>
                            <Option label={'SETTINGS_SUBTITLES_COLOR_OUTLINE'}>
                                <ColorInput
                                    className={styles['color-input']}
                                    {...subtitlesOutlineColorInput}
                                />
                            </Option>
                        </Category>
                        <Category icon={'volume-medium'} label={'SETTINGS_SECTION_AUDIO'}>
                            <Option label={'SETTINGS_DEFAULT_AUDIO_TRACK'}>
                                <MultiselectMenu
                                    className={styles['multiselect']}
                                    {...audioLanguageSelect}
                                />
                            </Option>
                            <Option label={'SETTINGS_SURROUND_SOUND'}>
                                <Toggle
                                    tabIndex={-1}
                                    {...surroundSoundToggle}
                                />
                            </Option>
                        </Category>
                        <Category icon={'remote'} label={'SETTINGS_SECTION_CONTROLS'}>
                            <Option label={'SETTINGS_SEEK_KEY'}>
                                <MultiselectMenu
                                    className={styles['multiselect']}
                                    {...seekTimeDurationSelect}
                                />
                            </Option>
                            <Option label={'SETTINGS_SEEK_KEY_SHIFT'}>
                                <MultiselectMenu
                                    className={styles['multiselect']}
                                    {...seekShortTimeDurationSelect}
                                />
                            </Option>
                            <Option label={'SETTINGS_PLAY_IN_BACKGROUND'}>
                                <Toggle
                                    disabled={true}
                                    tabIndex={-1}
                                    {...playInBackgroundToggle}
                                />
                            </Option>
                        </Category>
                        <Category icon={'play'} label={'SETTINGS_SECTION_AUTO_PLAY'}>
                            <Option label={'AUTO_PLAY'}>
                                <Toggle
                                    tabIndex={-1}
                                    {...bingeWatchingToggle}
                                />
                            </Option>
                            <Option label={'SETTINGS_NEXT_VIDEO_POPUP_DURATION'}>
                                <MultiselectMenu
                                    className={styles['multiselect']}
                                    disabled={!profile.settings.bingeWatching}
                                    {...nextVideoPopupDurationSelect}
                                />
                            </Option>
                        </Category>
                        <Category icon={'glasses'} label={'SETTINGS_SECTION_ADVANCED'}>
                            <Option label={'SETTINGS_PLAY_IN_EXTERNAL_PLAYER'}>
                                <MultiselectMenu
                                    className={styles['multiselect']}
                                    {...playInExternalPlayerSelect}
                                />
                            </Option>
                            {
                                shell.active &&
                                    <Option label={'SETTINGS_HWDEC'}>
                                        <Toggle
                                            tabIndex={-1}
                                            {...hardwareDecodingToggle}
                                        />
                                    </Option>
                            }
                            {
                                shell.active &&
                                    <Option label={'SETTINGS_PAUSE_MINIMIZED'}>
                                        <Toggle
                                            tabIndex={-1}
                                            {...pauseOnMinimizeToggle}
                                        />
                                    </Option>
                            }
                        </Category>
                    </Section>

                    <Section ref={streamingServerSectionRef} label={'SETTINGS_NAV_STREAMING'}>
                        <URLsManager />
                        {
                            streamingServerRemoteUrlInput.value !== null &&
                                <Option className={styles['configure-input-container']} label={'SETTINGS_REMOTE_URL'}>
                                    <div className={styles['label']} title={streamingServerRemoteUrlInput.value}>{streamingServerRemoteUrlInput.value}</div>
                                    <Button className={styles['configure-button-container']} title={t('SETTINGS_COPY_REMOTE_URL')} onClick={onCopyRemoteUrlClick}>
                                        <Icon className={styles['icon']} name={'link'} />
                                    </Button>
                                </Option>
                        }
                        {
                            profile.auth !== null && profile.auth.user !== null && remoteEndpointSelect !== null &&
                                <Option label={'SETTINGS_HTTPS_ENDPOINT'}>
                                    <MultiselectMenu
                                        className={styles['multiselect']}
                                        {...remoteEndpointSelect}
                                    />
                                </Option>
                        }
                        {
                            cacheSizeSelect !== null &&
                                <Option label={'SETTINGS_SERVER_CACHE_SIZE'}>
                                    <MultiselectMenu
                                        className={styles['multiselect']}
                                        {...cacheSizeSelect}
                                    />
                                </Option>
                        }
                        {
                            torrentProfileSelect !== null &&
                                <Option label={'SETTINGS_SERVER_TORRENT_PROFILE'}>
                                    <MultiselectMenu
                                        className={styles['multiselect']}
                                        {...torrentProfileSelect}
                                    />
                                </Option>
                        }
                        {
                            transcodingProfileSelect !== null &&
                                <Option label={'SETTINGS_TRANSCODE_PROFILE'}>
                                    <MultiselectMenu
                                        className={styles['multiselect']}
                                        {...transcodingProfileSelect}
                                    />
                                </Option>
                        }
                    </Section>

                    <Section ref={shortcutsSectionRef} label={'SETTINGS_NAV_SHORTCUTS'}>
                        <Option label={'SETTINGS_SHORTCUT_PLAY_PAUSE'}>
                            <div className={styles['shortcut-container']}>
                                <kbd>{t('SETTINGS_SHORTCUT_SPACE')}</kbd>
                            </div>
                        </Option>
                        <Option label={'SETTINGS_SHORTCUT_SEEK_FORWARD'}>
                            <div className={styles['shortcut-container']}>
                                <kbd>→</kbd>
                                <div className={styles['label']}>{t('SETTINGS_SHORTCUT_OR')}</div>
                                <kbd>⇧ {t('SETTINGS_SHORTCUT_SHIFT')}</kbd>
                                <div className={styles['label']}>+</div>
                                <kbd>→</kbd>
                            </div>
                        </Option>
                        <Option label={'SETTINGS_SHORTCUT_SEEK_BACKWARD'}>
                            <div className={styles['shortcut-container']}>
                                <kbd>←</kbd>
                                <div className={styles['label']}>{t('SETTINGS_SHORTCUT_OR')}</div>
                                <kbd>⇧ {t('SETTINGS_SHORTCUT_SHIFT')}</kbd>
                                <div className={styles['label']}>+</div>
                                <kbd>←</kbd>
                            </div>
                        </Option>
                        <Option label={'SETTINGS_SHORTCUT_VOLUME_UP'}>
                            <div className={styles['shortcut-container']}>
                                <kbd>↑</kbd>
                            </div>
                        </Option>
                        <Option label={'SETTINGS_SHORTCUT_VOLUME_DOWN'}>
                            <div className={styles['shortcut-container']}>
                                <kbd>↓</kbd>
                            </div>
                        </Option>
                        <Option label={'SETTINGS_SHORTCUT_MENU_SUBTITLES'}>
                            <div className={styles['shortcut-container']}>
                                <kbd>S</kbd>
                            </div>
                        </Option>
                        <Option label={'SETTINGS_SHORTCUT_MENU_AUDIO'}>
                            <div className={styles['shortcut-container']}>
                                <kbd>A</kbd>
                            </div>
                        </Option>
                        <Option label={'SETTINGS_SHORTCUT_MENU_INFO'}>
                            <div className={styles['shortcut-container']}>
                                <kbd>I</kbd>
                            </div>
                        </Option>
                        <Option label={'SETTINGS_SHORTCUT_MENU_VIDEOS'}>
                            <div className={styles['shortcut-container']}>
                                <kbd>V</kbd>
                            </div>
                        </Option>
                        <Option label={'SETTINGS_SHORTCUT_FULLSCREEN'}>
                            <div className={styles['shortcut-container']}>
                                <kbd>F</kbd>
                            </div>
                        </Option>
                        <Option label={'SETTINGS_SHORTCUT_NAVIGATE_MENUS'}>
                            <div className={styles['shortcut-container']}>
                                <kbd>1</kbd>
                                <div className={styles['label']}>{t('SETTINGS_SHORTCUT_TO')}</div>
                                <kbd>6</kbd>
                            </div>
                        </Option>
                        <Option label={'SETTINGS_SHORTCUT_GO_TO_SEARCH'}>
                            <div className={styles['shortcut-container']}>
                                <kbd>0</kbd>
                            </div>
                        </Option>
                        <Option label={'SETTINGS_SHORTCUT_EXIT_BACK'}>
                            <div className={styles['shortcut-container']}>
                                <kbd>{t('SETTINGS_SHORTCUT_ESC')}</kbd>
                            </div>
                        </Option>
                    </Section>

                    <Section className={styles['versions-section-container']}>
                        <Option className={styles['info-container']} label={'App Vesion'}>
                            <div className={styles['label']}>
                                {process.env.VERSION}
                            </div>
                        </Option>
                        <Option className={styles['info-container']} label={'Build Version'}>
                            <div className={styles['label']}>
                                {process.env.COMMIT_HASH}
                            </div>
                        </Option>
                        {
                            streamingServer.settings !== null && streamingServer.settings.type === 'Ready' &&
                                <Option className={styles['info-container']} label={'Server Version'}>
                                    <div className={styles['label']}>
                                        {streamingServer.settings.content.serverVersion}
                                    </div>
                                </Option>
                        }
                        {
                            typeof shell?.transport?.props?.shellVersion === 'string' &&
                                <Option className={styles['info-container']} label={'Shell Version'}>
                                    <div className={styles['label']}>
                                        {shell.transport.props.shellVersion}
                                    </div>
                                </Option>
                        }
                    </Section>
                </div>
            </div>
        </MainNavBars>
    );
};

const SettingsFallback = () => (
    <MainNavBars className={styles['settings-container']} route={'settings'} />
);

module.exports = withCoreSuspender(Settings, SettingsFallback);
