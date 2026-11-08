// Copyright (C) 2017-2026 Smart code 203358507

import React, { useCallback, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { usePlatform, useToast } from 'stremio/common';
import { Group, LinkRow, Row, RowButton } from '../components';
import styles from './Help.less';

type Props = {
    streamingServer: StreamingServer,
};

const Help = ({ streamingServer }: Props) => {
    const { t } = useTranslation();
    const { shell } = usePlatform();
    const toast = useToast();

    const versions = useMemo(() => {
        const settings = streamingServer?.settings?.type === 'Ready' ?
            streamingServer.settings.content as StreamingServerSettings : null;

        return [
            { label: t('SETTINGS_APP_VERSION'), value: process.env.VERSION, display: process.env.VERSION },
            { label: t('SETTINGS_BUILD_VERSION'), value: process.env.COMMIT_HASH, display: process.env.COMMIT_HASH?.slice(0, 13) },
            ...(settings?.serverVersion ? [{ label: t('SETTINGS_SERVER_VERSION'), value: settings.serverVersion, display: settings.serverVersion }] : []),
            ...(typeof shell.state.version === 'string' ? [{ label: t('SETTINGS_SHELL_VERSION'), value: shell.state.version, display: shell.state.version }] : []),
        ];
    }, [t, streamingServer?.settings, shell.state.version]);

    const onCopyDetails = useCallback(() => {
        navigator.clipboard.writeText(versions.map(({ label, value }) => `${label}: ${value}`).join('\n'));

        toast.show({
            type: 'success',
            title: t('SETTINGS_VERSIONS_COPIED'),
            timeout: 2500,
        });
    }, [versions, t, toast]);

    return (
        <React.Fragment>
            <Group title={t('SETTINGS_GROUP_HELP')}>
                <LinkRow label={t('SETTINGS_SUPPORT')} href={'https://stremio.zendesk.com/hc/en-us'} />
            </Group>
            <Group title={t('ABOUT_STREMIO')}>
                {
                    versions.map(({ label, value, display }) => (
                        <Row key={label} label={label} variant={'thin'}>
                            <div className={styles['value']} title={value}>{display}</div>
                        </Row>
                    ))
                }
                <Row variant={'end'}>
                    <RowButton label={t('SETTINGS_COPY_DETAILS')} onClick={onCopyDetails} />
                </Row>
            </Group>
            <Group title={t('SETTINGS_GROUP_LEGAL')}>
                <LinkRow label={t('TERMS_OF_SERVICE')} href={'https://www.stremio.com/tos'} />
                <LinkRow label={t('PRIVACY_POLICY')} href={'https://www.stremio.com/privacy'} />
                <LinkRow label={t('SETTINGS_SOURCE_CODE')} href={`https://github.com/stremio/stremio-web/tree/${process.env.COMMIT_HASH}`} />
            </Group>
        </React.Fragment>
    );
};

export default Help;
