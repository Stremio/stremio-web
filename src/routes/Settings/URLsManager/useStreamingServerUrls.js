// Copyright (C) 2017-2024 Smart code 203358507

import { useCallback } from 'react';
import { useServices } from 'stremio/services';
import { useToast } from './Toast';
import useModelState from './useModelState';
import useProfile from './useProfile';

const useStreamingServerUrls = () => {
    const { core } = useServices();
    const profile = useProfile();
    const toast = useToast();
    const ctx = useModelState({ model: 'ctx' });

    const streamingServerUrls = ctx.streamingServerUrls.sort((a, b) => {
        const dateA = new Date(a.mtime).getTime();
        const dateB = new Date(b.mtime).getTime();
        return dateA - dateB;
    });

    const onAdd = useCallback((url) => {
        const isValidUrl = (url) => {
            try {
                new URL(url);
                return true;
            } catch (_) {
                return false;
            }
        };

        if (isValidUrl(url)) {
            toast.show({
                type: 'success',
                title: 'New URL added',
                message: 'The new URL has been added successfully',
                timeout: 4000
            });

            core.transport.dispatch({
                action: 'Ctx',
                args: {
                    action: 'AddServerUrl',
                    args: url,
                }
            });
        } else {
            toast.show({
                type: 'error',
                title: 'Invalid URL',
                message: 'Please provide a valid URL',
                timeout: 4000
            });
        }
    }, []);

    const onDelete = useCallback((url) => {
        core.transport.dispatch({
            action: 'Ctx',
            args: {
                action: 'DeleteServerUrl',
                args: url,
            }
        });
    }, []);
    const onSelect = useCallback((url) => {
        core.transport.dispatch({
            action: 'Ctx',
            args: {
                action: 'UpdateSettings',
                args: {
                    ...profile.settings,
                    streamingServerUrl: url
                }
            }
        });
    }, []);
    const onReload = useCallback(() => {
        core.transport.dispatch({
            action: 'StreamingServer',
            args: {
                action: 'Reload'
            }
        });
    }, []);

    const actions = { onAdd, onDelete, onSelect, onReload };

    return { streamingServerUrls, actions };
};

export default useStreamingServerUrls;
