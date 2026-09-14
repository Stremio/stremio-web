import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useCore } from 'stremio/core';
import Button from 'stremio/components/Button';
import styles from './SourceCheckDialog.less';

const ModalDialog = require('stremio/components/ModalDialog');

type Status = 'Unknown' | 'Checking' | 'SourcesFound' | 'ExternalOnly' | 'NoSources' |
    'CheckFailed' | 'NoProvider' | 'ChooseVideo' | 'Timeout' | 'Unsupported';
type Preview = { id: string | null, status: Exclude<Status, 'Timeout' | 'Unsupported'> };
type Props = { id: string, name: string, href: string, onClose: () => void };

const SourceCheckDialog = ({ id, name, href, onClose }: Props) => {
    const { t } = useTranslation();
    const core = useCore();
    const [attempt, setAttempt] = useState(0);
    const [status, setStatus] = useState<Status>('Checking');

    useEffect(() => {
        let active = true;
        let expired = false;
        let sequence = 0;
        let applied = 0;
        const unload = () => core.transport.dispatch({ action: 'Unload' }, 'source_preview').catch(() => undefined);
        const timeout = window.setTimeout(() => {
            if (active) {
                expired = true;
                setStatus('Timeout');
                unload();
            }
        }, 15000);
        const read = async (models: string[]) => {
            if (!models.includes('source_preview')) return;
            const request = ++sequence;
            try {
                const preview = await core.transport.getState('source_preview') as Preview;
                if (!active || expired || request < applied) return;
                applied = request;
                if (preview.id !== id && preview.id !== null) return;
                setStatus(preview.id === id ? preview.status : 'Unknown');
                if (preview.status !== 'Checking') window.clearTimeout(timeout);
            } catch {
                if (active && !expired) {
                    setStatus('Unsupported');
                    window.clearTimeout(timeout);
                }
            }
        };
        core.on('state', read);
        setStatus('Checking');
        core.transport.dispatch({ action: 'Load', args: { model: 'SourcePreview', args: id } }, 'source_preview')
            .then(() => read(['source_preview']))
            .catch(() => {
                if (active && !expired) {
                    setStatus('Unsupported');
                    window.clearTimeout(timeout);
                }
            });
        return () => {
            active = false;
            window.clearTimeout(timeout);
            core.off('state', read);
            unload();
        };
    }, [core, id, attempt]);

    const messages: Record<Status, string> = {
        Unknown: t('SOURCE_CHECK_Unknown'),
        Checking: t('SOURCE_CHECK_Checking'),
        SourcesFound: t('SOURCE_CHECK_SourcesFound'),
        ExternalOnly: t('SOURCE_CHECK_ExternalOnly'),
        NoSources: t('SOURCE_CHECK_NoSources'),
        CheckFailed: t('SOURCE_CHECK_CheckFailed'),
        NoProvider: t('SOURCE_CHECK_NoProvider'),
        ChooseVideo: t('SOURCE_CHECK_ChooseVideo'),
        Timeout: t('SOURCE_CHECK_TIMEOUT'),
        Unsupported: t('SOURCE_CHECK_UNSUPPORTED'),
    };

    return (
        <ModalDialog title={name} onCloseRequest={onClose} autoFocus={true} role={'dialog'} aria-modal={true} aria-label={name}>
            <div className={styles.content}>
                <p role={'status'} aria-live={'polite'}>{messages[status]}</p>
                <p>{t('SOURCE_CHECK_PRIVACY')}</p>
                <div className={styles.actions}>
                    {status === 'SourcesFound' && <Button href={href} onClick={onClose}>{t('SOURCE_CHECK_OPEN')}</Button>}
                    {status !== 'Checking' && status !== 'Unsupported' && (
                        <button type={'button'} onClick={() => setAttempt((value) => value + 1)}>{t('SOURCE_CHECK_RETRY')}</button>
                    )}
                    <Button href={'#/addons'} onClick={onClose}>{t('SOURCE_CHECK_ADDONS')}</Button>
                    <Button href={href} onClick={onClose}>{t('SOURCE_CHECK_DETAILS')}</Button>
                </div>
            </div>
        </ModalDialog>
    );
};

export default SourceCheckDialog;
