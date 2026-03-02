import React, { forwardRef, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import Icon from '@stremio/stremio-icons/react';
import { Button, MultiselectMenu } from 'stremio/components';
import { useToast } from 'stremio/common';
import { Section, Option } from '../components';
import URLsManager from './URLsManager';
import useStreamingOptions from './useStreamingOptions';
import styles from './Streaming.less';

type Props = {
    profile: Profile,
    streamingServer: StreamingServer,
};

const Streaming = forwardRef<HTMLDivElement, Props>(({ profile, streamingServer }: Props, ref) => {
    const { t } = useTranslation();
    const toast = useToast();

    const {
        streamingServerRemoteUrlInput,
        remoteEndpointSelect,
        cacheSizeSelect,
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
        <Section ref={ref} label={'SETTINGS_NAV_STREAMING'}>
            <URLsManager />
            {
                streamingServerRemoteUrlInput.value !== null &&
                    <Option className={styles['configure-input-container']} label={'SETTINGS_REMOTE_URL'}>
                        <div className={styles['label']} title={streamingServerRemoteUrlInput.value}>{streamingServerRemoteUrlInput.value}</div>
                        <Button className={styles['configure-button-container']} title={t('SETTINGS_COPY_REMOTE_URL')} onClick={onCopyRemoteUrl}>
                            <Icon className={styles['icon']} name={'link'} />
                        </Button>
                    </Option>
            }
            {
                profile.auth !== null && profile.auth.user !== null && remoteEndpointSelect !== null &&
                    <Option label={'SETTINGS_HTTPS_ENDPOINT'}>
                        <MultiselectMenu
                            className={'multiselect'}
                            {...remoteEndpointSelect}
                        />
                    </Option>
            }
            {
                cacheSizeSelect !== null &&
                    <Option label={'SETTINGS_SERVER_CACHE_SIZE'}>
                        <MultiselectMenu
                            className={'multiselect'}
                            {...cacheSizeSelect}
                        />
                    </Option>
            }
            {
                torrentProfileSelect !== null &&
                    <Option label={'SETTINGS_SERVER_TORRENT_PROFILE'}>
                        <MultiselectMenu
                            className={'multiselect'}
                            {...torrentProfileSelect}
                        />
                    </Option>
            }
            {
                transcodingProfileSelect !== null &&
                    <Option label={'SETTINGS_TRANSCODE_PROFILE'}>
                        <MultiselectMenu
                            className={'multiselect'}
                            {...transcodingProfileSelect}
                        />
                    </Option>
            }
        </Section>
    );
});

export default Streaming;
