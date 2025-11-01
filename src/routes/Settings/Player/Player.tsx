import React, { forwardRef } from 'react';
import { ColorInput, MultiselectMenu, Toggle } from 'stremio/components';
import { useServices } from 'stremio/services';
import { Category, Option, Section } from '../components';
import usePlayerOptions from './usePlayerOptions';
import { usePlatform } from 'stremio/common';

type Props = {
    profile: Profile,
};

const Player = forwardRef<HTMLDivElement, Props>(({ profile }: Props, ref) => {
    const { shell } = useServices();
    const platform = usePlatform();

    const {
        subtitlesLanguageSelect,
        subtitlesSizeSelect,
        subtitlesTextColorInput,
        subtitlesBackgroundColorInput,
        subtitlesOutlineColorInput,
        audioLanguageSelect,
        surroundSoundToggle,
        seekTimeDurationSelect,
        seekShortTimeDurationSelect,
        playInExternalPlayerSelect,
        nextVideoPopupDurationSelect,
        bingeWatchingToggle,
        playInBackgroundToggle,
        hardwareDecodingToggle,
        videoModeSelect,
        pauseOnMinimizeToggle,
    } = usePlayerOptions(profile);

    return (
        <Section ref={ref} label={'SETTINGS_NAV_PLAYER'}>
            <Category icon={'subtitles'} label={'SETTINGS_SECTION_SUBTITLES'}>
                <Option label={'SETTINGS_SUBTITLES_LANGUAGE'}>
                    <MultiselectMenu
                        className={'multiselect'}
                        {...subtitlesLanguageSelect}
                    />
                </Option>
                <Option label={'SETTINGS_SUBTITLES_SIZE'}>
                    <MultiselectMenu
                        className={'multiselect'}
                        {...subtitlesSizeSelect}
                    />
                </Option>
                <Option label={'SETTINGS_SUBTITLES_COLOR'}>
                    <ColorInput
                        className={'color-input'}
                        {...subtitlesTextColorInput}
                    />
                </Option>
                <Option label={'SETTINGS_SUBTITLES_COLOR_BACKGROUND'}>
                    <ColorInput
                        className={'color-input'}
                        {...subtitlesBackgroundColorInput}
                    />
                </Option>
                <Option label={'SETTINGS_SUBTITLES_COLOR_OUTLINE'}>
                    <ColorInput
                        className={'color-input'}
                        {...subtitlesOutlineColorInput}
                    />
                </Option>
            </Category>
            <Category icon={'volume-medium'} label={'SETTINGS_SECTION_AUDIO'}>
                <Option label={'SETTINGS_DEFAULT_AUDIO_TRACK'}>
                    <MultiselectMenu
                        className={'multiselect'}
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
                        className={'multiselect'}
                        {...seekTimeDurationSelect}
                    />
                </Option>
                <Option label={'SETTINGS_SEEK_KEY_SHIFT'}>
                    <MultiselectMenu
                        className={'multiselect'}
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
                        className={'multiselect'}
                        disabled={!profile.settings.bingeWatching}
                        {...nextVideoPopupDurationSelect}
                    />
                </Option>
            </Category>
            <Category icon={'glasses'} label={'SETTINGS_SECTION_ADVANCED'}>
                <Option label={'SETTINGS_PLAY_IN_EXTERNAL_PLAYER'}>
                    <MultiselectMenu
                        className={'multiselect'}
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
                    shell.active && platform.name === 'windows' &&
                        <Option label={'SETTINGS_VIDEO_MODE'}>
                            <MultiselectMenu
                                className={'multiselect'}
                                {...videoModeSelect}
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
    );
});

export default Player;
