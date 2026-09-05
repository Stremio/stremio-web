import { useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { usePlatform } from 'stremio/common';
import { useCore } from 'stremio/core';

let nextRequestId = 0;

const localServerUrl = (value: string | null | undefined) => {
    try {
        const url = new URL(value ?? '');
        if (!['http:', 'https:'].includes(url.protocol) || !['localhost', '127.0.0.1', '[::1]'].includes(url.hostname)) {
            return null;
        }
        url.hostname = '127.0.0.1';
        return url.href;
    } catch {
        return null;
    }
};

type PickerResult = { requestId: number, path: string | null, error: string | null };

const useCacheLocation = (streamingServer: StreamingServer) => {
    const core = useCore();
    const { shell, name } = usePlatform();
    const { t } = useTranslation();
    const request = useRef<{ id: number, transportUrl: string } | null>(null);
    const [choosing, setChoosing] = useState(false);
    const [pickerError, setPickerError] = useState<{ transportUrl: string, message: string } | null>(null);
    const transportUrl = streamingServer.selected?.transportUrl;
    const settings = streamingServer.settings?.type === 'Ready' ? streamingServer.settings.content : null;
    const option = streamingServer.settingsOptions?.find(({ id }) => id === 'cacheRoot');
    const selections = option?.selections ?? [];
    const update = streamingServer.cacheRootUpdate;
    const busy = update?.type === 'Loading';
    const localUrl = localServerUrl(transportUrl);
    const supported = ['macos', 'windows'].includes(name) && shell.capabilities.cacheDirectoryPicker &&
        option?.supportsDirectory === true &&
        localUrl !== null && localUrl === localServerUrl(shell.state.streamingServerUrl) &&
        selections.length && settings && update !== undefined;

    useEffect(() => {
        const onSelected = ({ requestId, path, error }: PickerResult) => {
            if (request.current?.id !== requestId) return;
            const { transportUrl } = request.current;
            request.current = null;
            setChoosing(false);
            if (error) {
                setPickerError({ transportUrl, message: error });
            } else if (path) {
                core.transport.dispatch({
                    action: 'StreamingServer',
                    args: { action: 'UpdateCacheRoot', args: { transportUrl, cacheRoot: path } }
                });
            }
        };
        shell.on('cache-directory-selected', onSelected);
        return () => {
            shell.off('cache-directory-selected', onSelected);
            request.current = null;
        };
    }, [core, shell.on, shell.off]);

    const onSelect = (value: string) => {
        if (!supported || !transportUrl || busy || choosing) return;
        setPickerError(null);
        if (value === 'choose') {
            const id = ++nextRequestId;
            request.current = { id, transportUrl };
            setChoosing(true);
            shell.send('pick-cache-directory', {
                requestId: id, serverUrl: shell.state.streamingServerUrl, directory: settings.cacheRoot,
            });
        } else if (value !== settings.cacheRoot) {
            core.transport.dispatch({
                action: 'StreamingServer',
                args: { action: 'UpdateCacheRoot', args: { transportUrl, cacheRoot: value } }
            });
        }
    };

    return {
        busy,
        error: supported && (pickerError && pickerError.transportUrl === transportUrl ? pickerError.message :
            update?.type === 'Err' ? t('GENERIC_ERROR_MESSAGE') : null),
        select: supported ? {
            options: [
                ...selections.filter(({ val }) => typeof val === 'string')
                    .map(({ name, val }) => ({ label: name, value: val as string })),
                { label: `${t('SELECT')}…`, value: 'choose' },
            ],
            value: settings.cacheRoot,
            title: settings.cacheRoot,
            disabled: busy || choosing,
            onSelect,
        } : null,
    };
};

export default useCacheLocation;
