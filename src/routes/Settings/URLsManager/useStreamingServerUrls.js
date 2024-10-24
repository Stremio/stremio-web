// Copyright (C) 2017-2024 Smart code 203358507

import { useCallback } from 'react';
import { useModelState, useToast } from 'stremio/common';
import useProfile from 'stremio/common/useProfile';
import { useServices } from 'stremio/services';

const useStreamingServerUrls = () => {
    const { core } = useServices();
    const profile = useProfile();
    const toast = useToast();
    const ctx = useModelState({ model: 'ctx' });
    const streamingServerUrls = ctx.streamingServerUrls;

    const addServerUrl = useCallback((url) => {
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

    const deleteServerUrl = useCallback((url) => {
        core.transport.dispatch({
            action: 'Ctx',
            args: {
                action: 'DeleteServerUrl',
                args: url,
            }
        });
    }, []);
    const selectServerUrl = useCallback((url) => {
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
    }, [profile.settings]);
    const reloadServer = useCallback(() => {
        core.transport.dispatch({
            action: 'StreamingServer',
            args: {
                action: 'Reload'
            }
        });
    }, []);

    return {
        streamingServerUrls,
        addServerUrl,
        deleteServerUrl,
        selectServerUrl,
        reloadServer
    };
};

export default useStreamingServerUrls;
