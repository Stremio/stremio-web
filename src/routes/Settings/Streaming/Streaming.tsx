import React, { useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import Icon from '@stremio/stremio-icons/react';
import { MultiselectMenu } from 'stremio/components';
import { useToast } from 'stremio/common';
import { Group, Row, RowButton } from '../components';
import URLsManager from './URLsManager';
import useStreamingOptions from './useStreamingOptions';
import styles from './Streaming.less';

type Props = {
    profile: Profile,
    streamingServer: StreamingServer,
};

const Streaming = ({ profile, streamingServer }: Props) => {
    const { t } = useTranslation();
    const toast = useToast();

    const {
        streamingServerRemoteUrlInput,
        remoteEndpointSelect,
        cacheSizeSelect,
        cacheLocationSelect,
        cacheLocationError,
        settingsDisabled,
        torrentProfileSelect,
        transcodingProfileSelect,
    } = useStreamingOptions(streamingServer);

    const onCopyRemoteUrl = useCallback(() => {
        if (streamingServer.remoteUrl) {
            navigator.clipboard.writeText(streamingServer.remoteUrl);

            toast.show({
                type: 'success',
                title: t('SETTINGS_REMOTE_URL_COPIED'),
                timeout: 2500,
            });
        }
    }, [streamingServer.remoteUrl]);

    return (
        <React.Fragment>
            <Group rowId={'urls'} title={t('SETTINGS_GROUP_STREAMING_SERVER')} padded={true}>
                <URLsManager selectedUrl={profile.settings.streamingServerUrl} settings={streamingServer.settings} />
            </Group>
            {
                streamingServerRemoteUrlInput.value !== null &&
                    <Group>
                        <Row rowId={'remoteUrl'} label={t('SETTINGS_REMOTE_URL')} description={streamingServerRemoteUrlInput.value} stackOnPhone={true}>
                            <RowButton label={t('COPY')} onClick={onCopyRemoteUrl} />
                        </Row>
                    </Group>
            }
            {
                streamingServer.settings?.type === 'Ready' &&
                    <Group
                        title={t('SETTINGS_GROUP_SERVER_OPTIONS')}
                        description={streamingServerRemoteUrlInput.value !== null ? t('SETTINGS_SERVER_OPTIONS_REMOTE_DESC') : undefined}
                    >
                        {
                            profile.auth !== null && profile.auth.user !== null && remoteEndpointSelect !== null &&
                                <Row rowId={'https'} label={t('SETTINGS_STREAMING_HTTPS_ENDPOINT')} control={'wide'}>
                                    <MultiselectMenu className={'multiselect'} portal={true} {...remoteEndpointSelect} disabled={settingsDisabled} />
                                </Row>
                        }
                        {
                            cacheSizeSelect !== null &&
                                <Row rowId={'cache'} label={t('SETTINGS_SERVER_CACHE_SIZE')} control={'wide'}>
                                    <MultiselectMenu className={'multiselect'} portal={true} {...cacheSizeSelect} disabled={settingsDisabled} />
                                </Row>
                        }
                        {
                            cacheLocationSelect !== null &&
                                <Row rowId={'drive'} label={t('SETTINGS_CACHING_DRIVE')} control={'wide'}>
                                    <div className={styles['cache-location-control']} title={cacheLocationSelect.title}>
                                        <MultiselectMenu className={'multiselect'} portal={true} {...cacheLocationSelect} />
                                        {cacheLocationError && <div className={styles['cache-location-error']} role={'alert'}>{cacheLocationError}</div>}
                                    </div>
                                </Row>
                        }
                        {
                            torrentProfileSelect !== null &&
                                <Row rowId={'torrent'} label={t('SETTINGS_SERVER_TORRENT_PROFILE')} control={'wide'}>
                                    <MultiselectMenu className={'multiselect'} portal={true} {...torrentProfileSelect} disabled={settingsDisabled} />
                                </Row>
                        }
                        {
                            transcodingProfileSelect !== null &&
                                <Row rowId={'transcode'} label={t('SETTINGS_TRANSCODE_PROFILE')} control={'wide'}>
                                    <MultiselectMenu className={'multiselect'} portal={true} {...transcodingProfileSelect} disabled={settingsDisabled} />
                                </Row>
                        }
                    </Group>
            }
            {
                streamingServer.settings?.type === 'Err' &&
                    <Group>
                        <div className={styles['notice']} role={'status'}>
                            <Icon className={styles['icon']} name={'warning'} />
                            <div className={styles['text']}>
                                <div className={styles['title']}>{t('SETTINGS_SERVER_OFFLINE_TITLE')}</div>
                                <p className={styles['description']}>{t('SETTINGS_SERVER_OFFLINE_DESC')}</p>
                            </div>
                        </div>
                    </Group>
            }
        </React.Fragment>
    );
};

export default Streaming;
