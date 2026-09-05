// Copyright (C) 2017-2026 Smart code 203358507

import { useEffect } from 'react';
import { useNavigate } from 'react-router';
import { useGamepad } from '../GamepadContext';
import useFullscreen from 'stremio/common/Fullscreen';

const useHorizontalNavGamepadNavigation = (gamepadHandlerId: string, enableGoBack: boolean) => {
    const gamepad = useGamepad();
    const navigate = useNavigate();
    const [fullscreen,,,toggleFullscreen] = useFullscreen();

    useEffect(() => {
        const goBack = () => enableGoBack && navigate(-1);

        gamepad?.on('buttonY', gamepadHandlerId, toggleFullscreen as () => void);
        gamepad?.on('buttonB', gamepadHandlerId, goBack);

        return () => {
            gamepad?.off('buttonY', gamepadHandlerId);
            gamepad?.off('buttonB', gamepadHandlerId);
        };
    }, [gamepad, gamepadHandlerId, enableGoBack, fullscreen, navigate]);
};

export default useHorizontalNavGamepadNavigation;
