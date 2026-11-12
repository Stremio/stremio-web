import React from 'react';
import { useTranslation } from 'react-i18next';
import { Scale, MultiselectMenu, Toggle } from 'stremio/components';
import { Group, Row } from '../components';
import useInterfaceOptions from './useInterfaceOptions';
import SpotlightSettings, { type SpotlightState } from './SpotlightSettings';

type Props = {
    profile: Profile,
    spotlight: SpotlightState,
};

const Interface = ({ profile, spotlight }: Props) => {
    const { t } = useTranslation();

    const {
        interfaceLanguageSelect,
        interfaceSize,
        hideSpoilersToggle,
        gamepadSupportToggle,
    } = useInterfaceOptions(profile);

    return (
        <React.Fragment>
            <Group title={t('SETTINGS_GROUP_LANGUAGE_DISPLAY')}>
                <Row rowId={'lang'} label={t('SETTINGS_UI_LANGUAGE')} control={'wide'}>
                    <MultiselectMenu className={'multiselect'} portal={true} {...interfaceLanguageSelect} />
                </Row>
                <Row rowId={'zoom'} label={t('SETTINGS_UI_ZOOM')} control={'scale'} stackOnPhone={true}>
                    <Scale {...interfaceSize} />
                </Row>
            </Group>
            <Group title={t('SETTINGS_SECTION_BOARD')}>
                <SpotlightSettings profile={profile} spotlight={spotlight} />
            </Group>
            <Group title={t('SETTINGS_GROUP_BEHAVIOR')}>
                <Row rowId={'blur'} label={t('SETTINGS_BLUR_UNWATCHED_IMAGE')}>
                    <Toggle aria-label={t('SETTINGS_BLUR_UNWATCHED_IMAGE')} {...hideSpoilersToggle} />
                </Row>
                <Row rowId={'gamepad'} label={t('SETTINGS_GAMEPAD')}>
                    <Toggle aria-label={t('SETTINGS_GAMEPAD')} {...gamepadSupportToggle} />
                </Row>
            </Group>
        </React.Fragment>
    );
};

export default Interface;
