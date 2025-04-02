// Copyright (C) 2017-2023 Smart code 203358507

import { useCallback, useEffect, useState } from 'react';
import useShell, { type WindowVisibility } from './useShell';
import useSettings from './useSettings';

const useFullscreen = () => {
    const shell = useShell();
    const [settings] = useSettings();

    const [fullscreen, setFullscreen] = useState(false);

    const requestFullscreen = useCallback(() => {
        if (shell.active) {
            shell.send('win-set-visibility', { fullscreen: true });
        } else {
            document.documentElement.requestFullscreen();
        }
    }, []);

    const exitFullscreen = useCallback(() => {
        if (shell.active) {
            shell.send('win-set-visibility', { fullscreen: false });
        } else {
            document.exitFullscreen();
        }
    }, []);

    const toggleFullscreen = useCallback(() => {
        fullscreen ? exitFullscreen() : requestFullscreen();
    }, [fullscreen]);

    useEffect(() => {
        const onWindowVisibilityChanged = (state: WindowVisibility) => {
            setFullscreen(state.isFullscreen === true);
        };

        const onFullscreenChange = () => {
            setFullscreen(document.fullscreenElement === document.documentElement);
        };

        const onKeyDown = (event: KeyboardEvent) => {
            if (event.code === 'Escape' && settings.escExitFullscreen) {
                exitFullscreen();
            }

            if (event.code === 'F11' && shell.active) {
                toggleFullscreen();
            }
        };

        shell.on('win-visibility-changed', onWindowVisibilityChanged);
        document.addEventListener('keydown', onKeyDown);
        document.addEventListener('fullscreenchange', onFullscreenChange);

        return () => {
            shell.off('win-visibility-changed', onWindowVisibilityChanged);
            document.removeEventListener('keydown', onKeyDown);
            document.removeEventListener('fullscreenchange', onFullscreenChange);
        };
    }, [settings.escExitFullscreen]);

    return [fullscreen, requestFullscreen, exitFullscreen, toggleFullscreen];
};

export default useFullscreen;
