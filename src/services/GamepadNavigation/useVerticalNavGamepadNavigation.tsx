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

            const delta = direction === 'next' ? 1 : -1;
            const nextIndex = Math.max(0, Math.min(ROUTES.length - 1, currentIndex + delta));
            if (nextIndex === currentIndex) return;

            const route = ROUTES[nextIndex];
            window.location.hash = route === 'board' ? '#/' : `#/${route}`;
        };

        gamepad?.on('buttonLB', `tab-nav-${currentRoute}`, () => navigate('prev'));
        gamepad?.on('buttonRB', `tab-nav-${currentRoute}`, () => navigate('next'));

        return () => {
            gamepad?.off('buttonLB', `tab-nav-${currentRoute}`);
            gamepad?.off('buttonRB', `tab-nav-${currentRoute}`);
        };
    }, [gamepad, currentRoute]);
};

export default useVerticalGamepadNavigation;
