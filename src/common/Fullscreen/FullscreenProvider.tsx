// Copyright (C) 2017-2026 Smart code 203358507

import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { withCoreSuspender } from '../CoreSuspender';
import onShortcut from '../Shortcuts/onShortcut';
import useSettings from '../useSettings';
import FullscreenContext, { type FullscreenContextValue } from './FullscreenContext';
import { usePlatform } from '../Platform';

type Props = {
    children: React.ReactNode,
};

const hasWebkitFullscreen = typeof HTMLVideoElement !== 'undefined' &&
    typeof HTMLVideoElement.prototype.webkitEnterFullscreen === 'function';

const FullscreenProvider = ({ children }: Props) => {
    const { shell } = usePlatform();
    const [settings] = useSettings();
    const escExitFullscreen = settings.escExitFullscreen;

    const videoElementRef = useRef<HTMLVideoElement | null>(null);
    const [hasVideoElement, setHasVideoElement] = useState(false);

    const [fullscreen, setFullscreen] = useState<boolean>(() => {
        if (typeof document === 'undefined') return false;
        return document.fullscreenElement === document.documentElement;
    });

    const setVideoElement = useCallback((el: HTMLVideoElement | null) => {
        videoElementRef.current = el;
        setHasVideoElement(el !== null);
    }, []);

    const supported = shell.active || document.fullscreenEnabled === true || (hasVideoElement && hasWebkitFullscreen);

    const requestFullscreen = useCallback(async () => {
        if (shell.active) {
            shell.send('win-set-visibility', { fullscreen: true });
        } else if (document.fullscreenEnabled) {
            try {
                await document.documentElement.requestFullscreen();
            } catch (err) {
                console.error('Error enabling fullscreen', err);
            }
        } else if (videoElementRef.current && hasWebkitFullscreen) {
            (videoElementRef.current as any).webkitEnterFullscreen();
        }
    }, [shell]);

    const exitFullscreen = useCallback(() => {
        if (shell.active) {
            shell.send('win-set-visibility', { fullscreen: false });
        } else if (document.fullscreenElement === document.documentElement) {
            document.exitFullscreen();
        } else if (videoElementRef.current && (videoElementRef.current as any).webkitDisplayingFullscreen) {
            (videoElementRef.current as any).webkitExitFullscreen();
        }
    }, [shell]);

    const toggleFullscreen = useCallback(() => {
        fullscreen ? exitFullscreen() : requestFullscreen();
    }, [fullscreen, exitFullscreen, requestFullscreen]);

    onShortcut('fullscreen', toggleFullscreen, [toggleFullscreen]);

    useEffect(() => {
        const videoElement = videoElementRef.current;

        const onWindowVisibilityChanged = (state: WindowVisibility) => {
            setFullscreen(state.isFullscreen === true);
        };

        const onFullscreenChange = () => {
            setFullscreen(document.fullscreenElement === document.documentElement);
        };

        const onWebkitFullscreenChange = () => {
            setFullscreen((videoElement as any)?.webkitDisplayingFullscreen === true);
        };

        const onKeyDown = (event: KeyboardEvent) => {
            if (event.code === 'Escape' && escExitFullscreen) {
                exitFullscreen();
            }

            if (event.code === 'F11' && shell.active) {
                toggleFullscreen();
            }
        };

        shell.on('win-visibility-changed', onWindowVisibilityChanged);
        document.addEventListener('keydown', onKeyDown);
        document.addEventListener('fullscreenchange', onFullscreenChange);
        videoElement?.addEventListener('webkitbeginfullscreen', onWebkitFullscreenChange);
        videoElement?.addEventListener('webkitendfullscreen', onWebkitFullscreenChange);

        return () => {
            shell.off('win-visibility-changed', onWindowVisibilityChanged);
            document.removeEventListener('keydown', onKeyDown);
            document.removeEventListener('fullscreenchange', onFullscreenChange);
            videoElement?.removeEventListener('webkitbeginfullscreen', onWebkitFullscreenChange);
            videoElement?.removeEventListener('webkitendfullscreen', onWebkitFullscreenChange);
        };
    }, [shell, toggleFullscreen, exitFullscreen, escExitFullscreen, hasVideoElement]);

    const value = useMemo<FullscreenContextValue>(
        () => [fullscreen, requestFullscreen, exitFullscreen, toggleFullscreen, supported, setVideoElement],
        [fullscreen, requestFullscreen, exitFullscreen, toggleFullscreen, supported, setVideoElement]
    );

    return (
        <FullscreenContext.Provider value={value}>
            {children}
        </FullscreenContext.Provider>
    );
};

export default withCoreSuspender(FullscreenProvider);
