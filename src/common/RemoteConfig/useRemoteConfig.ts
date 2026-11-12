// Copyright (C) 2017-2026 Smart code 203358507

import { useCallback } from 'react';
import { useCore } from 'stremio/core';
import useModelState from 'stremio/common/useModelState';

const map = (ctx: Ctx) => ctx.remoteConfig;

const useRemoteConfig = () => {
    const core = useCore();
    const remoteConfig = useModelState({ model: 'ctx', action: null, map }) as RemoteConfig;

    const dispatch = useCallback((args: { action: string, args?: unknown }) => {
        core.transport.dispatch({
            action: 'Ctx',
            args: {
                action: 'RemoteConfig',
                args,
            },
        });
    }, [core.transport]);

    const pull = useCallback(() => {
        dispatch({ action: 'Pull' });
    }, [dispatch]);

    const notificationShown = useCallback((id: string) => {
        dispatch({ action: 'NotificationShown', args: id });
    }, [dispatch]);

    const notificationAction = useCallback((id: string, button: string) => {
        dispatch({ action: 'NotificationAction', args: { id, button } });
    }, [dispatch]);

    const dismissNotification = useCallback((id: string) => {
        dispatch({ action: 'DismissNotification', args: id });
    }, [dispatch]);

    const experimentExposed = useCallback((id: string) => {
        dispatch({ action: 'ExperimentExposed', args: id });
    }, [dispatch]);

    const experimentEvent = useCallback((id: string, event: string) => {
        dispatch({ action: 'ExperimentEvent', args: { id, event } });
    }, [dispatch]);

    return {
        remoteConfig,
        pull,
        notificationShown,
        notificationAction,
        dismissNotification,
        experimentExposed,
        experimentEvent,
    };
};

export default useRemoteConfig;
