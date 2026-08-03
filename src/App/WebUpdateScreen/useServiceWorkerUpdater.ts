// Copyright (C) 2017-2026 Smart code 203358507

import { useCallback, useEffect, useRef, useState } from 'react';
import { Workbox, type WorkboxLifecycleEvent, type WorkboxLifecycleWaitingEvent } from 'workbox-window';
import { usePlatform } from 'stremio/common';
import usePWA from 'stremio/common/usePWA';

const UPDATE_CHECK_INTERVAL = 30 * 60 * 1000;
const APPLY_TIMEOUT = 15 * 1000;

type UpdaterState =
    | { status: 'idle' }
    | { status: 'ready', autoApply: boolean }
    | { status: 'applying' }
    | { status: 'reload-ready' }
    | { status: 'failed' };

type Runtime = {
    workbox: Workbox | null,
    applying: boolean,
    timeout: ReturnType<typeof setTimeout> | null,
    checkForUpdate: (() => void) | null,
};

const clearApplyTimeout = (runtime: Runtime) => {
    if (runtime.timeout !== null) {
        clearTimeout(runtime.timeout);
        runtime.timeout = null;
    }
};

const useServiceWorkerUpdater = () => {
    const { shell } = usePlatform();
    const [isIOSPWA, isStandalonePWA] = usePWA();
    const [state, setState] = useState<UpdaterState>({ status: 'idle' });
    const [dismissed, setDismissed] = useState(false);
    const runtimeRef = useRef<Runtime>({
        workbox: null,
        applying: false,
        timeout: null,
        checkForUpdate: null,
    });
    const appLike = shell.active || Boolean(isIOSPWA) || Boolean(isStandalonePWA);

    const dismissUpdate = useCallback(() => {
        setDismissed(true);
    }, []);

    const applyUpdate = useCallback(() => {
        if (state.status === 'reload-ready') {
            window.location.reload();
            return;
        }

        const runtime = runtimeRef.current;
        if (
            runtime.applying ||
            runtime.workbox === null ||
            (state.status !== 'ready' && state.status !== 'failed')
        ) {
            return;
        }

        runtime.applying = true;
        clearApplyTimeout(runtime);
        setState({ status: 'applying' });
        runtime.timeout = setTimeout(() => {
            runtime.timeout = null;
            runtime.applying = false;
            setState({ status: 'failed' });
        }, APPLY_TIMEOUT);
        runtime.workbox.messageSkipWaiting();
    }, [state.status]);

    useEffect(() => {
        const serviceWorkerDisabled = process.env.SERVICE_WORKER_DISABLED as string | boolean | undefined;
        if (
            process.env.NODE_ENV !== 'production' ||
            serviceWorkerDisabled === 'true' ||
            serviceWorkerDisabled === true ||
            !('serviceWorker' in navigator)
        ) {
            return;
        }

        const runtime = runtimeRef.current;
        const workbox = new Workbox('service-worker.js');
        let registered = false;
        let lastUpdateCheck = Date.now();
        runtime.workbox = workbox;

        const onWaiting = (event: WorkboxLifecycleWaitingEvent) => {
            setDismissed(false);
            setState({
                status: 'ready',
                autoApply: appLike && event.wasWaitingBeforeRegister === true,
            });
        };
        const onControlling = (event: WorkboxLifecycleEvent) => {
            if (!event.isUpdate) {
                return;
            }

            clearApplyTimeout(runtime);
            if (runtime.applying) {
                window.location.reload();
            } else {
                setDismissed(false);
                setState({ status: 'reload-ready' });
            }
        };
        const checkForUpdate = () => {
            const now = Date.now();
            if (
                !registered ||
                navigator.serviceWorker.controller === null ||
                now - lastUpdateCheck < UPDATE_CHECK_INTERVAL
            ) {
                return;
            }

            lastUpdateCheck = now;
            workbox.update().catch((error) => {
                console.error('SW update check failed: ', error);
            });
        };
        runtime.checkForUpdate = checkForUpdate;

        workbox.addEventListener('waiting', onWaiting);
        workbox.addEventListener('controlling', onControlling);
        workbox.register()
            .then(() => {
                registered = true;
            })
            .catch((error) => {
                console.error('SW registration failed: ', error);
            });

        return () => {
            registered = false;
            workbox.removeEventListener('waiting', onWaiting);
            workbox.removeEventListener('controlling', onControlling);
            clearApplyTimeout(runtime);
            runtime.applying = false;
            runtime.checkForUpdate = null;
            if (runtime.workbox === workbox) {
                runtime.workbox = null;
            }
        };
    }, [appLike]);

    useEffect(() => {
        const onForeground = () => {
            setDismissed(false);
            runtimeRef.current.checkForUpdate?.();
        };
        const onVisibilityChange = () => {
            if (document.visibilityState === 'visible') {
                onForeground();
            }
        };
        const onShellVisibilityChange = ({ visible }: { visible?: boolean }) => {
            if (visible) {
                onForeground();
            }
        };

        document.addEventListener('visibilitychange', onVisibilityChange);
        shell.on('win-visibility-changed', onShellVisibilityChange);

        return () => {
            document.removeEventListener('visibilitychange', onVisibilityChange);
            shell.off('win-visibility-changed', onShellVisibilityChange);
        };
    }, [shell]);

    return {
        state,
        dismissed,
        applyUpdate,
        dismissUpdate,
    };
};

export default useServiceWorkerUpdater;
