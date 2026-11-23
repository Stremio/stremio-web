// Copyright (C) 2017-2026 Smart code 203358507

import { useEffect } from 'react';
import { useGamepad } from '../GamepadContext';

const ROUTES = ['search', 'board', 'discover', 'library', 'calendar', 'addons', 'settings'];

const useVerticalGamepadNavigation = (_sectionRef: React.RefObject<HTMLDivElement>, currentRoute: string) => {
    const gamepad = useGamepad();

    useEffect(() => {
        const navigate = (direction: 'prev' | 'next') => {
            const currentIndex = ROUTES.indexOf(currentRoute);
            if (currentIndex === -1) return;

            let nextIndex = currentIndex;
            if (direction === 'next') nextIndex = Math.min(currentIndex + 1, ROUTES.length - 1);
            if (direction === 'prev') nextIndex = Math.max(currentIndex - 1, 0);

            if (nextIndex !== currentIndex) {
                document.dispatchEvent(new KeyboardEvent('keydown', { key: String(nextIndex), code: `Digit${nextIndex}`, bubbles: true }));
            }
        };

        const onPrev = () => navigate('prev');
        const onNext = () => navigate('next');
        gamepad?.on('buttonLT', currentRoute, onPrev);
        gamepad?.on('buttonRT', currentRoute, onNext);

        return () => {
            gamepad?.off('buttonLT', currentRoute, onPrev);
            gamepad?.off('buttonRT', currentRoute, onNext);
        };
    }, [gamepad, currentRoute]);
};

export default useVerticalGamepadNavigation;
