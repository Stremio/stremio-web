import { useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { usePlatform, useToast } from 'stremio/common';

let nextRequestId = 0;

type PickerResult = { requestId: number, path: string | null, error: string | null };

const useMpvConfig = () => {
    const { shell } = usePlatform();
    const { t } = useTranslation();
    const toast = useToast();
    const request = useRef<{ id: number, path: string } | null>(null);
    const [choosing, setChoosing] = useState(false);
    const path = shell.state.mpvConfig;

    useEffect(() => {
        const onSelected = ({ requestId, path, error }: PickerResult) => {
            if (request.current?.id !== requestId) return;
            const previousPath = request.current.path;
            request.current = null;
            setChoosing(false);
            if (error) {
                toast.show({ type: 'error', title: error, timeout: 5000 });
            } else if (path && path !== previousPath) {
                toast.show({ type: 'info', title: t('RESTART_REQUIRED_MESSAGE'), timeout: 5000 });
            }
        };
        shell.on('mpv-config-selected', onSelected);
        return () => {
            shell.off('mpv-config-selected', onSelected);
            request.current = null;
        };
    }, [shell.on, shell.off, t, toast]);

    const onSelect = (value: string) => {
        if (!path || choosing) return;
        const id = ++nextRequestId;
        request.current = { id, path };
        setChoosing(true);
        shell.send(value === 'default' ? 'reset-mpv-config' : 'pick-mpv-config', { requestId: id });
    };

    return path ? {
        options: [
            { label: `${t('SELECT')}…`, value: 'choose' },
            { label: t('SETTINGS_VIDEO_MODE_DEFAULT'), value: 'default' },
        ],
        title: path,
        disabled: choosing,
        onSelect,
    } : null;
};

export default useMpvConfig;
