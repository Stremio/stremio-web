import React, { forwardRef, useCallback, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { usePlatform } from 'stremio/common';
import { Section, Link } from '../components';
import User from './User';
import useDataExport from './useDataExport';

type Props = {
    profile: Profile,
};

const General = forwardRef<HTMLDivElement, Props>(({ profile }: Props, ref) => {
    const { t } = useTranslation();
    const platform = usePlatform();
    const [dataExport, loadDataExport] = useDataExport();

    const onExportData = useCallback(() => {
        loadDataExport();
    }, []);

    useEffect(() => {
        if (dataExport.exportUrl) {
            platform.openExternal(dataExport.exportUrl);
        }
    }, [dataExport.exportUrl]);

    return <>
        <Section ref={ref}>
            <User profile={profile} />
        </Section>

        <Section>
            {
                profile?.auth?.user &&
                    <Link
                        label={t('SETTINGS_DATA_EXPORT')}
                        onClick={onExportData}
                    />
            }
            <Link
                label={t('SETTINGS_SUPPORT')}
                href={'https://stremio.zendesk.com/hc/en-us'}
            />
            <Link
                label={t('SETTINGS_SOURCE_CODE')}
                href={`https://github.com/stremio/stremio-web/tree/${process.env.COMMIT_HASH}`}
            />
            <Link
                label={t('TERMS_OF_SERVICE')}
                href={'https://www.stremio.com/tos'}
            />
            <Link
                label={t('PRIVACY_POLICY')}
                href={'https://www.stremio.com/privacy'}
            />
            {
                profile?.auth?.user &&
                    <Link
                        label={t('SETTINGS_ACC_DELETE')}
                        href={'https://stremio.zendesk.com/hc/en-us/articles/360021428911-How-to-delete-my-account'}
                    />
            }
            {
                profile?.auth?.user?.email &&
                    <Link
                        label={t('SETTINGS_CHANGE_PASSWORD')}
                        href={`https://www.strem.io/reset-password/${profile.auth.user.email}`}
                    />
            }
        </Section>
    </>;
});

export default General;
