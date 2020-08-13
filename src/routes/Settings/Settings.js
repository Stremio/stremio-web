// Copyright (C) 2017-2020 Smart code 203358507

const React = require('react');
const classnames = require('classnames');
const throttle = require('lodash.throttle');
const Icon = require('@stremio/stremio-icons/dom');
const { useRouteFocused } = require('stremio-router');
const { useServices } = require('stremio/services');
const { Button, Checkbox, MainNavBars, Multiselect, ColorInput, TextInput, ModalDialog, useProfile, useStreamingServer, useBinaryState } = require('stremio/common');
const useProfileSettingsInputs = require('./useProfileSettingsInputs');
const useStreamingServerSettingsInputs = require('./useStreamingServerSettingsInputs');
const styles = require('./styles');

const GENERAL_SECTION = 'general';
const PLAYER_SECTION = 'player';
const STREAMING_SECTION = 'streaming';

const Settings = () => {
    const { core } = useServices();
    const { routeFocused } = useRouteFocused();
    const profile = useProfile();
    const streamingServer = useStreamingServer();
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
    const sections = React.useMemo(() => ([
        { ref: generalSectionRef, id: GENERAL_SECTION },
        { ref: playerSectionRef, id: PLAYER_SECTION },
        { ref: streamingServerSectionRef, id: STREAMING_SECTION },
    ]), []);
    const [selectedSectionId, setSelectedSectionId] = React.useState(GENERAL_SECTION);
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
    React.useLayoutEffect(() => {
        if (routeFocused) {
            updateSelectedSectionId();
        }
        closeConfigureServerUrlModal();
    }, [routeFocused]);
    return (
        <MainNavBars className={styles['settings-container']} route={'settings'}>
            <div className={styles['settings-content']}>
                <div className={styles['side-menu-container']}>
                    <Button className={classnames(styles['side-menu-button'], { [styles['selected']]: selectedSectionId === GENERAL_SECTION })} title={'General'} data-section={GENERAL_SECTION} onClick={sideMenuButtonOnClick}>
                        General
                    </Button>
                    <Button className={classnames(styles['side-menu-button'], { [styles['selected']]: selectedSectionId === PLAYER_SECTION })} title={'Player'} data-section={PLAYER_SECTION} onClick={sideMenuButtonOnClick}>
                        Player
                    </Button>
                    <Button className={classnames(styles['side-menu-button'], { [styles['selected']]: selectedSectionId === STREAMING_SECTION })} title={'Streaming server'} data-section={STREAMING_SECTION} onClick={sideMenuButtonOnClick}>
                        Streaming server
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
                            <Button className={styles['user-panel-container']} title={'User panel'} target={'_blank'} href={'https://www.stremio.com/acc-settings'}>
                                <div className={styles['user-panel-label']}>User Panel</div>
                            </Button>
                        </div>
                        {
                            profile.auth === null ?
                                <div className={styles['option-container']}>
                                    <Button className={classnames(styles['option-input-container'], styles['button-container'])} title={'Log in / Sign up'} href={'#/intro'} onClick={logoutButtonOnClick}>
                                        <div className={styles['label']}>Log in / Sign up</div>
                                    </Button>
                                </div>
                                :
                                null
                        }
                        <div className={styles['option-container']}>
                            <div className={styles['option-name-container']}>
                                <div className={styles['label']}>Interface language</div>
                            </div>
                            <Multiselect
                                className={classnames(styles['option-input-container'], styles['multiselect-container'])}
                                disabled={true}
                                tabIndex={-1}
                                {...interfaceLanguageSelect}
                            />
                        </div>
                        <div className={styles['option-container']}>
                            <div className={styles['option-name-container']}>
                                <div className={styles['label']}>Trakt Scrobbling</div>
                            </div>
                            <Button className={classnames(styles['option-input-container'], styles['button-container'])} title={'Authenticate'} disabled={true} tabIndex={-1} onClick={authenticateTraktOnClick}>
                                <Icon className={styles['icon']} icon={'ic_trakt'} />
                                <div className={styles['label']}>Authenticate</div>
                            </Button>
                        </div>
                        <div className={styles['option-container']}>
                            <div className={styles['option-name-container']}>
                                <div className={styles['label']}>Facebook</div>
                            </div>
                            <Button className={classnames(styles['option-input-container'], styles['button-container'])} title={'Import'} disabled={true} tabIndex={-1} onClick={importFacebookOnClick}>
                                <Icon className={styles['icon']} icon={'ic_facebook'} />
                                <div className={styles['label']}>Import</div>
                            </Button>
                        </div>
                        <div className={styles['option-container']}>
                            <div className={styles['option-name-container']}>
                                <div className={styles['label']}>Calendar</div>
                            </div>
                            <Button className={classnames(styles['option-input-container'], styles['button-container'])} title={'Subscribe'} disabled={true} tabIndex={-1} onClick={subscribeCalendarOnClick}>
                                <Icon className={styles['icon']} icon={'ic_calendar'} />
                                <div className={styles['label']}>Subscribe</div>
                            </Button>
                        </div>
                        <div className={styles['option-container']}>
                            <Button className={classnames(styles['option-input-container'], styles['link-container'])} title={'Export user data'} disabled={true} tabIndex={-1} onClick={exportDataOnClick}>
                                <div className={styles['label']}>Export user data</div>
                            </Button>
                        </div>
                        <div className={styles['option-container']}>
                            <Button className={classnames(styles['option-input-container'], styles['link-container'])} title={'Contact support'} target={'_blank'} href={'https://stremio.zendesk.com/hc/en-us'}>
                                <div className={styles['label']}>Contact support</div>
                            </Button>
                        </div>
                        <div className={styles['option-container']}>
                            <Button className={classnames(styles['option-input-container'], styles['link-container'])} title={'Source code'} target={'_blank'} href={`https://github.com/stremio/stremio-web/tree/${process.env.COMMIT_HASH}`}>
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
                                disabled={true}
                                tabIndex={-1}
                                {...playInBackgroundCheckbox}
                            />
                        </div>
                        <div className={styles['option-container']}>
                            <div className={styles['option-name-container']}>
                                <div className={styles['label']}>Play in external player</div>
                            </div>
                            <Checkbox
                                className={classnames(styles['option-input-container'], styles['checkbox-container'])}
                                disabled={true}
                                tabIndex={-1}
                                {...playInExternalPlayerCheckbox}
                            />
                        </div>
                        <div className={styles['option-container']}>
                            <div className={styles['option-name-container']}>
                                <div className={styles['label']}>Hardware-accelerated decoding</div>
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
                                        streamingServer.settings === null ?
                                            'NotLoaded'
                                            :
                                            streamingServer.settings.type === 'Ready' ?
                                                'Online'
                                                :
                                                streamingServer.settings.type === 'Error' ?
                                                    `Error: (${streamingServer.settings.content})`
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
            {
                configureServerUrlModalOpen ?
                    <ModalDialog
                        className={styles['configure-server-url-modal-container']}
                        title={'Configure streaming server url'}
                        buttons={configureServerUrlModalButtons}
                        onCloseRequest={closeConfigureServerUrlModal}>
                        <TextInput
                            ref={configureServerUrlInputRef}
                            className={styles['server-url-input']}
                            type={'text'}
                            defaultValue={streamingServerUrlInput.value}
                            placeholder={'Enter a streaming server url'}
                            onSubmit={configureServerUrlOnSubmit}
                        />
                    </ModalDialog>
                    :
                    null
            }
        </MainNavBars>
    );
};

module.exports = Settings;
