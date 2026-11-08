// Copyright (C) 2017-2026 Smart code 203358507

import React from 'react';
import { useTranslation } from 'react-i18next';
import { useDiscord, usePlatform } from 'stremio/common';
import { MultiselectMenu, Toggle } from 'stremio/components';
import { Group, Row } from '../components';
import useDeviceOptions from './useDeviceOptions';
import styles from './Device.less';

type Props = {
    profile: Profile,
};

const Device = ({ profile }: Props) => {
    const { t } = useTranslation();
    const platform = usePlatform();
    const { shell } = platform;
    const discord = useDiscord();

    const {
        surroundSoundToggle,
        hardwareDecodingToggle,
        gpuVideoProcessingToggle,
        videoModeSelect,
        pauseOnMinimizeToggle,
        quitOnCloseToggle,
        escExitFullscreenToggle,
        discordRpcToggle,
        mpvConfigSelect,
    } = useDeviceOptions(profile);

    return (
        <React.Fragment>
            <Group title={t('PLAYBACK')}>
                <Row label={t('SETTINGS_SURROUND_SOUND')}>
                    <Toggle {...surroundSoundToggle} />
                </Row>
                {
                    shell.active &&
                        <Row label={t('SETTINGS_HWDEC')}>
                            <Toggle {...hardwareDecodingToggle} />
                        </Row>
                }
                {
                    shell.active && shell.capabilities.gpuVideoProcessing &&
                        <Row label={t('SETTINGS_GPU_VIDEO_PROCESSING')}>
                            <Toggle {...gpuVideoProcessingToggle} />
                        </Row>
                }
                {
                    shell.active && platform.name === 'windows' &&
                        <Row label={t('SETTINGS_VIDEO_MODE')} control={'wide'}>
                            <MultiselectMenu className={'multiselect'} portal={true} {...videoModeSelect} />
                        </Row>
                }
                {
                    shell.active &&
                        <Row label={t('SETTINGS_PAUSE_MINIMIZED')}>
                            <Toggle {...pauseOnMinimizeToggle} />
                        </Row>
                }
                {
                    mpvConfigSelect !== null &&
                        <Row label={t('SETTINGS_MPV_CONFIG')} control={'wide'}>
                            <div className={styles['mpv-config-control']} title={mpvConfigSelect.title}>
                                <MultiselectMenu className={'multiselect'} portal={true} {...mpvConfigSelect} />
                            </div>
                        </Row>
                }
            </Group>
            {
                shell.active &&
                    <Group title={t('SETTINGS_GROUP_DESKTOP_APP')}>
                        <Row label={t('SETTINGS_QUIT_ON_CLOSE')}>
                            <Toggle {...quitOnCloseToggle} />
                        </Row>
                        <Row label={t('SETTINGS_FULLSCREEN_EXIT')}>
                            <Toggle {...escExitFullscreenToggle} />
                        </Row>
                        {
                            discord.available &&
                                <Row label={t('SETTINGS_DISCORD')}>
                                    <Toggle {...discordRpcToggle} />
                                </Row>
                        }
                    </Group>
            }
        </React.Fragment>
    );
};

export default Device;
