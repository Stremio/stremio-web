// Copyright (C) 2017-2026 Smart code 203358507

import { useEffect } from 'react';
import { useGamepad } from '../GamepadContext';
import useFullscreen from 'stremio/common/Fullscreen';

const useHorizontalNavGamepadNavigation = (gamepadHandlerId: string, onGoBack?: () => void) => {
    const gamepad = useGamepad();
    const [,,,toggleFullscreen] = useFullscreen();

    useEffect(() => {
        const goBack = () => onGoBack?.();

        gamepad?.on('buttonY', gamepadHandlerId, toggleFullscreen as () => void);
        gamepad?.on('buttonB', gamepadHandlerId, goBack);

        return () => {
            gamepad?.off('buttonY', gamepadHandlerId);
            gamepad?.off('buttonB', gamepadHandlerId);
        };
    }, [gamepad, gamepadHandlerId, onGoBack, toggleFullscreen]);
};

export default useHorizontalNavGamepadNavigation;
