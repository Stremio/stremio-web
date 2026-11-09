import React from 'react';
import { useTranslation } from 'react-i18next';
import { ColorInput, MultiselectMenu, Toggle } from 'stremio/components';
import { Group, Row } from '../components';
import SubtitlesPreview from './SubtitlesPreview';
import usePlayerOptions from './usePlayerOptions';

type Props = {
    profile: Profile,
};

const Player = ({ profile }: Props) => {
    const { t } = useTranslation();

    const {
        subtitlesLanguageSelect,
        subtitlesSizeSelect,
        subtitlesOffsetSelect,
        subtitlesTextColorInput,
        subtitlesBackgroundColorInput,
        subtitlesOutlineColorInput,
        assSubtitlesStylingToggle,
        audioLanguageSelect,
        seekTimeDurationSelect,
        seekShortTimeDurationSelect,
        playInExternalPlayerSelect,
        nextVideoPopupDurationSelect,
        bingeWatchingToggle,
    } = usePlayerOptions(profile);

    return (
        <React.Fragment>
            <Group title={t('SETTINGS_SECTION_SUBTITLES')}>
                <SubtitlesPreview settings={profile.settings} />
                <Row rowId={'subLang'} label={t('SETTINGS_SUBTITLES_LANGUAGE')} control={'wide'}>
                    <MultiselectMenu className={'multiselect'} portal={true} {...subtitlesLanguageSelect} />
                </Row>
                <Row rowId={'subSize'} label={t('SETTINGS_SUBTITLES_SIZE')} control={'wide'}>
                    <MultiselectMenu className={'multiselect'} portal={true} {...subtitlesSizeSelect} />
                </Row>
                <Row rowId={'subPos'} label={t('PLAYER_SUBTITLES_VERTICAL_POSITION')} control={'wide'}>
                    <MultiselectMenu className={'multiselect'} portal={true} {...subtitlesOffsetSelect} />
                </Row>
                <Row rowId={'subColor'} label={t('SETTINGS_SUBTITLES_COLOR')} control={'wide'}>
                    <ColorInput className={'color-input'} {...subtitlesTextColorInput} />
                </Row>
                <Row rowId={'subBg'} label={t('SETTINGS_SUBTITLES_COLOR_BACKGROUND')} control={'wide'}>
                    <ColorInput className={'color-input'} {...subtitlesBackgroundColorInput} />
                </Row>
                <Row rowId={'subOutline'} label={t('SETTINGS_SUBTITLES_COLOR_OUTLINE')} control={'wide'}>
                    <ColorInput className={'color-input'} {...subtitlesOutlineColorInput} />
                </Row>
                <Row rowId={'ass'} label={t('SETTINGS_ASS_SUBTITLES_STYLING')}>
                    <Toggle aria-label={t('SETTINGS_ASS_SUBTITLES_STYLING')} {...assSubtitlesStylingToggle} />
                </Row>
            </Group>
            <Group title={t('SETTINGS_SECTION_AUDIO')}>
                <Row rowId={'audio'} label={t('SETTINGS_DEFAULT_AUDIO_TRACK')} control={'wide'}>
                    <MultiselectMenu className={'multiselect'} portal={true} {...audioLanguageSelect} />
                </Row>
            </Group>
            <Group title={t('SETTINGS_SECTION_CONTROLS')}>
                <Row rowId={'seek'} label={t('SETTINGS_SEEK_KEY')} control={'wide'}>
                    <MultiselectMenu className={'multiselect'} portal={true} {...seekTimeDurationSelect} />
                </Row>
                <Row rowId={'seekShift'} label={t('SETTINGS_SEEK_KEY_SHIFT')} control={'wide'}>
                    <MultiselectMenu className={'multiselect'} portal={true} {...seekShortTimeDurationSelect} />
                </Row>
            </Group>
            <Group title={t('SETTINGS_SECTION_AUTO_PLAY')}>
                <Row rowId={'auto'} label={t('AUTO_PLAY')}>
                    <Toggle aria-label={t('AUTO_PLAY')} {...bingeWatchingToggle} />
                </Row>
                <Row rowId={'popup'} label={t('SETTINGS_NEXT_VIDEO_POPUP_DURATION')} control={'wide'}>
                    <MultiselectMenu className={'multiselect'} portal={true} {...nextVideoPopupDurationSelect} />
                </Row>
            </Group>
            <Group title={t('SETTINGS_SECTION_ADVANCED')}>
                <Row rowId={'external'} label={t('SETTINGS_PLAY_IN_EXTERNAL_PLAYER')} control={'wide'}>
                    <MultiselectMenu className={'multiselect'} portal={true} {...playInExternalPlayerSelect} />
                </Row>
            </Group>
        </React.Fragment>
    );
};

export default Player;
