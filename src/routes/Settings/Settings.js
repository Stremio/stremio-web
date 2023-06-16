// Copyright (C) 2017-2023 Smart code 203358507

const React = require('react');
const classnames = require('classnames');
const throttle = require('lodash.throttle');
const { useTranslation } = require('react-i18next');
const Icon = require('@stremio/stremio-icons/dom');
const { useRouteFocused } = require('stremio-router');
const { useServices } = require('stremio/services');
const { Button, Checkbox, MainNavBars, Multiselect, ColorInput, TextInput, ModalDialog, useProfile, useStreamingServer, useBinaryState, withCoreSuspender, useToast } = require('stremio/common');
const useProfileSettingsInputs = require('./useProfileSettingsInputs');
const useStreamingServerSettingsInputs = require('./useStreamingServerSettingsInputs');
const useDataExport = require('./useDataExport');
const styles = require('./styles');

const GENERAL_SECTION = 'general';
const PLAYER_SECTION = 'player';
const STREAMING_SECTION = 'streaming';
const SHORTCUTS_SECTION = 'shortcuts';

const Settings = () => {
    const { t } = useTranslation();
    const { core } = useServices();
    const { routeFocused } = useRouteFocused();
    const profile = useProfile();
    const [dataExport, loadDataExport] = useDataExport();
    const streamingServer = useStreamingServer();
    const toast = useToast();
    const {
        interfaceLanguageSelect,
        subtitlesLanguageSelect,
        subtitlesSizeSelect,
        subtitlesTextColorInput,
        subtitlesBackgroundColorInput,
        subtitlesOutlineColorInput,
        audioLanguageSelect,
        seekTimeDurationSelect,
        playInExternalPlayerSelect,
        nextVideoPopupDurationSelect,
        bingeWatchingCheckbox,
        playInBackgroundCheckbox,
        hardwareDecodingCheckbox,
        streamingServerUrlInput
    } = useProfileSettingsInputs(profile);
    const {
        cacheSizeSelect,
        torrentProfileSelect
    } = useStreamingServerSettingsInputs(streamingServer);
    const [configureServerUrlModalOpen, openConfigureServerUrlModal, closeConfigureServerUrlModal] = useBinaryState(false);
    const configureServerUrlInputRef = React.useRef(null);
    const configureServerUrlOnSubmit = React.useCallback(() => {
        streamingServerUrlInput.onChange(configureServerUrlInputRef.current.value);
        closeConfigureServerUrlModal();
    }, [streamingServerUrlInput]);
    const [traktAuthStarted, setTraktAuthStarted] = React.useState(false);
    const isTraktAuthenticated = React.useMemo(() => {
        return profile.auth !== null && profile.auth.user !== null && profile.auth.user.trakt !== null &&
            (Date.now() / 1000) < (profile.auth.user.trakt.created_at + profile.auth.user.trakt.expires_in);
    }, [profile.auth]);
    const configureServerUrlModalButtons = React.useMemo(() => {
        return [
            {
                className: styles['cancel-button'],
                label: 'Cancel',
                props: {
                    onClick: closeConfigureServerUrlModal
                }
            },
            {
                label: 'Submit',
                props: {
                    onClick: configureServerUrlOnSubmit,
                }
            }
        ];
    }, [configureServerUrlOnSubmit]);
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
            window.open(`https://www.strem.io/trakt/auth/${profile.auth.user._id}`);
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
        const url = `webcal://www.strem.io/calendar/${profile.auth.user._id}.ics`;
        window.open(url);
        toast.show({
            type: 'success',
            title: 'Calendar has been added to your default caldendar app',
            timeout: 25000
        });
        //Stremio 4 emits not documented event subscribeCalendar
    }, []);
    const exportDataOnClick = React.useCallback(() => {
        loadDataExport();
    }, []);
    const reloadStreamingServer = React.useCallback(() => {
        core.transport.dispatch({
            action: 'StreamingServer',
            args: {
                action: 'Reload'
            }
        });
    }, []);
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
    const sectionsContainerOnScorll = React.useCallback(throttle(() => {
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
            window.open(dataExport.exportUrl);
        }
    }, [dataExport.exportUrl]);
    React.useLayoutEffect(() => {
        if (routeFocused) {
            updateSelectedSectionId();
        }
        closeConfigureServerUrlModal();
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
                    <div className={styles['version-info-label']} title={process.env.VERSION}>App Version: {process.env.VERSION}</div>
                    {
                        streamingServer.settings !== null && streamingServer.settings.type === 'Ready' ?
                            <div className={styles['version-info-label']} title={streamingServer.settings.content.serverVersion}>Server Version: {streamingServer.settings.content.serverVersion}</div>
                            :
                            null
                    }
                </div>
                <div ref={sectionsContainerRef} className={styles['sections-container']} onScroll={sectionsContainerOnScorll}>
                    <div ref={generalSectionRef} className={styles['section-container']}>
                        <div className={styles['section-title']}>{ t('SETTINGS_NAV_GENERAL') }</div>
                        <div className={classnames(styles['option-container'], styles['user-info-option-container'])}>
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
                                        <Button className={styles['logout-button-container']} title={ t('LOG_OUT') } href={'#/intro'} onClick={logoutButtonOnClick}>
                                            <div className={styles['logout-label']}>{ t('LOG_OUT') }</div>
                                        </Button>
                                        :
                                        null
                                }
                            </div>
                            <Button className={styles['user-panel-container']} title={'User panel'} target={'_blank'} href={'https://www.stremio.com/acc-settings'}>
                                <div className={styles['user-panel-label']}>{ t('USER_PANEL') }</div>
                            </Button>
                        </div>
                        {
                            profile.auth === null ?
                                <div className={styles['option-container']}>
                                    <Button className={classnames(styles['option-input-container'], styles['button-container'])} title={`${t('LOG_IN')} / ${t('SIGN_UP')}`} href={'#/intro'} onClick={logoutButtonOnClick}>
                                        <div className={styles['label']}>{ t('LOG_IN') } / { t('SIGN_UP') }</div>
                                    </Button>
                                </div>
                                :
                                null
                        }
                        <div className={styles['option-container']}>
                            <div className={styles['option-name-container']}>
                                <div className={styles['label']}>{ t('SETTINGS_INTERFACE_LANGUAGE') }</div>
                            </div>
                            <Multiselect
                                className={classnames(styles['option-input-container'], styles['multiselect-container'])}
                                tabIndex={-1}
                                {...interfaceLanguageSelect}
                            />
                        </div>
                        <div className={styles['option-container']}>
                            <div className={styles['option-name-container']}>
                                <div className={styles['label']}>Trakt Scrobbling</div>
                            </div>
                            <Button className={classnames(styles['option-input-container'], styles['button-container'])} title={'Authenticate'} disabled={profile.auth === null} tabIndex={-1} onClick={toggleTraktOnClick}>
                                <Icon className={styles['icon']} icon={'ic_trakt'} />
                                <div className={styles['label']}>
                                    { profile.auth !== null && profile.auth.user !== null && profile.auth.user.trakt !== null ? t('LOG_OUT') : t('SETTINGS_TRAKT_AUTHENTICATE') }
                                </div>
                            </Button>
                        </div>
                        <div className={styles['option-container']}>
                            <div className={styles['option-name-container']}>
                                <div className={styles['label']}>{ t('Calendar') }</div>
                            </div>
                            <Button className={classnames(styles['option-input-container'], styles['button-container'])} title={'Subscribe'} disabled={!(profile.auth && profile.auth.user && profile.auth.user._id)} tabIndex={-1} onClick={subscribeCalendarOnClick}>
                                <Icon className={styles['icon']} icon={'ic_calendar'} />
                                <div className={styles['label']}>{ t('SETTINGS_CALENDAR_SUBSCRIBE') }</div>
                            </Button>
                        </div>
                        <div className={styles['option-container']}>
                            <Button className={classnames(styles['option-input-container'], styles['link-container'])} title={t('SETTINGS_DATA_EXPORT')} tabIndex={-1} onClick={exportDataOnClick}>
                                <div className={styles['label']}>{ t('SETTINGS_DATA_EXPORT') }</div>
                            </Button>
                        </div>
                        <div className={styles['option-container']}>
                            <Button className={classnames(styles['option-input-container'], styles['link-container'])} title={t('SETTINGS_SUPPORT')} target={'_blank'} href={'https://stremio.zendesk.com/hc/en-us'}>
                                <div className={styles['label']}>{ t('SETTINGS_SUPPORT') }</div>
                            </Button>
                        </div>
                        <div className={styles['option-container']}>
                            <Button className={classnames(styles['option-input-container'], styles['link-container'])} title={'Source code'} target={'_blank'} href={`https://github.com/stremio/stremio-web/tree/${process.env.COMMIT_HASH}`}>
                                <div className={styles['label']}>Source code</div>
                            </Button>
                        </div>
                        <div className={styles['option-container']}>
                            <Button className={classnames(styles['option-input-container'], styles['link-container'])} title={t('TERMS_OF_SERVICE')} target={'_blank'} href={'https://www.stremio.com/tos'}>
                                <div className={styles['label']}>{ t('TERMS_OF_SERVICE') }</div>
                            </Button>
                        </div>
                        <div className={styles['option-container']}>
                            <Button className={classnames(styles['option-input-container'], styles['link-container'])} title={t('PRIVACY_POLICY')} target={'_blank'} href={'https://www.stremio.com/privacy'}>
                                <div className={styles['label']}>{ t('PRIVACY_POLICY') }</div>
                            </Button>
                        </div>
                    </div>
                    <div ref={playerSectionRef} className={styles['section-container']}>
                        <div className={styles['section-title']}>{ t('SETTINGS_NAV_PLAYER') }</div>
                        <div className={styles['option-container']}>
                            <div className={styles['option-name-container']}>
                                <div className={styles['label']}>{ t('SETTINGS_SUBTITLES_LANGUAGE') }</div>
                            </div>
                            <Multiselect
                                className={classnames(styles['option-input-container'], styles['multiselect-container'])}
                                {...subtitlesLanguageSelect}
                            />
                        </div>
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
                                <div className={styles['label']}>{ t('SETTINGS_REWIND_FAST_FORWARD_DURATION') }</div>
                            </div>
                            <Multiselect
                                className={classnames(styles['option-input-container'], styles['multiselect-container'])}
                                {...seekTimeDurationSelect}
                            />
                        </div>
                        <div className={styles['option-container']}>
                            <div className={styles['option-name-container']}>
                                <div className={styles['label']}>{ t('AUTO_PLAY') }</div>
                            </div>
                            <Checkbox
                                className={classnames(styles['option-input-container'], styles['checkbox-container'])}
                                {...bingeWatchingCheckbox}
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
                        <div className={styles['option-container']}>
                            <div className={styles['option-name-container']}>
                                <div className={styles['label']}>{ t('SETTINGS_PLAY_IN_BACKGROUND') }</div>
                            </div>
                            <Checkbox
                                className={classnames(styles['option-input-container'], styles['checkbox-container'])}
                                disabled={true}
                                tabIndex={-1}
                                {...playInBackgroundCheckbox}
                            />
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
                        <div className={styles['option-container']}>
                            <div className={styles['option-name-container']}>
                                <div className={styles['label']}>{ t('SETTINGS_HWDEC') }</div>
                            </div>
                            <Checkbox
                                className={classnames(styles['option-input-container'], styles['checkbox-container'])}
                                disabled={true}
                                tabIndex={-1}
                                {...hardwareDecodingCheckbox}
                            />
                        </div>
                    </div>
                    <div ref={streamingServerSectionRef} className={styles['section-container']}>
                        <div className={styles['section-title']}>{ t('SETTINGS_NAV_STREAMING') }</div>
                        <div className={styles['option-container']}>
                            <Button className={classnames(styles['option-input-container'], styles['button-container'])} title={'Reload'} onClick={reloadStreamingServer}>
                                <div className={styles['label']}>{ t('RELOAD') }</div>
                            </Button>
                        </div>
                        <div className={styles['option-container']}>
                            <div className={styles['option-name-container']}>
                                <div className={styles['label']}>{ t('STATUS') }</div>
                            </div>
                            <div className={classnames(styles['option-input-container'], styles['info-container'])}>
                                <div className={styles['label']}>
                                    {
                                        streamingServer.settings === null ?
                                            'NotLoaded'
                                            :
                                            streamingServer.settings.type === 'Ready' ?
                                                t('SETTINGS_SERVER_STATUS_ONLINE')
                                                :
                                                streamingServer.settings.type === 'Error' ?
                                                    `${t('SETTINGS_SERVER_STATUS_ERROR')}: (${streamingServer.settings.content})`
                                                    :
                                                    streamingServer.settings.type
                                    }
                                </div>
                            </div>
                        </div>
                        <div className={styles['option-container']}>
                            <div className={styles['option-name-container']}>
                                <div className={styles['label']}>Url</div>
                            </div>
                            <div className={classnames(styles['option-input-container'], styles['configure-input-container'])}>
                                <div className={styles['label']} title={streamingServerUrlInput.value}>{streamingServerUrlInput.value}</div>
                                <Button className={styles['configure-button-container']} title={'Configure server url'} onClick={openConfigureServerUrlModal}>
                                    <Icon className={styles['icon']} icon={'ic_settings'} />
                                </Button>
                            </div>
                        </div>
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
                                <div className={styles['label']}>{ t('SETTINGS_SHORTCUT_MENU_INFO') }</div>
                            </div>
                            <div className={classnames(styles['option-input-container'], styles['shortcut-container'])}>
                                <kbd>I</kbd>
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
                                <kbd>5</kbd>
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
                </div>
            </div>
            {
                configureServerUrlModalOpen ?
                    <ModalDialog
                        className={styles['configure-server-url-modal-container']}
                        title={t('SETTINGS_SERVER_CONFIGURE_TITLE')}
                        buttons={configureServerUrlModalButtons}
                        onCloseRequest={closeConfigureServerUrlModal}>
                        <TextInput
                            ref={configureServerUrlInputRef}
                            autoFocus={true}
                            className={styles['server-url-input']}
                            type={'text'}
                            defaultValue={streamingServerUrlInput.value}
                            placeholder={t('SETTINGS_SERVER_CONFIGURE_INPUT')}
                            onSubmit={configureServerUrlOnSubmit}
                        />
                    </ModalDialog>
                    :
                    null
            }
        </MainNavBars>
    );
};

const SettingsFallback = () => (
    <MainNavBars className={styles['settings-container']} route={'settings'} />
);

module.exports = withCoreSuspender(Settings, SettingsFallback);
