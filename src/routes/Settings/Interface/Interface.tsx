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
                <Row label={t('SETTINGS_UI_LANGUAGE')} control={'wide'}>
                    <MultiselectMenu className={'multiselect'} portal={true} {...interfaceLanguageSelect} />
                </Row>
                <Row label={t('SETTINGS_UI_ZOOM')} control={'scale'} stackOnPhone={true}>
                    <Scale {...interfaceSize} tabIndex={-1} />
                </Row>
            </Group>
            <Group title={t('SETTINGS_SECTION_BOARD')} icon={'home'}>
                <SpotlightSettings profile={profile} spotlight={spotlight} />
            </Group>
            <Group title={t('SETTINGS_GROUP_BEHAVIOR')}>
                <Row label={t('SETTINGS_BLUR_UNWATCHED_IMAGE')}>
                    <Toggle {...hideSpoilersToggle} />
                </Row>
                <Row label={t('SETTINGS_GAMEPAD')}>
                    <Toggle {...gamepadSupportToggle} />
                </Row>
            </Group>
        </React.Fragment>
    );
};

export default Interface;
